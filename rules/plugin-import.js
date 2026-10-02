import { createNodeResolver } from 'eslint-plugin-import-x';

export default {
	settings: {
		// Without a configured resolver, import-x re-looks-up the legacy `node` resolver package on every uncached import, which made import-x/order ~10x slower.
		'import-x/resolver-next': [createNodeResolver()],
		// Subpath imports often only resolve through a bundler, and an unresolved one would otherwise sort as `unknown` after everything else.
		'import-x/internal-regex': '^#',
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
				'internal',
				['parent', 'sibling'],
				'index',
				'type',
				'object',
			],
			'newlines-between': 'always',
		}],
	},
};
