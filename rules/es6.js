'use strict';


module.exports = {
	rules: {
		// require `let` or `const` instead of `var`
		"no-var": "error",

		// require `const` declarations for variables that are never reassigned after declared
		"prefer-const": "error",

		// require or disallow spacing around embedded expressions of template strings
		"template-curly-spacing": ["error", "never"]
	}
};