'use strict';

module.exports = {
	rules: {
		// disallow the use of console
		'no-console': 'off',

		// disallows expressions where the operation doesn't affect the value
		'no-constant-binary-expression': 'error',

		// disallow empty block statements
		'no-empty': ['error', {
			'allowEmptyCatch': true,
		}],

		// disallow literal numbers that lose precision
		'no-loss-of-precision': 'error',

		// disallow returning values from Promise executor functions
		'no-promise-executor-return': 'error',

		// disallow template literal placeholder syntax in regular strings
		'no-template-curly-in-string': 'warn',

		// disallow loops with a body that allows only one iteration
		'no-unreachable-loop': 'error',

		// disallow use of optional chaining in contexts where the `undefined` value is not allowed
		'no-unsafe-optional-chaining': 'error',

		// disallow assignments that can lead to race conditions due to usage of await or yield
		'require-atomic-updates': ['warn', {
			'allowProperties': true,
		}],
	},
};
