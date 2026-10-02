import { findVariable } from './scope.js';

const ARRAY_COPY_METHODS = new Set(['concat', 'slice', 'toReversed', 'toSorted', 'toSpliced', 'with']);
const FUNCTION_TYPES = new Set(['ArrowFunctionExpression', 'FunctionDeclaration', 'FunctionExpression']);
const REDUCE_METHODS = new Set(['reduce', 'reduceRight']);
const SPREAD_CONTAINERS = new Set(['ArrayExpression', 'ObjectExpression']);
const WRAPPER_TYPES = new Set(['ChainExpression', 'TSAsExpression', 'TSNonNullExpression', 'TSSatisfiesExpression', 'TSTypeAssertion']);

function unwrap(node) {
	let current = node;
	while (WRAPPER_TYPES.has(current.type)) {
		current = current.expression;
	}
	return current;
}

function memberTarget(callee) {
	const member = unwrap(callee);
	if (member.type !== 'MemberExpression') {
		return null;
	}
	if (!member.computed && member.property.type === 'Identifier') {
		return { name: member.property.name, object: member.object };
	}
	if (member.computed && member.property.type === 'Literal' && typeof member.property.value === 'string') {
		return { name: member.property.value, object: member.object };
	}
	return null;
}

// Only the nearest function counts, so a copy inside a nested helper or closure isn't charged to the reducer.
function enclosingReducer(node) {
	let callback = node.parent;
	while (callback && !FUNCTION_TYPES.has(callback.type)) {
		callback = callback.parent;
	}
	if (!callback || callback.type === 'FunctionDeclaration') {
		return null;
	}

	const owner = callback.parent;
	if (owner?.type !== 'CallExpression' || owner.arguments[0] !== callback || owner.arguments.length > 2) {
		return null;
	}
	if (!REDUCE_METHODS.has(memberTarget(owner.callee)?.name)) {
		return null;
	}

	const [first] = callback.params;
	const accumulator = first?.type === 'AssignmentPattern' ? first.left : first;
	if (accumulator?.type !== 'Identifier') {
		return null;
	}
	return { callback, accumulator, initialValue: owner.arguments[1] };
}

// Follows `const alias = acc` chains; anything reassignable could stop pointing at the accumulator.
function constInitializer(variable) {
	if (variable.defs.length !== 1) {
		return null;
	}
	const [definition] = variable.defs;
	if (definition.type !== 'Variable' || definition.parent.kind !== 'const' || definition.node.id.type !== 'Identifier') {
		return null;
	}
	return definition.node.init;
}

function isAccumulator(context, node, accumulator, visited = new Set()) {
	const expression = unwrap(node);
	if (expression.type !== 'Identifier') {
		return false;
	}
	const variable = findVariable(context, expression);
	if (!variable || visited.has(variable)) {
		return false;
	}
	if (variable === accumulator) {
		return true;
	}
	visited.add(variable);
	const init = constInitializer(variable);
	return Boolean(init) && isAccumulator(context, init, accumulator, visited);
}

function isKnownArray(context, node, visited = new Set()) {
	const expression = unwrap(node);
	if (expression.type === 'ArrayExpression') {
		return true;
	}
	if (expression.type !== 'Identifier') {
		return false;
	}
	const variable = findVariable(context, expression);
	if (!variable || visited.has(variable)) {
		return false;
	}
	visited.add(variable);
	const init = constInitializer(variable);
	return Boolean(init) && isKnownArray(context, init, visited);
}

function isGlobal(context, node, name) {
	const expression = unwrap(node);
	if (expression.type !== 'Identifier' || expression.name !== name) {
		return false;
	}
	const variable = findVariable(context, expression);
	return !variable || variable.defs.length === 0;
}

export default {
	meta: {
		type: 'problem',
		docs: { description: 'Disallow copying a reducer accumulator on every iteration' },
		schema: [],
		messages: {
			accumulatorCopy: 'Copying the reducer accumulator on every iteration makes this reduce quadratic. Mutate the accumulator and return it, or build the result with a loop.',
		},
	},
	create(context) {
		const accumulatorFor = function(node) {
			const reducer = enclosingReducer(node);
			if (!reducer) {
				return null;
			}
			const variable = context.sourceCode.getDeclaredVariables(reducer.callback)
				.find(candidate => candidate.identifiers.includes(reducer.accumulator));
			if (!variable) {
				return null;
			}
			return { variable, initialValue: reducer.initialValue };
		};

		const copiesAccumulator = function(node, target) {
			const reducer = accumulatorFor(node);
			if (!reducer) {
				return false;
			}
			const matches = argument => isAccumulator(context, argument, reducer.variable);

			if (target.name === 'assign' && isGlobal(context, target.object, 'Object')) {
				const [destination, ...sources] = node.arguments;
				return destination !== undefined && unwrap(destination).type === 'ObjectExpression' && sources.some(source => matches(source));
			}
			if (target.name === 'from' && isGlobal(context, target.object, 'Array')) {
				return node.arguments.length > 0 && matches(node.arguments[0]);
			}
			// Without an array initial value, `concat` could be string building, which isn't a growing copy.
			return ARRAY_COPY_METHODS.has(target.name)
				&& reducer.initialValue !== undefined
				&& isKnownArray(context, reducer.initialValue)
				&& matches(target.object);
		};

		return {
			CallExpression(node) {
				const target = memberTarget(node.callee);
				if (!target) {
					return;
				}
				if (target.name !== 'assign' && target.name !== 'from' && !ARRAY_COPY_METHODS.has(target.name)) {
					return;
				}
				if (copiesAccumulator(node, target)) {
					context.report({ node, messageId: 'accumulatorCopy' });
				}
			},
			SpreadElement(node) {
				if (!SPREAD_CONTAINERS.has(node.parent.type)) {
					return;
				}
				const reducer = accumulatorFor(node);
				if (reducer && isAccumulator(context, node.argument, reducer.variable)) {
					context.report({ node, messageId: 'accumulatorCopy' });
				}
			},
		};
	},
};
