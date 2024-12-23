import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import importNewlines from 'eslint-plugin-import-newlines';
import importPlugin from 'eslint-plugin-import-x';
import jsonPlugin from 'eslint-plugin-json';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

import bestPracticesRules from '../rules/best-practices.js';
import errorsRules from '../rules/errors.js';
import es6Rules from '../rules/es6.js';
import oldAndDeprecatedRules from '../rules/old-and-deprecated.js';
import pluginImportNewlinesRules from '../rules/plugin-import-newlines.js';
import pluginImportRules from '../rules/plugin-import.js';
import pluginStylisticRules from '../rules/plugin-stylistic.js';
import pluginUnicornRules from '../rules/plugin-unicorn.js';
import suggestionsRules from '../rules/suggestions.js';
import variablesRules from '../rules/variables.js';

export default [
	js.configs.recommended,
	jsonPlugin.configs['recommended-with-comments'],
	bestPracticesRules,
	errorsRules,
	variablesRules,
	es6Rules,
	suggestionsRules,
	oldAndDeprecatedRules,
	{
		languageOptions: {
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'script',
			},
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2020,
			},
		},
		rules: {
			strict: ['error', 'global'],
		},
		plugins: {
			'@stylistic': stylistic,
			'json': jsonPlugin,
			'unicorn': unicorn,
			'import-x': importPlugin,
			'import-newlines': importNewlines,
		},
	},
	pluginImportNewlinesRules,
	pluginImportRules,
	pluginStylisticRules,
	pluginUnicornRules,
];
