'use strict';

const extendData = [
	'eslint:recommended',
	'plugin:n/recommended',
	'plugin:json/recommended-with-comments-legacy',
];
const internalExtends = [
	'./rules/best-practices',
	'./rules/errors',
	'./rules/variables',
	'./rules/es6',
	'./rules/suggestions',
	'./rules/old-and-deprecated',
	'./rules/plugin-import-newlines',
	'./rules/plugin-import',
	'./rules/plugin-node',
	'./rules/plugin-stylistic',
	'./rules/plugin-unicorn',
].map(require.resolve); // eslint-disable-line unicorn/no-array-callback-reference

module.exports = {
	extends: [...extendData, ...internalExtends],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'script',
	},
	rules: {
		strict: ['error', 'global'],
	},
	plugins: [
		'@stylistic',
		'json',
		'n',
		'unicorn',
		'import',
		'import-newlines',
	],
	env: {
		browser: true,
		node: true,
		es2020: true,
	},
};
