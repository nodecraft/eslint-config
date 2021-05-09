'use strict';

module.exports = {
	rules: {
		// Enforce label tags have associated control, but only require either nesting, or explicit ID/for match, not both
		"vuejs-accessibility/label-has-for": ["error",	{
			"required": {
				"some": ["nesting", "id"],
			},
			"allowChildren": false,
		}],
	},
};