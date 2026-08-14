import pkg from '../package.json' with { type: 'json' };
import noChainedTypeAssertions from './antislop/no-chained-type-assertions.js';
import noMultilineConditionalSpread from './antislop/no-multiline-conditional-spread.js';
import noObjectParameters from './antislop/no-object-parameters.js';

export default {
	meta: {
		name: 'eslint-plugin-nodecraft-antislop',
		version: pkg.version,
	},
	rules: {
		'no-chained-type-assertions': noChainedTypeAssertions,
		'no-multiline-conditional-spread': noMultilineConditionalSpread,
		'no-object-parameters': noObjectParameters,
	},
};
