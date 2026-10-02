import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import importNewlines from 'eslint-plugin-import-newlines';
import importPlugin from 'eslint-plugin-import-x';
import regexp from 'eslint-plugin-regexp';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

import antislopPlugin from '../plugins/antislop.js';
import bestPracticesRules from '../rules/best-practices.js';
import errorsRules from '../rules/errors.js';
import es6Rules from '../rules/es6.js';
import oldAndDeprecatedRules from '../rules/old-and-deprecated.js';
import pluginImportNewlinesRules from '../rules/plugin-import-newlines.js';
import pluginImportRules from '../rules/plugin-import.js';
import pluginRegexpRules from '../rules/plugin-regexp.js';
import pluginStylisticRules from '../rules/plugin-stylistic.js';
import pluginUnicornRules from '../rules/plugin-unicorn.js';
import suggestionsRules from '../rules/suggestions.js';
import variablesRules from '../rules/variables.js';

export default [
	js.configs.recommended,
	bestPracticesRules,
	errorsRules,
	variablesRules,
	es6Rules,
	suggestionsRules,
	oldAndDeprecatedRules,
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'script',
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2020,
			},
		},
		rules: {
			'strict': ['error', 'global'],
			'antislop/no-chained-type-assertions': 'error',
			'antislop/no-multiline-conditional-spread': 'error',
			'antislop/no-object-parameters': 'error',
			'antislop/no-reduce-accumulator-copy': 'error',
		},
		plugins: {
			'@stylistic': stylistic,
			'unicorn': unicorn,
			'regexp': regexp,
			'import-x': importPlugin,
			'import-newlines': importNewlines,
			'antislop': antislopPlugin,
		},
	},
	{
		// Partial test doubles often need a deliberate widening step to stand in for a real value.
		files: [
			'**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}',
			'**/{test,tests}/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}',
		],
		rules: {
			'antislop/no-chained-type-assertions': 'off',
			'antislop/no-object-parameters': 'off',
		},
	},
	pluginImportNewlinesRules,
	pluginImportRules,
	pluginRegexpRules,
	pluginStylisticRules,
	pluginUnicornRules,
];
