"use strict";
module.exports = {
	rules: {
		// enforce consistent spacing inside array brackets
		"array-bracket-spacing": ["error", "never"],

		// enforce consistent brace style for blocks
		"brace-style": ["error", "1tbs", {
			"allowSingleLine": true
		}],

		// enforce consistent spacing before and after commas
		"comma-spacing": ["error", {
			"before": false,
			"after": true
		}],

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
				"return": {
					"before": false,
					"after": true
				},
				"case": {
					"before": false,
					"after": true
				}
			}
		}],

		// disallow or enforce spaces inside of parentheses
		"space-in-parens": ["error", "never"]
	}
};