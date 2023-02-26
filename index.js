'use strict';

const extendData = ['eslint:recommended', 'plugin:node/recommended', 'plugin:json/recommended-with-comments'];
const internalExtends = [
	'./rules/best-practices',
	'./rules/errors',
	'./rules/style',
	'./rules/variables',
	'./rules/es6',
	'./rules/plugin-node',
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
		'json',
		'node',
		'unicorn',
	],
	env: {
		browser: true,
		node: true,
		es2020: true,
	},
};
