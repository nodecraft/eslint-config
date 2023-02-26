'use strict';


module.exports = {
	rules: {
		// disallow require calls to be mixed with regular variable declarations
		'node/no-mixed-requires': ['error', {
			'grouping': true,
		}],

		// Disallow require()s for files that npm ignores
		'node/no-unpublished-require': 'off',

		//Disallow import declarations for files that npm ignores
		'node/no-unpublished-import': 'off',
	},
};
