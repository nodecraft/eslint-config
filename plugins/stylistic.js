import pkg from '../package.json' with { type: 'json' };
import listStyle from './stylistic/list-style.js';

export default {
	meta: {
		name: 'eslint-plugin-nodecraft-stylistic',
		version: pkg.version,
	},
	rules: {
		'list-style': listStyle,
	},
};
