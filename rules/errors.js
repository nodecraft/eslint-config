
module.exports = {
	rules: {
		// disallow the use of console
		"no-console": "off",

		// disallow empty block statements
		"no-empty": ["error", {
			"allowEmptyCatch": true
		}],

		// disallow null comparisons without type-checking operators
		"no-eq-null": "error",

		// disallow assignments that can lead to race conditions due to usage of await or yield
		"require-atomic-updates": "warn"
	}
};