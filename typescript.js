'use strict';

const internalExtends = [
	'./index',
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
		'node',
	],
	env: {
		browser: true,
		node: true,
		es2020: true,
	},
	rules: {
		'node/no-unsupported-features/es-syntax': 'off',

		// disable a bunch of native rules and use their typescript versions
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': ['warn', {
			'ignoreRestSiblings': true,
		}],
		'@typescript-eslint/type-annotation-spacing': ['error', {
			'before': false,
			'after': true,
		}],
		'@typescript-eslint/member-delimiter-style': 'error',

		'brace-style': 'off',
		'@typescript-eslint/brace-style': ['error', '1tbs', {
			'allowSingleLine': true,
		}],

		'space-infix-ops': 'off',
		'@typescript-eslint/space-infix-ops': 'error',

		'space-before-blocks': 'off',
		'@typescript-eslint/space-before-blocks': ['error', {
			'functions': 'always',
			'keywords': 'always',
			'classes': 'always',
		}],

		'space-before-function-paren': 'off',
		'@typescript-eslint/space-before-function-paren': ['error', {
			'anonymous': 'never',
			'named': 'never',
			'asyncArrow': 'always',
		}],

		'semi': 'off',
		'@typescript-eslint/semi': 'error',

		'key-spacing': 'off',
		'@typescript-eslint/key-spacing': ['error', {
			'beforeColon': false,
			'afterColon': true,
		}],

		'object-curly-spacing': 'off',
		'@typescript-eslint/object-curly-spacing': ['error', 'never'],

		'no-use-before-define': 'off',
		'@typescript-eslint/no-use-before-define': 'error',

		'node/no-missing-import': 'off',
		'no-duplicate-imports': 'off',
		'no-undef': 'off',

		'unicorn/custom-error-definition': 'off',

		'quotes ': 'off',
		'@typescript-eslint/quotes': ['error', 'single'],

		'func-call-spacing': 'off',
		'@typescript-eslint/func-call-spacing': 'error',

		'indent': 'off',
		'@typescript-eslint/indent': ['error', 'tab', {
			'SwitchCase': 1,
		}],

		'@typescript-eslint/no-explicit-any': 'warn',
	},
};
