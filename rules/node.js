
module.exports = {
	rules: {
		// disallow require calls to be mixed with regular variable declarations
		"no-mixed-requires": ["error", {
			"grouping": true
		}],

		// disallow trailing whitespace at the end of lines
		"no-trailing-spaces": "error"
	}
};