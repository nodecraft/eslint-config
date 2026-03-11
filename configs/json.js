import json from '@eslint/json';

export default [
	{
		files: ['**/*.json'],
		language: 'json/jsonc',
		...json.configs.recommended,
	},
	{
		files: ['package-lock.json'],
		rules: {
			'json/no-empty-keys': 'off',
		},
	},
];
