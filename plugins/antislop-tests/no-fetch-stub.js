import { isMember, memberName } from './test-api.js';
import { findVariable } from '../antislop/scope.js';

const GLOBAL_OBJECTS = new Set(['globalThis', 'window', 'global', 'self']);
const REPLACEMENTS = new Set([
	'mockImplementation',
	'mockImplementationOnce',
	'mockReturnValue',
	'mockReturnValueOnce',
	'mockResolvedValue',
	'mockResolvedValueOnce',
	'mockRejectedValue',
	'mockRejectedValueOnce',
	'withImplementation',
]);

function isGlobalFetch(node) {
	return node?.type === 'MemberExpression'
		&& node.object.type === 'Identifier'
		&& GLOBAL_OBJECTS.has(node.object.name)
		&& memberName(node) === 'fetch';
}

function isFetchSpy(node) {
	if (node?.type !== 'CallExpression' || !isMember(node.callee, 'vi', 'spyOn')) {
		return false;
	}
	const [object, property] = node.arguments;
	return object?.type === 'Identifier'
		&& GLOBAL_OBJECTS.has(object.name)
		&& property?.type === 'Literal'
		&& property.value === 'fetch';
}

function constInit(context, identifier) {
	const variable = findVariable(context, identifier);
	if (variable?.defs.length !== 1) {
		return null;
	}
	const [definition] = variable.defs;
	if (definition.type !== 'Variable' || definition.parent.kind !== 'const') {
		return null;
	}
	return definition.node.init;
}

export default {
	meta: {
		type: 'problem',
		docs: { description: 'Disallow replacing fetch in tests instead of serving responses from MSW' },
		schema: [],
		messages: {
			stub: 'Serve this response from an MSW handler instead of replacing fetch. A replaced fetch skips request building and response parsing, so the test passes against a client that could fail for real. Spies that only observe fetch are fine.',
		},
	},
	create(context) {
		return {
			AssignmentExpression(node) {
				if (!isGlobalFetch(node.left)) {
					return;
				}
				// Putting back a saved `const original = globalThis.fetch` is cleanup, not a second stub.
				if (node.right.type === 'Identifier' && isGlobalFetch(constInit(context, node.right))) {
					return;
				}
				context.report({ node, messageId: 'stub' });
			},
			CallExpression(node) {
				if (isMember(node.callee, 'vi', 'stubGlobal')) {
					const [name] = node.arguments;
					if (name?.type === 'Literal' && name.value === 'fetch') {
						context.report({ node, messageId: 'stub' });
					}
					return;
				}
				if (!REPLACEMENTS.has(memberName(node.callee))) {
					return;
				}
				let spy = node.callee.object;
				if (spy.type === 'Identifier') {
					spy = constInit(context, spy);
				}
				if (isFetchSpy(spy)) {
					context.report({ node, messageId: 'stub' });
				}
			},
		};
	},
};
