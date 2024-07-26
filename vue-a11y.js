'use strict';

const extendData = ['plugin:vuejs-accessibility/recommended'];
const internalExtends = [
	'./rules/plugin-vuejs-accessibility',
].map(require.resolve); // eslint-disable-line unicorn/no-array-callback-reference

module.exports = {
	extends: [...extendData, ...internalExtends],
	parser: 'vue-eslint-parser',
	parserOptions: {
		ecmaVersion: 2023,
		sourceType: 'script',
	},
	rules: {
		strict: ['error', 'global'],
	},
	plugins: [
		'json',
		'n',
		'vuejs-accessibility',
	],
	env: {
		browser: true,
		node: true,
		es2020: true,
	},
};
