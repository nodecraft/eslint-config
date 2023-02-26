'use strict';


module.exports = {
	rules: {
		// enforce return statements in callbacks of array methods
		'callback-return': 'error',

		// enforce consistent brace style for all control statements
		'curly': ['error', 'all'],

		// enforce dot notation whenever possible
		'dot-notation': 'error',

		// require the use of === and !==
		'eqeqeq': 'error',

		// disallow `else` blocks after `return` statements in `if` statements
		'no-else-return': 'error',

		// disallow null comparisons without type-checking operators
		'no-eq-null': 'error',

		// disallow the use of eval()
		'no-eval': 'error',

		// disallow shorthand type conversions
		'no-implicit-coercion': 'error',

		// disallow the use of eval()-like methods
		'no-implied-eval': 'error',

		// disallow the use of the `__iterator__` property
		'no-iterator': 'error',

		// disallow labeled statements
		'no-labels': 'error',

		// disallow multiple spaces
		'no-multi-spaces': 'error',

		// disallow the use of the `__proto__` property
		'no-proto': 'error',

		// disallow certain object properties
		'no-restricted-properties': [
			'error',
			{
				'object': 'arguments',
				'property': 'callee',
				'message': 'arguments.callee is deprecated',
			},
			{
				'object': 'global',
				'property': 'isFinite',
				'message': 'Please use Number.isFinite instead',
			},
			{
				'object': 'self',
				'property': 'isFinite',
				'message': 'Please use Number.isFinite instead',
			},
			{
				'object': 'window',
				'property': 'isFinite',
				'message': 'Please use Number.isFinite instead',
			},
			{
				'object': 'global',
				'property': 'isNaN',
				'message': 'Please use Number.isNaN instead',
			},
			{
				'object': 'self',
				'property': 'isNaN',
				'message': 'Please use Number.isNaN instead',
			},
			{
				'object': 'window',
				'property': 'isNaN',
				'message': 'Please use Number.isNaN instead',
			},
			{
				'property': '__defineGetter__',
				'message': 'Please use Object.defineProperty instead',
			},
			{
				'property': '__defineSetter__',
				'message': 'Please use Object.defineProperty instead',
			},
			{
				'object': 'Math',
				'property': 'pow',
				'message': 'Use the exponentiation operator (**) instead',
			},
		],

		// disallow assignment operators in `return` statements
		'no-return-assign': 'error',

		// disallow unnecessary `return await`
		'no-return-await': 'error',

		// disallow redundant return statements
		'no-useless-return': 'error',

		// disallow assignments where both sides are exactly the same
		'no-self-assign': 'error',

		// disallow comparisons where both sides are exactly the same
		'no-self-compare': 'error',

		// disallow comma operators
		'no-sequences': 'error',

		// disallow throwing literals as exceptions
		'no-throw-literal': 'error',

		// require or disallow "Yoda" conditions
		'yoda': ['error', 'never'],

	},
};
