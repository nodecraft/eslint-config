const ASSERTION_TYPES = new Set(['TSAsExpression', 'TSTypeAssertion']);

function isAssertion(node) {
	return node && ASSERTION_TYPES.has(node.type);
}

function unwrapParentheses(node) {
	let current = node;
	while (current.type === 'ParenthesizedExpression') {
		current = current.expression;
	}
	return current;
}

function isConstAssertion(node) {
	return node.typeAnnotation.type === 'TSTypeReference'
		&& node.typeAnnotation.typeName.type === 'Identifier'
		&& node.typeAnnotation.typeName.name === 'const';
}

export default {
	meta: {
		type: 'problem',
		docs: { description: 'Disallow chained TypeScript type assertions' },
		schema: [],
		messages: {
			chained: 'This assertion chain discards type evidence. Keep the original precise type or validate the value before narrowing it.',
		},
	},
	create(context) {
		const check = function(node) {
			let parent = node.parent;
			let outerExpression = node;
			while (parent?.type === 'ParenthesizedExpression' && parent.expression === outerExpression) {
				outerExpression = parent;
				parent = parent.parent;
			}
			if (isAssertion(parent) && parent.expression === outerExpression) {
				return;
			}

			let current = node;
			let count = 0;
			let hasNonConstAssertion = false;
			while (isAssertion(current)) {
				count += 1;
				hasNonConstAssertion ||= !isConstAssertion(current);
				current = unwrapParentheses(current.expression);
			}
			if (count > 1 && hasNonConstAssertion) {
				context.report({ node, messageId: 'chained' });
			}
		};

		return {
			TSAsExpression: check,
			TSTypeAssertion: check,
		};
	},
};
