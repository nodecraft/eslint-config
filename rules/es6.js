'use strict';


module.exports = {
	rules: {
		// require braces around arrow function bodies
		'arrow-body-style': ['error', 'as-needed', {
			'requireReturnForObjectLiteral': true,
		}],

		// require parentheses around arrow function arguments
		'arrow-parens': ['error', 'as-needed', {
			'requireForBlockBody': true,
		}],

		// enforce consistent spacing before and after the arrow in arrow functions
		'arrow-spacing': ['error', {'before': true, 'after': true}],

		// disallow duplicate module imports
		'no-duplicate-imports': 'error',

		// disallow arrow functions where they could be confused with comparisons
		'no-confusing-arrow': 'error',

		// disallow unnecessary computed property keys in objects and classes
		'no-useless-computed-key': 'error',

		// disallow renaming import, export, and destructured assignments to the same name
		'no-useless-rename': ['error', {
			'ignoreDestructuring': false,
			'ignoreImport': false,
			'ignoreExport': false,
		}],

		// require `let` or `const` instead of `var`
		'no-var': 'error',

		// require `const` declarations for variables that are never reassigned after declared
		'prefer-const': 'error',

		// require or disallow spacing around embedded expressions of template strings
		'template-curly-spacing': ['error', 'never'],
	},
};
