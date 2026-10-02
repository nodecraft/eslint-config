import { findVariable } from './scope.js';

function annotationFor(parameter) {
	let current = parameter;
	while (['TSParameterProperty', 'RestElement', 'AssignmentPattern'].includes(current.type)) {
		if (current.typeAnnotation) {
			return current.typeAnnotation;
		}
		if (current.type === 'TSParameterProperty') {
			current = current.parameter;
		} else if (current.type === 'RestElement') {
			current = current.argument;
		} else {
			current = current.left;
		}
	}
	return current.typeAnnotation;
}

function typeDeclaration(context, reference) {
	if (reference.typeName.type !== 'Identifier') {
		return null;
	}
	const variable = findVariable(context, reference.typeName);
	if (variable?.defs.length !== 1) {
		return null;
	}
	return variable.defs[0].node;
}

// Binds an alias's type parameters to the arguments at this use, so `Maybe<object>` resolves through `T | null`.
function bindTypeArguments(alias, reference, substitutions) {
	const bound = new Map(substitutions);
	const parameters = alias.typeParameters?.params ?? [];
	const typeArguments = reference.typeArguments?.params ?? [];
	for (const [index, parameter] of parameters.entries()) {
		const explicit = typeArguments[index];
		if (explicit) {
			bound.set(parameter, { type: explicit, substitutions });
		} else if (parameter.default) {
			bound.set(parameter, { type: parameter.default, substitutions: bound });
		} else {
			return null;
		}
	}
	return bound;
}

function containsObjectType(context, node, substitutions = new Map(), resolving = new Set()) {
	let type = node;
	while (type.type === 'TSParenthesizedType') {
		type = type.typeAnnotation;
	}
	if (type.type === 'TSObjectKeyword') {
		return true;
	}
	if (type.type === 'TSUnionType') {
		return type.types.some(member => containsObjectType(context, member, substitutions, resolving));
	}
	if (type.type !== 'TSTypeReference') {
		return false;
	}

	const declaration = typeDeclaration(context, type);
	if (declaration?.type === 'TSTypeParameter') {
		const substitution = substitutions.get(declaration);
		return Boolean(substitution) && containsObjectType(context, substitution.type, substitution.substitutions, resolving);
	}
	if (declaration?.type !== 'TSTypeAliasDeclaration' || resolving.has(declaration)) {
		return false;
	}
	const bound = bindTypeArguments(declaration, type, substitutions);
	return Boolean(bound) && containsObjectType(context, declaration.typeAnnotation, bound, new Set([...resolving, declaration]));
}

export default {
	meta: {
		type: 'suggestion',
		docs: { description: 'Disallow the broad object type on function parameters' },
		schema: [],
		messages: {
			objectParameter: 'Parameter "{{parameter}}" uses the broad object type. Use a type that describes the properties this function accepts.',
		},
	},
	create(context) {
		const check = function(node) {
			for (const parameter of node.params) {
				const annotation = annotationFor(parameter);
				if (!annotation || !containsObjectType(context, annotation.typeAnnotation)) {
					continue;
				}
				context.report({
					node: annotation.typeAnnotation,
					messageId: 'objectParameter',
					data: {
						parameter: parameter.type === 'Identifier' ? parameter.name : context.sourceCode.getText(parameter),
					},
				});
			}
		};

		return {
			ArrowFunctionExpression: check,
			FunctionDeclaration: check,
			FunctionExpression: check,
			TSCallSignatureDeclaration: check,
			TSConstructSignatureDeclaration: check,
			TSConstructorType: check,
			TSDeclareFunction: check,
			TSEmptyBodyFunctionExpression: check,
			TSFunctionType: check,
			TSMethodSignature: check,
		};
	},
};
