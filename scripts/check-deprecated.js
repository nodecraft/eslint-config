'use strict';

// manually run script with `node scripts/check-deprecated.js`
// this is just a quick check to see if any deprecated rules are used

const { ESLint } = require('eslint');

(async function main() {
	const configs = [
		'./index',
		'./typescript',
		'./vue',
		'./vue3',
		'./vue-a11y',
	];
	for (const config of configs) {
		const eslint = new ESLint({
			overrideConfig: {
				extends: [config],
			},
		});
		console.log(`Checking ${config}...`);
		const results = await eslint.lintFiles(['**/*.js']);

		const deprecatedRules = new Set();
		for (const result of results) {
			for (const rule of result.usedDeprecatedRules) {
				deprecatedRules.add(rule);
			}
		}
		if (deprecatedRules.size > 0) {
			process.exitCode = 1;
			console.log(`Deprecated rules: ${deprecatedRules.size}`);
			console.log(deprecatedRules);
		} else {
			console.log('No deprecated rules used.');
		}
	}
})().catch((error) => {
	process.exitCode = 1;
	console.error(error);
});
