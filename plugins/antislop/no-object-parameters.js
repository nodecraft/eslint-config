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

function containsObjectType(type) {
	const pending = [type];
	while (pending.length > 0) {
		const current = pending.pop();
		if (current.type === 'TSObjectKeyword') {
			return true;
		}
		if (current.type === 'TSParenthesizedType') {
			pending.push(current.typeAnnotation);
		} else if (current.type === 'TSUnionType') {
			pending.push(...current.types);
		}
	}
	return false;
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
				if (!annotation || !containsObjectType(annotation.typeAnnotation)) {
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
