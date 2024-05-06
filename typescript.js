'use strict';

const internalExtends = [
	'./index',
	'./rules/plugin-typescript',
].map(require.resolve); // eslint-disable-line unicorn/no-array-callback-reference

module.exports = {
	extends: [
		...internalExtends,
		'plugin:@typescript-eslint/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
	},
	plugins: [
		'json',
		'n',
	],
	env: {
		browser: true,
		node: true,
		es2020: true,
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
	},
};
