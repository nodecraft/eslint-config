'use strict';

module.exports = {
	rules: {
		// disallow require calls to be mixed with regular variable declarations
		'n/no-mixed-requires': ['error', {
			grouping: true,
		}],

		// Disallow require()s for files that npm ignores
		'n/no-unpublished-require': 'off',

		//Disallow import declarations for files that npm ignores
		'n/no-unpublished-import': 'off',
	},
};
