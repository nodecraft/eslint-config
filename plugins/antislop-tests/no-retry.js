import {
	calleeRoot,
	isMember,
	memberName,
	propertyKey,
} from './test-api.js';

const TEST_FUNCTIONS = new Set(['test', 'it', 'describe', 'suite']);
// These build new test functions or tables rather than declaring a test, so their options aren't per-test.
const BUILDER_METHODS = new Set(['each', 'for', 'extend', 'scoped', 'override']);

const CONFIG_FACTORIES = new Set(['defineConfig', 'defineProject', 'defineWorkspace', 'mergeConfig']);

// App code can have its own `test: { retry }` settings, so only a `test` block inside an exported config counts.
function isConfigExport(node) {
	return node.type === 'ExportDefaultDeclaration'
		|| (node.type === 'CallExpression' && node.callee.type === 'Identifier' && CONFIG_FACTORIES.has(node.callee.name))
		|| (node.type === 'AssignmentExpression' && isMember(node.left, 'module', 'exports'));
}

function isTestCall(node) {
	return TEST_FUNCTIONS.has(calleeRoot(node.callee)) && !BUILDER_METHODS.has(memberName(node.callee));
}

function isDisabled(value) {
	return value.type === 'Literal' && value.value === 0;
}

export default {
	meta: {
		type: 'problem',
		docs: { description: 'Disallow retrying tests' },
		schema: [],
		messages: {
			retry: 'Do not retry tests. A test that passes on rerun is a flake: wait on the event it depends on instead.',
		},
	},
	create(context) {
		const reportRetries = function(node) {
			if (node?.type !== 'ObjectExpression') {
				return;
			}
			for (const property of node.properties) {
				if (propertyKey(property) === 'retry' && !isDisabled(property.value)) {
					context.report({ node: property, messageId: 'retry' });
				}
			}
		};

		return {
			CallExpression(node) {
				if (isMember(node.callee, 'vi', 'setConfig')) {
					reportRetries(node.arguments[0]);
				} else if (isTestCall(node)) {
					reportRetries(node.arguments[1]);
					reportRetries(node.arguments[2]);
				}
			},
			// Vitest config files, including each entry under `projects`.
			Property(node) {
				if (propertyKey(node) === 'test' && context.sourceCode.getAncestors(node).some(ancestor => isConfigExport(ancestor))) {
					reportRetries(node.value);
				}
			},
		};
	},
};
