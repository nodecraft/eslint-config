"use strict";
module.exports = {
	rules: {
		// disallow the use of console
		"no-console": "off",

		// disallow empty block statements
		"no-empty": ["error", {
			"allowEmptyCatch": true
		}],

		// disallow null comparisons without type-checking operators
		"no-eq-null": "error",
	}
};