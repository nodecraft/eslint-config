'use strict';

const extendData = ["eslint:recommended", "plugin:node/recommended", "plugin:json/recommended-with-comments", "plugin:vue/recommended"];
const internalExtends = [
	"./rules/best-practices",
	"./rules/errors",
	"./rules/node",
	"./rules/style",
	"./rules/variables",
	"./rules/es6",
	"./rules/plugin-node",
	"./rules/plugin-vue"
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
		"node"
	],
	env: {
		browser: true,
		node: true,
		es2020: true
	}
};