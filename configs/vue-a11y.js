import vuejsAccessibility from 'eslint-plugin-vuejs-accessibility';
import vueEslintParser from 'vue-eslint-parser';

import pluginVuejsAccessibilityRules from '../rules/plugin-vuejs-accessibility.js';

export default [
	...vuejsAccessibility.configs['flat/recommended'],
	{
		languageOptions: {
			parser: vueEslintParser,
		},
		plugins: {
			'vuejs-accessibility': vuejsAccessibility,
		},
	},
	pluginVuejsAccessibilityRules,
];
