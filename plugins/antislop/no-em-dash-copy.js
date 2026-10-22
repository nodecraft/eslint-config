const EM_DASH = '—';

// Every way an em dash can be spelled in source. The escapes skip a preceding backslash, which
// would make them a literal `—` rather than the character.
const RAW_EM_DASH = /—|&mdash;|&#8212;|&#x2014;|&#X2014;|(?<!\\)\\u2014|(?<!\\)\\u\{2014\}/gu;
const LETTER = /\p{L}/u;

// A dash standing alone is a placeholder for an empty value (`value ?? '—'`), not prose. A spaced
// one (`' — '`) is a separator joining two values, so it still counts.
function isCopy(text) {
	return typeof text === 'string' && text.includes(EM_DASH) && text !== EM_DASH;
}

// A hyphen keeps the author's spacing, except between two words, where `word-word` would read as
// a compound.
function replaceEmDashes(raw) {
	return raw.replaceAll(RAW_EM_DASH, (match, offset) => {
		const before = raw[offset - 1] ?? '';
		const after = raw[offset + match.length] ?? '';
		if (LETTER.test(before) && LETTER.test(after)) {
			return ' - ';
		}
		return '-';
	});
}

export default {
	meta: {
		type: 'suggestion',
		docs: { description: 'Disallow em dashes in strings, template text, and attributes that people read' },
		fixable: 'code',
		schema: [],
		messages: {
			emDash: 'Avoid em dashes in copy. Use a hyphen, comma, colon, or parentheses instead.',
		},
	},
	create(context) {
		const { sourceCode } = context;

		const check = function(node, text) {
			if (!isCopy(text)) {
				return;
			}
			context.report({
				node,
				messageId: 'emDash',
				fix: fixer => fixer.replaceText(node, replaceEmDashes(sourceCode.getText(node))),
			});
		};

		const visitor = {
			Literal: node => check(node, node.value),
			TemplateElement: node => check(node, node.value.cooked),
			JSXText: node => check(node, node.value),
		};

		const parserServices = sourceCode.parserServices;
		if (!parserServices?.defineTemplateBodyVisitor) {
			return visitor;
		}
		// Template copy is the main target in a Vue app: text, static attributes, and expressions.
		return parserServices.defineTemplateBodyVisitor({
			// HTML collapses the whitespace around text, so `<td>\n\t—\n</td>` is still a placeholder.
			VText: node => check(node, node.value.trim()),
			VLiteral: node => check(node, node.value),
			Literal: visitor.Literal,
			TemplateElement: visitor.TemplateElement,
		}, visitor);
	},
};
