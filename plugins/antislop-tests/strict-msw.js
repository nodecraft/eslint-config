import { memberName, propertyKey } from './test-api.js';
import { findVariable } from '../antislop/scope.js';

const STARTERS = new Map([
	['setupServer', 'listen'],
	['setupWorker', 'start'],
]);
// MSW 3 renamed `onUnhandledRequest`, and repos on either major should pass with the strict setting.
const STRICT_OPTIONS = new Set(['onUnhandledFrame', 'onUnhandledRequest']);
const FUNCTION_TYPES = new Set(['ArrowFunctionExpression', 'FunctionExpression']);

function mswFactory(context, node) {
	if (node?.type !== 'CallExpression' || node.callee.type !== 'Identifier') {
		return null;
	}
	const definition = findVariable(context, node.callee)?.defs[0];
	if (definition?.type !== 'ImportBinding' || definition.node.type !== 'ImportSpecifier') {
		return null;
	}
	if (!/^msw(?:\/|$)/u.test(definition.parent.source.value)) {
		return null;
	}
	const { imported } = definition.node;
	const name = imported.type === 'Identifier' ? imported.name : imported.value;
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
	const factories = new Set(variable.references
		.filter(reference => reference.isWrite() && reference.writeExpr)
		.map(reference => mswFactory(context, reference.writeExpr)));
	if (factories.size !== 1) {
		return null;
	}
	const [factory] = factories;
	return factory;
}

function isStrictValue(node) {
	return (node.type === 'Literal' && node.value === 'error') || FUNCTION_TYPES.has(node.type);
}

// Options passed through a variable or a spread can't be read here, so only a visible miss counts.
function isLenient(options) {
	if (options === undefined) {
		return true;
	}
	if (options.type !== 'ObjectExpression') {
		return false;
	}
	const strict = options.properties.find(property => STRICT_OPTIONS.has(propertyKey(property)));
	if (strict) {
		return !isStrictValue(strict.value);
	}
	return !options.properties.some(property => property.type === 'SpreadElement');
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
		return {
			CallExpression(node) {
				if (node.callee.type !== 'MemberExpression') {
					return;
				}
				const factory = serverFactory(context, node.callee.object);
				if (factory && STARTERS.get(factory) === memberName(node.callee) && isLenient(node.arguments[0])) {
					context.report({ node, messageId: 'lenient' });
				}
			},
		};
	},
};
