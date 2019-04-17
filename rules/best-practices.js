"use strict";
module.exports = {
	rules: {
		// enforce return statements in callbacks of array methods
		"callback-return": "error",

		// enforce consistent brace style for all control statements
		"curly": "error",

		// require the use of === and !==
		"eqeqeq": "error",

		// isallow the use of eval()
		"no-eval": "error",

		// disallow the use of eval()-like methods
		"no-implied-eval": "error",

		// disallow multiple spaces
		"no-multi-spaces": "error",

		// disallow redundant return statements
		"no-useless-return": "error",

		// require or disallow semicolons instead of ASI
		"semi": "error",

		// enforce consistent spacing before blocks
		"space-before-blocks": ["error", "never"],

		// enforce consistent spacing before function definition opening parenthesis
		"space-before-function-paren": ["error", {
			"anonymous": "never",
			"named": "never",
			"asyncArrow": "always"
		}],

		// require spacing around infix operators
		"space-infix-ops": ["error"],

		// enforce consistent spacing before or after unary operators
		"space-unary-ops": ["error", {
			"words": true,
			"nonwords": false,
			"overrides": {
				"typeof": false
			}
		}]
	}
};