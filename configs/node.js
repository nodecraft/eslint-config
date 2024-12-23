import nodePlugin from 'eslint-plugin-n';

import pluginNodeRules from '../rules/plugin-node.js';

export default [
	{
		plugins: {
			node: nodePlugin,
		},
	},
	nodePlugin.configs['flat/recommended'],
	pluginNodeRules,
];
