"use strict";
module.exports = {
	rules: {
		// Disallow require()s for files that npm ignores
		"node/no-unpublished-require": "off",

		//Disallow import declarations for files that npm ignores
		"node/no-unpublished-import": "off"
	}
};