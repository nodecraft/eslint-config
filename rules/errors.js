'use strict';


module.exports = {
	rules: {
		// disallow the use of console
		"no-console": "off",

		// disallow empty block statements
		"no-empty": ["error", {
			"allowEmptyCatch": true
		}],

		// disallow template literal placeholder syntax in regular strings
		"no-template-curly-in-string": "warn",

		// disallow assignments that can lead to race conditions due to usage of await or yield
		"require-atomic-updates": "warn"
	}
};