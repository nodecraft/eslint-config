import pkg from '../package.json' with { type: 'json' };

// Properties that always exist once their owner does, so a following access can't throw.
const ALWAYS_PRESENT = new Set(['classList', 'dataset', 'style', 'attributes']);

// Walk one link inward along a member/call chain.
function innerLink(node) {
	if (node.type === 'MemberExpression') {
		return node.object;
	}
	if (node.type === 'CallExpression') {
		return node.callee;
	}
	return null;
}

// Collect chain links outermost-first, stopping at the first non-chain node.
function collectLinks(expression) {
	const links = [];
	let current = expression;
	while (current && (current.type === 'MemberExpression' || current.type === 'CallExpression')) {
		links.push(current);
		current = innerLink(current);
	}
	return links;
}

function describe(node, sourceCode) {
	if (node.computed) {
		return `[${sourceCode.getText(node.property)}]`;
	}
	return node.property.name ?? sourceCode.getText(node.property);
}

const noMixedOptionalChainRule = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow unguarded property access after an optional chain link, which throws when the guarded value is nullish',
		},
		schema: [],
		messages: {
			mixedChain: 'Unguarded `.{{access}}` follows the optional `?.{{guarded}}` in this chain, so it throws when `{{guarded}}` is nullish. Use `?.` consistently for the rest of the chain.',
		},
	},
	create(context) {
		const { sourceCode } = context;
		return {
			ChainExpression(node) {
				// Innermost-first, so we see each guard before the accesses that depend on it.
				const links = collectLinks(node.expression).toReversed();

				for (const [index, guard] of links.entries()) {
					if (!guard.optional || guard.type !== 'MemberExpression') {
						continue;
					}
					// `a?.b().c` — `.c` reads the call's return value, whose nullability
					// isn't knowable from syntax alone, so this guard proves nothing.
					if (links[index + 1]?.type === 'CallExpression') {
						continue;
					}
					if (!guard.computed && ALWAYS_PRESENT.has(guard.property.name)) {
						continue;
					}

					const unguarded = links.slice(index + 1).find(link => link.type === 'MemberExpression' && !link.optional);
					if (!unguarded) {
						continue;
					}

					context.report({
						node: unguarded,
						loc: unguarded.property.loc,
						messageId: 'mixedChain',
						data: {
							access: describe(unguarded, sourceCode),
							guarded: describe(guard, sourceCode),
						},
					});
					return;
				}
			},
		};
	},
};

export default {
	meta: {
		name: 'eslint-plugin-optional-chain',
		version: pkg.version,
	},
	rules: {
		'no-mixed-optional-chain': noMixedOptionalChainRule,
	},
};
