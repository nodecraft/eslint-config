const EM_DASH = '—';

const ENTITY = String.raw`&mdash;|&#0*8212(?!\d);?|&#[Xx]0*2014(?![\dA-Fa-f]);?`;
// An escape only counts after an even run of backslashes, since
// `\\u2014` is a literal backslash followed by `u2014`.
const ESCAPE = String.raw`(?<=(?<!\\)(?:\\\\)*)\\u(?:2014|\{0*2014\})`;

// Each node only matches the spellings its syntax decodes: JS ignores entities and markup ignores
// escapes. Vue decodes entities before parsing template expressions, so those take both.
const SCRIPT_SPELLINGS = new RegExp(`${EM_DASH}|${ESCAPE}`, 'gu');
const MARKUP_SPELLINGS = new RegExp(`${EM_DASH}|${ENTITY}`, 'gu');
const TEMPLATE_EXPRESSION_SPELLINGS = new RegExp(`${EM_DASH}|${ENTITY}|${ESCAPE}`, 'gu');
const LETTER = /\p{L}/u;

// The `n` in `\n` is an escape, not part of a word.
function isLetterAt(raw, index) {
	if (!LETTER.test(raw[index] ?? '')) {
		return false;
	}
	let backslashes = 0;
	while (raw[index - 1 - backslashes] === '\\') {
		backslashes++;
	}
	return backslashes % 2 === 0;
}

// A hyphen keeps the author's spacing, except between two words, where `word-word` would read as
// a compound.
function hyphenFor(raw, match) {
	if (isLetterAt(raw, match.index - 1) && isLetterAt(raw, match.index + match[0].length)) {
		return ' - ';
	}
	return '-';
}

// HTML collapses the whitespace around text, so `<td>\n\t—\n</td>` is still a placeholder. Text
// beside a mustache or JSX expression is joining two values instead.
function isLoneText(node) {
	if (node.value.trim() !== EM_DASH) {
		return false;
	}
	return node.parent.children.every(child => child === node || (child.type === node.type && !child.value.trim()));
}

export default {
	meta: {
		type: 'suggestion',
		docs: { description: 'Disallow em dashes in strings, template text, and attributes that people read' },
		hasSuggestions: true,
		schema: [],
		messages: {
			emDash: 'Avoid em dashes in copy. Use a hyphen, comma, colon, or parentheses instead.',
			useHyphen: 'Replace the em dash with a hyphen.',
		},
	},
	create(context) {
		const { sourceCode } = context;

		// A dash standing alone is a placeholder for an empty value (`value ?? '—'`), not prose. A
		// spaced one (`' — '`) is a separator joining two values, so it still counts.
		const check = function(node, text, isPlaceholder, spellings) {
			if (typeof text !== 'string' || !text.includes(EM_DASH) || isPlaceholder) {
				return;
			}
			const raw = sourceCode.getText(node);
			const matches = raw.matchAll(spellings).toArray();
			if (matches.length === 0) {
				// A spelling the pattern doesn't know is still reported, just without a suggestion.
				context.report({ node, messageId: 'emDash' });
				return;
			}
			for (const match of matches) {
				const start = node.range[0] + match.index;
				const range = [start, start + match[0].length];
				context.report({
					loc: { start: sourceCode.getLocFromIndex(range[0]), end: sourceCode.getLocFromIndex(range[1]) },
					messageId: 'emDash',
					suggest: [{
						messageId: 'useHyphen',
						fix: fixer => fixer.replaceTextRange(range, hyphenFor(raw, match)),
					}],
				});
			}
		};

		const checkLiteral = (node, spellings) => check(node, node.value, node.value === EM_DASH, spellings);
		const checkTemplateElement = (node, spellings) => {
			// The tag decides what a tagged template means (`css`, `sql`, `String.raw`), so it isn't copy.
			if (node.parent.parent.type === 'TaggedTemplateExpression') {
				return;
			}
			const text = node.value.cooked;
			check(node, text, text === EM_DASH && node.parent.quasis.length === 1, spellings);
		};

		const visitor = {
			Literal: (node) => {
				// A JSX attribute string is markup, unlike a string inside a JSX expression.
				if (node.parent.type === 'JSXAttribute') {
					checkLiteral(node, MARKUP_SPELLINGS);
				} else {
					checkLiteral(node, SCRIPT_SPELLINGS);
				}
			},
			TemplateElement: node => checkTemplateElement(node, SCRIPT_SPELLINGS),
			JSXText: node => check(node, node.value, isLoneText(node), MARKUP_SPELLINGS),
		};

		const parserServices = sourceCode.parserServices;
		if (!parserServices?.defineTemplateBodyVisitor) {
			return visitor;
		}
		// Template copy is the main target in a Vue app: text, static attributes, and expressions.
		return parserServices.defineTemplateBodyVisitor({
			VText: node => check(node, node.value, isLoneText(node), MARKUP_SPELLINGS),
			VLiteral: node => checkLiteral(node, MARKUP_SPELLINGS),
			Literal: node => checkLiteral(node, TEMPLATE_EXPRESSION_SPELLINGS),
			TemplateElement: node => checkTemplateElement(node, TEMPLATE_EXPRESSION_SPELLINGS),
		}, visitor);
	},
};
