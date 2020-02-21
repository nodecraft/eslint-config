"use strict";
module.exports = {
	rules: {
		// enforce return statements in callbacks of array methods
		"callback-return": "error",

		// enforce consistent brace style for all control statements
		"curly": "error",

		// require the use of === and !==
		"eqeqeq": "error",

		// disallow the use of eval()
		"no-eval": "error",

		// disallow the use of eval()-like methods
		"no-implied-eval": "error",

		// disallow multiple spaces
		"no-multi-spaces": "error",

		// disallow assignment operators in `return` statements
		"no-return-assign": ["error"],

		// disallow redundant return statements
		"no-useless-return": "error"
	}
};