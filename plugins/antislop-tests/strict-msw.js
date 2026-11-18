import { assignedValues, memberName, propertyKey } from './test-api.js';
import { findVariable } from '../antislop/scope.js';

const STARTERS = new Map([
	['setupServer', 'listen'],
	['setupWorker', 'start'],
]);
const STARTER_METHODS = new Set(STARTERS.values());
// MSW 3 renamed `onUnhandledRequest`, and repos on either major should pass with the strict setting.
const STRICT_OPTIONS = new Set(['onUnhandledFrame', 'onUnhandledRequest']);
const FUNCTION_TYPES = new Set(['ArrowFunctionExpression', 'FunctionExpression']);

function mswImport(context, identifier) {
	const definition = findVariable(context, identifier)?.defs[0];
	if (definition?.type !== 'ImportBinding' || definition.node.type !== 'ImportSpecifier') {
		return null;
	}
	if (!/^msw(?:\/|$)/u.test(definition.parent.source.value)) {
		return null;
	}
	const { imported } = definition.node;
	return imported.type === 'Identifier' ? imported.name : imported.value;
}

function mswFactory(context, node) {
	if (node?.type !== 'CallExpression' || node.callee.type !== 'Identifier') {
		return null;
	}
	const name = mswImport(context, node.callee);
	return STARTERS.has(name) ? name : null;
}

function serverFactory(context, node) {
	if (node.type !== 'Identifier') {
		return mswFactory(context, node);
	}
	const variable = findVariable(context, node);
	if (!variable) {
		return null;
	}
	const factories = new Set(assignedValues(variable).map(value => mswFactory(context, value)));
	if (factories.size !== 1) {
		return null;
	}
	const [factory] = factories;
	return factory;
}

// A named handler only counts when every value the binding can hold is a function, so `const mode = 'warn'` still reports.
function isHandlerFunction(context, identifier) {
	const variable = findVariable(context, identifier);
	if (!variable || variable.defs.length === 0) {
		return false;
	}
	if (variable.defs.some(definition => definition.type !== 'FunctionName' && definition.type !== 'Variable')) {
		return false;
	}
	const values = assignedValues(variable);
	if (variable.defs[0].type !== 'FunctionName' && values.length === 0) {
		return false;
	}
	return values.every(value => FUNCTION_TYPES.has(value.type));
}

function isStrictValue(context, node) {
	if (node.type === 'Literal') {
		return node.value === 'error';
	}
	if (node.type === 'Identifier') {
		return isHandlerFunction(context, node);
	}
	return FUNCTION_TYPES.has(node.type);
}

function strictOption(options) {
	return options.properties.find(property => STRICT_OPTIONS.has(propertyKey(property)));
}

// Options passed through a variable or a spread can't be read here, so only a visible miss counts.
function isLenient(context, options) {
	if (options === undefined) {
		return true;
	}
	if (options.type !== 'ObjectExpression') {
		return false;
	}
	const strict = strictOption(options);
	if (strict) {
		return !isStrictValue(context, strict.value);
	}
	return !options.properties.some(property => property.type === 'SpreadElement');
}

// No other library takes these keys, so a lenient one marks MSW even when the server was built in another file.
function setsLenientOption(context, options) {
	if (options?.type !== 'ObjectExpression') {
		return false;
	}
	const strict = strictOption(options);
	return Boolean(strict) && !isStrictValue(context, strict.value);
}

export default {
	meta: {
		type: 'problem',
		docs: { description: 'Require MSW to fail on requests no handler covers' },
		schema: [],
		messages: {
			lenient: 'Start MSW with { onUnhandledFrame: \'error\' } (onUnhandledRequest before MSW 3). Add a handler for every request the test makes, with passthrough() for local origins the test owns.',
		},
	},
	create(context) {
		const isLenientStart = function(node) {
			const method = memberName(node.callee);
			if (!STARTER_METHODS.has(method)) {
				return false;
			}
			const [options] = node.arguments;
			const factory = serverFactory(context, node.callee.object);
			if (factory) {
				return STARTERS.get(factory) === method && isLenient(context, options);
			}
			return setsLenientOption(context, options);
		};

		return {
			CallExpression(node) {
				let lenient = false;
				if (node.callee.type === 'Identifier') {
					// MSW 3's `defineNetwork` takes its options up front, and `enable()` takes none.
					lenient = mswImport(context, node.callee) === 'defineNetwork' && isLenient(context, node.arguments[0]);
				} else if (node.callee.type === 'MemberExpression') {
					lenient = isLenientStart(node);
				}
				if (lenient) {
					context.report({ node, messageId: 'lenient' });
				}
			},
		};
	},
};
