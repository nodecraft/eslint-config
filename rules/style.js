"use strict";
module.exports = {
	rules: {
		// enforce consistent spacing inside array brackets
		"array-bracket-spacing": ["error", "never"],

		// enforce spaces inside of blocks after opening block and before closing block
		"block-spacing": ["error", "always"],

		// enforce consistent brace style for blocks
		"brace-style": ["error", "1tbs", {
			"allowSingleLine": true
		}],

		// enforce consistent spacing before and after commas
		"comma-spacing": ["error", {
			"before": false,
			"after": true
		}],

		// enforce consistent comma style
		"comma-style": ["error", "last"],

		// require or disallow spacing between function identifiers and their invocations
		"func-call-spacing": "error",

		// enforce consistent indentation
		"indent": ["error", "tab", {
			"SwitchCase": 1
		}],

		// enforce consistent spacing between keys and values in object literal properties
		"key-spacing": ["error", {
			"beforeColon": false,
			"afterColon": true
		}],

		// enforce consistent spacing before and after keywords
		"keyword-spacing": ["error", {
			"before": false,
			"after": false,
			"overrides": {
				"var": {
					"before": false,
					"after": true
				},
				"let": {
					"before": false,
					"after": true
				},
				"const": {
					"before": false,
					"after": true
				},
				"return": {
					"before": false,
					"after": true
				},
				"case": {
					"before": false,
					"after": true
				},
				"from": {
					"before": true,
					"after": true
				},
				"import": {
					"before": false,
					"after": true
				},
				"as": {
					"before": true,
					"after": true
				},
				"default": {
					"before": true,
					"after": true
				},
				"class": {
					"before": true,
					"after": true
				}
			}
		}],
		// disallow nested ternary expressions
		"no-nested-ternary": ["error"],

		// disallow or enforce spaces inside of parentheses
		"space-in-parens": ["error", "never"]
	}
};