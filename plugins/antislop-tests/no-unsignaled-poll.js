import { isMember, memberName } from './test-api.js';

const SPY_MATCHERS = new Set([
	'toHaveBeenCalled',
	'toHaveBeenCalledOnce',
	'toHaveBeenCalledTimes',
	'toHaveBeenCalledWith',
	'toHaveBeenCalledExactlyOnceWith',
	'toHaveBeenLastCalledWith',
	'toHaveBeenNthCalledWith',
	'toHaveReturned',
	'toHaveReturnedTimes',
	'toHaveReturnedWith',
	'toHaveLastReturnedWith',
	'toHaveNthReturnedWith',
	'toHaveResolved',
	'toHaveResolvedTimes',
	'toHaveResolvedWith',
	'toHaveLastResolvedWith',
	'toHaveNthResolvedWith',
]);
const FUNCTION_TYPES = new Set(['ArrowFunctionExpression', 'FunctionExpression']);

const WRAPPER_TYPES = new Set(['ChainExpression', 'TSNonNullExpression']);

// The property chain of a plain reference such as `server.requests.length`, or null for anything computed.
function referencePath(node) {
	const properties = [];
	let current = node;
	while (WRAPPER_TYPES.has(current.type) || current.type === 'MemberExpression') {
		if (current.type === 'MemberExpression') {
			properties.unshift(memberName(current) ?? '[]');
			current = current.object;
		} else {
			current = current.expression;
		}
	}
	return current.type === 'Identifier' ? [current.name, ...properties] : null;
}

// React's `ref.current`, Vue's `ref.value` and `wrapper.vm` hold rendered state rather than a recorder.
const RENDER_HANDLES = new Set(['current', 'value', 'vm']);
const DOM_ROOTS = new Set(['document', 'window']);

function plainPath(node) {
	const path = referencePath(node);
	if (!path || DOM_ROOTS.has(path[0]) || path.some(segment => RENDER_HANDLES.has(segment))) {
		return null;
	}
	return path;
}

function readsRecorder(node) {
	const path = plainPath(node);
	if (!path) {
		return false;
	}
	const last = path.at(-1);
	return path.includes('mock') || (path.length > 1 && (last === 'length' || last === 'size'));
}

function polledValue(callback) {
	if (!FUNCTION_TYPES.has(callback?.type)) {
		return null;
	}
	if (callback.body.type !== 'BlockStatement') {
		return callback.body;
	}
	if (callback.body.body.length !== 1) {
		return null;
	}
	const [statement] = callback.body.body;
	if (statement.type === 'ReturnStatement') {
		return statement.argument;
	}
	return statement.type === 'ExpressionStatement' ? statement.expression : null;
}

function assertsRecorder(node) {
	if (node?.type !== 'CallExpression' || node.callee.type !== 'MemberExpression') {
		return false;
	}
	const matcher = memberName(node.callee);
	const subject = memberName(node.callee.object) === 'not' ? node.callee.object.object : node.callee.object;
	if (subject.type !== 'CallExpression' || subject.callee.type !== 'Identifier' || subject.callee.name !== 'expect') {
		return false;
	}
	const [target] = subject.arguments;
	if (!target || target.type === 'SpreadElement') {
		return false;
	}
	if (readsRecorder(target)) {
		return true;
	}
	return Boolean(plainPath(target)) && (SPY_MATCHERS.has(matcher) || matcher === 'toHaveLength');
}

// The matcher chained onto `expect.poll(...)`, looking past a `.not`.
function pollMatcher(node) {
	let member = node.parent;
	if (member?.type !== 'MemberExpression' || member.object !== node) {
		return null;
	}
	if (memberName(member) === 'not' && member.parent?.type === 'MemberExpression') {
		member = member.parent;
	}
	return memberName(member);
}

function pollsRecorder(node, value) {
	const matcher = pollMatcher(node);
	return (matcher === 'toHaveLength' || SPY_MATCHERS.has(matcher)) && Boolean(plainPath(value));
}

// `vi.waitUntil` polls a condition, so the recorder read can sit inside a comparison or a boolean.
function conditionReadsRecorder(node) {
	const pending = [node];
	while (pending.length > 0) {
		const current = pending.pop();
		if (readsRecorder(current)) {
			return true;
		}
		if (current.type === 'BinaryExpression' || current.type === 'LogicalExpression') {
			pending.push(current.left, current.right);
		} else if (current.type === 'UnaryExpression') {
			pending.push(current.argument);
		} else if (current.type === 'SequenceExpression') {
			pending.push(...current.expressions);
		}
	}
	return false;
}

export default {
	meta: {
		type: 'problem',
		docs: { description: 'Disallow polling spy and request-recorder state with vi.waitFor, vi.waitUntil or expect.poll' },
		schema: [],
		messages: {
			poll: 'Await a signal instead of polling a spy or request recorder: resolve a Promise.withResolvers() deferred from the handler or callback that records it, then await its promise, or await the operation\'s own completion. A deadline-bound poll on a counter fails under CPU load, and a longer timeout only hides that.',
		},
	},
	create(context) {
		return {
			CallExpression(node) {
				const isPoll = isMember(node.callee, 'expect', 'poll');
				const isWaitUntil = isMember(node.callee, 'vi', 'waitUntil');
				if (!isPoll && !isWaitUntil && !isMember(node.callee, 'vi', 'waitFor')) {
					return;
				}
				const value = polledValue(node.arguments[0]);
				if (!value) {
					return;
				}
				let unsignaled;
				if (readsRecorder(value)) {
					unsignaled = true;
				} else if (isPoll) {
					unsignaled = pollsRecorder(node, value);
				} else if (isWaitUntil) {
					unsignaled = conditionReadsRecorder(value);
				} else {
					unsignaled = assertsRecorder(value);
				}
				if (unsignaled) {
					context.report({ node, messageId: 'poll' });
				}
			},
		};
	},
};
