'use strict';

const extendData = ["eslint:recommended", "plugin:node/recommended", "plugin:json/recommended-with-comments"];
const internalExtends = [
	"./rules/best-practices",
	"./rules/errors",
	"./rules/style",
	"./rules/variables",
	"./rules/es6",
	"./rules/plugin-node"
].map(require.resolve);

module.exports = {
	extends: extendData.concat(internalExtends),
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