'use strict';

module.exports = {
	rules: {
		'import/order': ['error', {
			'alphabetize': {
				order: 'asc',
				caseInsensitive: true,
			},
			'groups': [
				'builtin',
				'external',
				['parent', 'sibling'],
				'index',
				'type',
				'object',
			],
			'newlines-between': 'always',
		}],
	},
};
