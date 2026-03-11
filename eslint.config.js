import base from './configs/base.js';

export default [
	...base,
	{
		languageOptions: {
			sourceType: 'module',
		},
		rules: {
			strict: 'off',
		},
	},
];
