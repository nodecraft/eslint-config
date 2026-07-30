import pkg from '../package.json' with { type: 'json' };

// Vue re-exports `computed` from its reactivity core, which some projects import from directly.
const VUE_SOURCES = new Set(['vue', '@vue/reactivity', '@vue/runtime-core', '@vue/runtime-dom']);

function getGetter(node) {
	const [getter] = node.arguments;
	if (getter?.type === 'ArrowFunctionExpression' || getter?.type === 'FunctionExpression') {
		return getter;
	}
	return null;
}

function findVariable(scope, name) {
	for (let current = scope; current; current = current.upper) {
		const variable = current.set.get(name);
		if (variable) {
			return variable;
		}
	}
	return null;
}

// An undeclared `computed` is Vue's, since auto-import setups leave no import to check. A locally
// declared one, or an import from anything else, belongs to someone else.
function isVueComputed(variable) {
	if (!variable || variable.defs.length === 0) {
		return true;
	}
	return variable.defs.some(def => def.type === 'ImportBinding' && VUE_SOURCES.has(def.parent.source.value));
}

// Only a binding this file owns can be unwrapped safely, because every reader lives here too. A
// computed handed straight to another API — `provide`, `watch`, a composable's return, a `??`
// fallback for a ref sourced elsewhere — has to keep its shape.
function isLocalBinding(node) {
	if (node.parent.type !== 'VariableDeclarator') {
		return false;
	}
	return node.parent.parent.parent?.type !== 'ExportNamedDeclaration';
}

const noConstantComputedRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallow `computed()` getters that read nothing reactive, and so can never produce a second value',
		},
		schema: [],
		messages: {
			constantComputed: 'This `computed` reads nothing outside its own body, so its value never changes. Use a plain value instead.',
		},
	},
	create(context) {
		const { sourceCode } = context;
		return {
			CallExpression(node) {
				if (node.callee.type !== 'Identifier' || node.callee.name !== 'computed') {
					return;
				}
				if (!isLocalBinding(node)) {
					return;
				}

				const getter = getGetter(node);
				if (!getter) {
					return;
				}
				if (!isVueComputed(findVariable(sourceCode.getScope(node), 'computed'))) {
					return;
				}
				// `this` is not a tracked reference, so a getter reading it looks dependency-free.
				if (sourceCode.getTokens(getter).some(token => token.type === 'Keyword' && token.value === 'this')) {
					return;
				}
				// `through` holds every reference that escaped the getter, including from nested
				// functions. None escaping means nothing reactive — or even global — is read.
				if (sourceCode.getScope(getter).through.length > 0) {
					return;
				}

				context.report({
					node,
					messageId: 'constantComputed',
				});
			},
		};
	},
};

export default {
	meta: {
		name: 'eslint-plugin-nodecraft-vue',
		version: pkg.version,
	},
	rules: {
		'no-constant-computed': noConstantComputedRule,
	},
};
