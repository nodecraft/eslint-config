'use strict';

module.exports = {
	rules: {
		// Emoji support has come a long way, so this is no longer good advice: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/627
		'vuejs-accessibility/accessible-emoji': 'off',

		// Enforce label tags have associated control, but only require either nesting, or explicit ID/for match, not both
		'vuejs-accessibility/label-has-for': ['error',	{
			'required': {
				'some': ['nesting', 'id'],
			},
			'allowChildren': false,
		}],
	},
};
