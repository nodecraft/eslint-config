import { findVariable } from '../antislop/scope.js';
import { assignedValues, isMember, memberName } from './test-api.js';

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

function valuesOf(context, identifier) {
	const variable = findVariable(context, identifier);
	return variable ? assignedValues(variable) : [];
}

// Putting back a saved `original = globalThis.fetch` is cleanup, not a second stub, as long as nothing else is ever stored there.
function isSavedOriginal(context, node) {
	if (node.type !== 'Identifier') {
		return false;
	}
	const values = valuesOf(context, node);
	return values.length > 0 && values.every(value => isGlobalFetch(value));
}

// A spy is often declared with `let` and assigned in a hook, so any assignment of a fetch spy counts.
function isFetchSpyReference(context, node) {
	if (node.type !== 'Identifier') {
		return isFetchSpy(node);
	}
	return valuesOf(context, node).some(value => isFetchSpy(value));
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
				if (!isSavedOriginal(context, node.right)) {
					context.report({ node, messageId: 'stub' });
				}
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
				if (isFetchSpyReference(context, node.callee.object)) {
					context.report({ node, messageId: 'stub' });
				}
			},
		};
	},
};
