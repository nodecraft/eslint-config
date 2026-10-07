export default {
	rules: {
		// flag computed() getters with no reactive dependencies, which are just constants
		'nodecraft-vue/no-constant-computed': 'warn',
		// flag props the imported component marks @deprecated, read from its own declarations
		'nodecraft-vue/no-deprecated-props': 'warn',
	},
};
