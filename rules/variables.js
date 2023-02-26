'use strict';


module.exports = {
	rules: {
		// disallow specified global variables
		'no-restricted-globals': [
			'error',
			{
				'name': 'isNaN',
				'message': 'Please use Number.IsNaN instead, with explicit coercion beforehand if necessary',
			},
			{
				'name': 'isFinite',
				'message': 'Please use Number.isFinite instead',
			},
		],

		// disallow unused variables
		'no-unused-vars': ['error', {
			'ignoreRestSiblings': true,
		}],

		// disallow the use of variables before they are defined
		'no-use-before-define': ['error'],
	},
};
