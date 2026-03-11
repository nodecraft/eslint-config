export default {
	rules: {
		'import-x/order': ['error', {
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
