import { createNodeResolver } from 'eslint-plugin-import-x';

export default {
	settings: {
		// Without a configured resolver, import-x re-looks-up the legacy `node` resolver package on every uncached import, which made import-x/order ~10x slower.
		'import-x/resolver-next': [createNodeResolver()],
	},
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
