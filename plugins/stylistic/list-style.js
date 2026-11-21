import stylistic from '@stylistic/eslint-plugin';

const baseRule = stylistic.rules['list-style'];

const ITEMS = {
	ArrayExpression: node => node.elements,
	ArrayPattern: node => node.elements,
	ArrowFunctionExpression: node => node.params,
	CallExpression: node => node.arguments,
	FunctionDeclaration: node => node.params,
	FunctionExpression: node => node.params,
	NewExpression: node => node.arguments,
	ObjectExpression: node => node.properties,
	ObjectPattern: node => node.properties,
	TSDeclareFunction: node => node.params,
	TSFunctionType: node => node.params,
	TSInterfaceBody: node => node.body,
	TSTupleType: node => node.elementTypes,
	TSTypeLiteral: node => node.members,
};

function openingBracket(sourceCode, node, firstItem) {
	if (node.type === 'CallExpression' || node.type === 'NewExpression') {
		return sourceCode.getTokenAfter(node.typeArguments ?? node.callee, token => token.value === '(');
	}
	return sourceCode.getTokenBefore(firstItem);
}

// A hanging list starts on the bracket line but breaks between later items, so it was meant to be multi-line.
function hangingBracket(sourceCode, node) {
	const items = ITEMS[node.type]?.(node).filter(Boolean) ?? [];
	if (items.length < 2) {
		return null;
	}
	const left = openingBracket(sourceCode, node, items[0]);
	if (!left || left.loc.end.line !== items[0].loc.start.line) {
		return null;
	}
	const breaks = items.slice(1).some(item => sourceCode.getTokenBefore(item).loc.end.line !== item.loc.start.line);
	return breaks ? left : null;
}

export default {
	meta: {
		...baseRule.meta,
		docs: {
			description: 'Wraps `@stylistic/list-style`, expanding a hanging list one item per line instead of collapsing it onto one line',
		},
		messages: {
			...baseRule.meta.messages,
			wrapFirstItem: 'Move the first item onto its own line, so each item gets its own line.',
		},
	},
	create(context) {
		const { sourceCode } = context;
		const hanging = new WeakMap();
		const reported = new WeakSet();
		const bracketFor = (node) => {
			if (!hanging.has(node)) {
				hanging.set(node, hangingBracket(sourceCode, node));
			}
			return hanging.get(node);
		};
		const proxy = Object.create(context, {
			report: {
				value(descriptor) {
					const left = descriptor.messageId === 'shouldNotWrap' ? bracketFor(descriptor.node) : null;
					if (!left) {
						context.report(descriptor);
						return;
					}
					// The base rule would join every item onto the bracket line; one break after the bracket lets its next fix pass expand them instead.
					if (reported.has(descriptor.node)) {
						return;
					}
					reported.add(descriptor.node);
					context.report({
						node: descriptor.node,
						loc: { start: left.loc.end, end: sourceCode.getTokenAfter(left).loc.start },
						messageId: 'wrapFirstItem',
						fix: fixer => fixer.insertTextAfter(left, '\n'),
					});
				},
			},
		});
		return baseRule.create(proxy);
	},
};
