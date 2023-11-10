'use strict';

module.exports = {
	rules: {
		// enforce minimum and maximum identifier lengths
		'id-length': ['error', {
			'min': 2, // prevent 1 character variables,
			'exceptions': [
				'i', // allow i for iterators
				'x', // allow for coordinates
				'y', // allow for coordinates
				'_', // allow _ for lodash (TODO: remove when enforcing unicorn/import-style for lodash)
			],
			'properties': 'never',
		}],

		// disallow `if` statements as the only statement in `else` blocks
		'no-lonely-if': ['error'],

		// disallow ternary operators when simpler alternatives exist
		'no-unneeded-ternary': ['error'],

		// enforce variables to be declared separately
		'one-var': ['error', {
			'var': 'never',
			'let': 'never',
			'const': 'never',
			'separateRequires': true,
		}],

		// disallow the use of `Math.pow` in favor of the `**` operator
		'prefer-exponentiation-operator': ['error'],

		// enforce sorted import declarations within modules
		// we use import/order for most things, but ths for member sorting
		'sort-imports': ['error', {
			'ignoreCase': false,
			'ignoreDeclarationSort': true,
			'ignoreMemberSort': false,
			'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single'],
			'allowSeparatedGroups': false,
		}],
	},
};
