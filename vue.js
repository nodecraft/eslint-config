'use strict';

const extendData = ['plugin:vue/vue2-recommended'];
const internalExtends = [
	'./rules/plugin-vue',
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
	],
	env: {
		browser: true,
		node: true,
		es2020: true,
	},
};
