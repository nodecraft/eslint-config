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

// `ref.current` is a render handle rather than a recorder, so it stays out.
function plainPath(node) {
	const path = referencePath(node);
	return path && !path.includes('current') ? path : null;
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

function pollsLength(node, value) {
	return memberName(node.parent) === 'toHaveLength' && node.parent.object === node && Boolean(plainPath(value));
}

export default {
	meta: {
		type: 'problem',
		docs: { description: 'Disallow polling spy and request-recorder state with vi.waitFor or expect.poll' },
		schema: [],
		messages: {
			poll: 'Await a signal instead of polling a spy or request recorder: resolve a Promise.withResolvers() deferred from the handler or callback that records it, then await its promise, or await the operation\'s own completion. A deadline-bound poll on a counter fails under CPU load, and a longer timeout only hides that.',
		},
	},
	create(context) {
		return {
			CallExpression(node) {
				const isPoll = isMember(node.callee, 'expect', 'poll');
				if (!isPoll && !isMember(node.callee, 'vi', 'waitFor')) {
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
					unsignaled = pollsLength(node, value);
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
