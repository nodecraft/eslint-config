// A conditional spread earns its place when it reads as one more entry in the literal. Once it
// wraps, the ternary becomes structure the reader has to unpack to learn what the literal holds.
const DEFAULT_MAX_LINES = 1;

// Line count alone is dodgeable by joining the lines back up, so the branch is also measured by how
// much it holds. Collapsing first makes that budget independent of how the branch happens to be
// formatted, and no amount of reformatting shrinks it.
const DEFAULT_MAX_LENGTH = 100;

const CONTAINER_LABELS = {
	ArrayExpression: 'array',
	ObjectExpression: 'object',
};

function collapsedLength(text) {
	return text.split('\n').map(line => line.trim()).join(' ').length;
}

export default {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallow conditional spreads that wrap, or hold more than a line\'s worth of content, inside an array or object literal',
		},
		schema: [{
			type: 'object',
			properties: {
				maxLines: { type: 'integer', minimum: 1 },
				maxLength: { type: 'integer', minimum: 1 },
			},
			additionalProperties: false,
		}],
		messages: {
			multilineConditionalSpread: 'This conditional spread wraps across {{lines}} lines. Keep it to one line, or name the branch and build the {{label}} up with statements.',
			longConditionalSpread: 'This conditional spread holds {{length}} characters. Name the branch and build the {{label}} up with statements rather than fitting it all on one line.',
		},
	},
	create(context) {
		const maxLines = context.options[0]?.maxLines ?? DEFAULT_MAX_LINES;
		const maxLength = context.options[0]?.maxLength ?? DEFAULT_MAX_LENGTH;

		return {
			SpreadElement(node) {
				const label = CONTAINER_LABELS[node.parent.type];
				if (!label || node.argument.type !== 'ConditionalExpression') {
					return;
				}

				const lines = node.loc.end.line - node.loc.start.line + 1;
				if (lines > maxLines) {
					context.report({
						node,
						messageId: 'multilineConditionalSpread',
						data: { lines, label },
					});
					return;
				}

				const length = collapsedLength(context.sourceCode.getText(node));
				if (length > maxLength) {
					context.report({
						node,
						messageId: 'longConditionalSpread',
						data: { length, label },
					});
				}
			},
		};
	},
};
