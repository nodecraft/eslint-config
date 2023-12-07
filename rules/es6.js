'use strict';


module.exports = {
	rules: {
		// require braces around arrow function bodies
		'arrow-body-style': ['error', 'as-needed', {
			requireReturnForObjectLiteral: true,
		}],

		// disallow duplicate module imports
		'no-duplicate-imports': 'error',

		// disallow unnecessary computed property keys in objects and classes
		'no-useless-computed-key': 'error',

		// disallow renaming import, export, and destructured assignments to the same name
		'no-useless-rename': ['error', {
			ignoreDestructuring: false,
			ignoreImport: false,
			ignoreExport: false,
		}],

		// require `let` or `const` instead of `var`
		'no-var': 'error',

		// require `const` declarations for variables that are never reassigned after declared
		'prefer-const': 'error',
	},
};
