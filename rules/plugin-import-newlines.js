'use strict';

module.exports = {
	rules: {
		// require newlines in import statements past a certain number of items
		'import-newlines/enforce': [
			'error',
			{
				items: 3,
				semi: true,
			},
		],
	},
};
