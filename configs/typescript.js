import tseslint from 'typescript-eslint';

import base from './base.js';

export default [
	...base,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				ecmaVersion: 2023,
				sourceType: 'module',
			},
		},
		rules: {
			'n/no-unsupported-features/es-syntax': 'off',

			// disable a few native rules and use their typescript versions
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', {
				ignoreRestSiblings: true,
			}],

			'no-use-before-define': 'off',
			'@typescript-eslint/no-use-before-define': 'error',

			'n/no-missing-import': 'off',
			'no-duplicate-imports': 'off',
			'no-undef': 'off',

			'unicorn/custom-error-definition': 'off',

			'@typescript-eslint/no-explicit-any': 'warn',

			'no-restricted-syntax': [
				'error',
				{
					selector: 'TSEnumDeclaration',
					message: 'Don\'t declare enums - they\'re difficult to transpile. Use object literals instead.',
				},
			],
		},
	},
];
