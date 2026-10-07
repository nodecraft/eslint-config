import pkg from '../package.json' with { type: 'json' };
import noConstantComputed from './vue/no-constant-computed.js';
import noDeprecatedProps from './vue/no-deprecated-props.js';

export default {
	meta: {
		name: 'eslint-plugin-nodecraft-vue',
		version: pkg.version,
	},
	rules: {
		'no-constant-computed': noConstantComputed,
		'no-deprecated-props': noDeprecatedProps,
	},
};
