'use strict';

const extendData = ['plugin:vue/vue3-recommended'];
const internalExtends = [
	'./rules/plugin-vue3',
].map(require.resolve); // eslint-disable-line unicorn/no-array-callback-reference

module.exports = {
	extends: [...extendData, ...internalExtends],
	parser: 'vue-eslint-parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'script',
	},
	rules: {
		strict: ['error', 'global'],
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
	globals: {
		/* Vue 3 compiler macros used in <script setup> */
		defineProps: 'readonly',
		defineEmits: 'readonly',
		defineExpose: 'readonly',
		withDefaults: 'readonly',
	},
};
