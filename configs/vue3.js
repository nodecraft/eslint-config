import pluginVue from 'eslint-plugin-vue';
import vueEslintParser from 'vue-eslint-parser';

import nodecraftVuePlugin from '../plugins/vue.js';
import pluginNodecraftVueRules from '../rules/plugin-nodecraft-vue.js';
import pluginVueRules from '../rules/plugin-vue3.js';

export default [
	{
		plugins: {
			'nodecraft-vue': nodecraftVuePlugin,
		},
	},
	...pluginVue.configs['flat/recommended'],
	{
		files: ['*.vue', '**/*.vue'],
		languageOptions: {
			parser: vueEslintParser,
		},
	},
	pluginVueRules,
	pluginNodecraftVueRules,
];
