import { calleeRoot, isMember } from './test-api.js';
import { findVariable } from '../antislop/scope.js';

const TEST_CALLEES = new Set(['test', 'it', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll']);
const TIMER_MODULES = new Set(['node:timers/promises', 'timers/promises']);
const FUNCTION_TYPES = new Set(['ArrowFunctionExpression', 'FunctionDeclaration', 'FunctionExpression']);

function isSetTimeout(node) {
	return (node.type === 'Identifier' && node.name === 'setTimeout')
		|| isMember(node, 'globalThis', 'setTimeout')
		|| isMember(node, 'window', 'setTimeout');
}

// A zero delay yields one macrotask so queued work can run, which is ordering rather than a guess at duration.
function isYield(delay) {
	return delay === undefined || (delay.type === 'Literal' && delay.value === 0);
}

function singleExpression(body) {
	if (body?.type !== 'BlockStatement') {
		return body;
	}
	if (body.body.length !== 1) {
		return null;
	}
	const [statement] = body.body;
	if (statement.type === 'ExpressionStatement') {
		return statement.expression;
	}
	return statement.type === 'ReturnStatement' ? statement.argument : null;
}

// `new Promise(resolve => setTimeout(resolve, ms))`, or the same with `() => resolve()` as the handler.
function resolvesAfterTimeout(node) {
	const [executor] = node.arguments;
	if (!executor || !FUNCTION_TYPES.has(executor.type)) {
		return false;
	}
	const [resolve] = executor.params;
	if (resolve?.type !== 'Identifier') {
		return false;
	}
	const call = singleExpression(executor.body);
	if (call?.type !== 'CallExpression' || !isSetTimeout(call.callee)) {
		return false;
	}
	const [handler, delay] = call.arguments;
	if (isYield(delay)) {
		return false;
	}
	if (handler?.type === 'Identifier') {
		return handler.name === resolve.name;
	}
	return handler?.type === 'ArrowFunctionExpression'
		&& handler.body.type === 'CallExpression'
		&& handler.body.callee.type === 'Identifier'
		&& handler.body.callee.name === resolve.name;
}

function helperBody(variable) {
	const [definition] = variable.defs;
	if (variable.defs.length !== 1) {
		return null;
	}
	if (definition.type === 'FunctionName') {
		return definition.node.body;
	}
	if (definition.type === 'Variable' && definition.parent.kind === 'const' && FUNCTION_TYPES.has(definition.node.init?.type)) {
		return definition.node.init.body;
	}
	return null;
}

function nearestFunction(node) {
	let current = node.parent;
	while (current && !FUNCTION_TYPES.has(current.type)) {
		current = current.parent;
	}
	return current;
}

function inTestBody(node) {
	const call = nearestFunction(node)?.parent;
	return call?.type === 'CallExpression' && TEST_CALLEES.has(calleeRoot(call.callee));
}

export default {
	meta: {
		type: 'problem',
		docs: { description: 'Disallow awaiting a fixed real-time sleep in a test or hook body' },
		schema: [],
		messages: {
			sleep: 'Replace this fixed sleep with a signal: await the operation itself or a promise its handler resolves. To move time, use vi.useFakeTimers() and advance it. A sleep guesses how long real work takes and fails under CPU load.',
		},
	},
	create(context) {
		const timers = new Set();
		const awaits = [];
		let fakeTimers = false;

		const isSleep = function(node, followHelpers = true) {
			if (node?.type === 'NewExpression') {
				return node.callee.type === 'Identifier' && node.callee.name === 'Promise' && resolvesAfterTimeout(node);
			}
			if (node?.type !== 'CallExpression') {
				return false;
			}
			if (isMember(node.callee, 'scheduler', 'wait')) {
				return true;
			}
			if (node.callee.type !== 'Identifier') {
				return false;
			}
			if (timers.has(node.callee.name)) {
				return !isYield(node.arguments[0]);
			}
			// A same-file `sleep(ms)` wrapper is the usual way the timer reaches a test, so look one level in.
			const variable = followHelpers && findVariable(context, node.callee);
			return Boolean(variable) && isSleep(singleExpression(helperBody(variable)), false);
		};

		return {
			ImportDeclaration(node) {
				if (!TIMER_MODULES.has(node.source.value)) {
					return;
				}
				for (const specifier of node.specifiers) {
					if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'setTimeout') {
						timers.add(specifier.local.name);
					}
				}
			},
			CallExpression(node) {
				if (isMember(node.callee, 'vi', 'useFakeTimers')) {
					fakeTimers = true;
				}
			},
			AwaitExpression(node) {
				if (inTestBody(node)) {
					awaits.push(node);
				}
			},
			// With fake timers in play a timeout resolves when the test advances the clock, not after real time.
			'Program:exit'() {
				if (fakeTimers) {
					return;
				}
				for (const node of awaits) {
					if (isSleep(node.argument)) {
						context.report({ node, messageId: 'sleep' });
					}
				}
			},
		};
	},
};
