// manually run script with `node scripts/check-deprecated.js`
// this is just a quick check to see if any deprecated rules are used
import { ESLint } from 'eslint';

import baseConfig from '../configs/base.js';
import typescriptConfig from '../configs/typescript.js';
import vueA11yConfig from '../configs/vue-a11y.js';
import vue3Config from '../configs/vue3.js';


(async function main() {
	const configs = {
		base: baseConfig,
		typescript: typescriptConfig,
		vueA11y: vueA11yConfig,
		vue3: vue3Config,
	};
	for (const [configName, config] of Object.entries(configs)) {
		const eslint = new ESLint({
			overrideConfig: config,
		});
		console.log(`Checking ${configName}...`);
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
