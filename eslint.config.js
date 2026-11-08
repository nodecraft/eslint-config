import { defineConfig } from 'eslint/config';

import base from './configs/base.js';
import typescript from './configs/typescript.js';

export default defineConfig([
	...base,
	{
		languageOptions: {
			sourceType: 'module',
		},
		rules: {
			strict: 'off',
		},
	},
	{
		files: ['**/*.ts'],
		extends: [typescript],
	},
]);
