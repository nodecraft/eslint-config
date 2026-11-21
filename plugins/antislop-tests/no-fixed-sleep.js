import { findVariable } from '../antislop/scope.js';
import { calleeRoot, isMember, memberName } from './test-api.js';

const TEST_CALLEES = new Set(['test', 'it', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll']);
// These run their callback before the awaited result settles, so a sleep inside still holds up the test.
const RUN_NOW_CALLEES = new Set(['act', 'waitFor', 'then', 'catch', 'finally', 'step']);
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

function callsResolve(handler, resolve) {
	if (handler?.type === 'Identifier') {
		return handler.name === resolve.name;
	}
	if (!FUNCTION_TYPES.has(handler?.type)) {
		return false;
	}
	const call = singleExpression(handler.body);
	return call?.type === 'CallExpression' && call.callee.type === 'Identifier' && call.callee.name === resolve.name;
}

// `new Promise(resolve => setTimeout(resolve, ms))`, with any timer handler that only calls resolve.
function promisedTimeout(node) {
	if (node.callee.type !== 'Identifier' || node.callee.name !== 'Promise') {
		return null;
	}
	const [executor] = node.arguments;
	if (!FUNCTION_TYPES.has(executor?.type)) {
		return null;
	}
	const [resolve] = executor.params;
	if (resolve?.type !== 'Identifier') {
		return null;
	}
	const call = singleExpression(executor.body);
	if (call?.type !== 'CallExpression' || !isSetTimeout(call.callee)) {
		return null;
	}
	const [handler, delay] = call.arguments;
	return callsResolve(handler, resolve) ? { delay } : null;
}

function helperFunction(variable) {
	if (variable.defs.length !== 1) {
		return null;
	}
	const [definition] = variable.defs;
	if (definition.type === 'FunctionName') {
		return definition.node;
	}
	if (definition.type === 'Variable' && definition.parent.kind === 'const' && FUNCTION_TYPES.has(definition.node.init?.type)) {
		return definition.node.init;
	}
	return null;
}

function paramName(param) {
	let target = param;
	if (target.type === 'AssignmentPattern') {
		target = target.left;
	}
	return target.type === 'Identifier' ? target.name : null;
}

// A helper's delay is usually its own parameter, so `sleep(0)` has to be judged by the call site rather than the body.
function delayAtCallSite(helper, call, delay) {
	if (delay?.type !== 'Identifier') {
		return delay;
	}
	const index = helper.params.findIndex(param => paramName(param) === delay.name);
	if (index === -1) {
		return delay;
	}
	if (call.arguments[index] !== undefined) {
		return call.arguments[index];
	}
	const param = helper.params[index];
	return param.type === 'AssignmentPattern' ? param.right : undefined;
}

function nearestFunction(node) {
	let current = node.parent;
	while (current && !FUNCTION_TYPES.has(current.type)) {
		current = current.parent;
	}
	return current;
}

function calleeName(callee) {
	return callee.type === 'Identifier' ? callee.name : memberName(callee);
}

function inTestBody(node) {
	let callback = nearestFunction(node);
	while (callback) {
		const call = callback.parent;
		if (call?.type !== 'CallExpression' || !call.arguments.includes(callback)) {
			return false;
		}
		if (TEST_CALLEES.has(calleeRoot(call.callee))) {
			return true;
		}
		if (!RUN_NOW_CALLEES.has(calleeName(call.callee))) {
			return false;
		}
		callback = nearestFunction(call);
	}
	return false;
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
		const timerModules = new Set();
		const awaits = [];
		let fakeTimers = false;

		const isTimer = function(callee) {
			if (callee.type === 'Identifier') {
				return timers.has(callee.name);
			}
			return callee.type === 'MemberExpression'
				&& callee.object.type === 'Identifier'
				&& timerModules.has(callee.object.name)
				&& memberName(callee) === 'setTimeout';
		};

		const sleepOf = function(node, followHelpers = true) {
			if (node?.type === 'AwaitExpression') {
				return sleepOf(node.argument, followHelpers);
			}
			if (node?.type === 'NewExpression') {
				return promisedTimeout(node);
			}
			if (node?.type !== 'CallExpression') {
				return null;
			}
			if (isMember(node.callee, 'scheduler', 'wait') || isTimer(node.callee)) {
				return { delay: node.arguments[0] };
			}
			if (!followHelpers || node.callee.type !== 'Identifier') {
				return null;
			}
			// A same-file `sleep(ms)` wrapper is the usual way the timer reaches a test, so look one level in.
			const variable = findVariable(context, node.callee);
			const helper = variable && helperFunction(variable);
			const sleep = helper && sleepOf(singleExpression(helper.body), false);
			return sleep ? { delay: delayAtCallSite(helper, node, sleep.delay) } : null;
		};

		return {
			ImportDeclaration(node) {
				if (!TIMER_MODULES.has(node.source.value)) {
					return;
				}
				for (const specifier of node.specifiers) {
					if (specifier.type !== 'ImportSpecifier') {
						timerModules.add(specifier.local.name);
					} else if ((specifier.imported.name ?? specifier.imported.value) === 'setTimeout') {
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
					const sleep = sleepOf(node.argument);
					if (sleep && !isYield(sleep.delay)) {
						context.report({ node, messageId: 'sleep' });
					}
				}
			},
		};
	},
};
