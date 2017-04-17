"use strict";
module.exports = {
	extends: [
		"./rules/best-practices",
		"./rules/errors",
		"./rules/node",
		"./rules/style",
		"./rules/variables",
		"./rules/es6",
		"./rules/plugin-node",
	].map(require.resolve),
	parserOptions: {
		ecmaVersion: 2017,
	},
	rules: {
		strict: ["error", "global"]
	}
};