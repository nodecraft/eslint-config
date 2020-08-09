'use strict';

const extendData = ["plugin:vuejs-accessibility/recommended"];
const internalExtends = [
	"./rules/plugin-vuejs-accessibility"
].map(require.resolve);

module.exports = {
	extends: extendData.concat(internalExtends),
	parser: "vue-eslint-parser",
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "script"
	},
	rules: {
		strict: ["error", "global"]
	},
	plugins: [
		"json",
		"node",
		"vuejs-accessibility"
	],
	env: {
		browser: true,
		node: true,
		es2020: true
	}
};