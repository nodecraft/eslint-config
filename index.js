"use strict";

var extendData = ["eslint:recommended", "plugin:node/recommended", "plugin:json/recommended-with-comments"];
var internalExtends = [
	"./rules/best-practices",
	"./rules/errors",
	"./rules/node",
	"./rules/style",
	"./rules/variables",
	"./rules/es6",
	"./rules/plugin-node"
].map(require.resolve);

module.exports = {
	extends: extendData.concat(internalExtends),
	parserOptions: {
		ecmaVersion: 2019
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
		node: true
	}
};