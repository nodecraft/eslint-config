import pluginVue from 'eslint-plugin-vue';
import vueEslintParser from 'vue-eslint-parser';

import pluginVueRules from '../rules/plugin-vue3.js';

export default [
	...pluginVue.configs['flat/recommended'],
	{
		files: ['*.vue', '**/*.vue'],
		languageOptions: {
			parser: vueEslintParser,
		},
	},
	pluginVueRules,
];
