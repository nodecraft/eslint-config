import nodePlugin from 'eslint-plugin-n';

import asyncCallbackPlugin from '../plugins/async-callback.js';
import pluginAsyncCallbackRules from '../rules/plugin-async-callback.js';
import pluginNodeRules from '../rules/plugin-node.js';

export default [
	{
		plugins: {
			'node': nodePlugin,
			'async-callback': asyncCallbackPlugin,
		},
	},
	nodePlugin.configs['flat/recommended'],
	pluginNodeRules,
	pluginAsyncCallbackRules,
];
