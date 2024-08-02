// disable some rules now handled by other plugins like ESLint stylistic
// these rules are inherited from `eslint:recommended`
export default {
	rules: {
		'no-mixed-spaces-and-tabs': 'off',
		'no-extra-semi': 'off',
		'no-process-exit': 'off',
	},
};
