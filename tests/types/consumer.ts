// Imports by package name so the published exports map and its declarations are what get checked.
import nodecraft from '@nodecraft/eslint-config';
import base from '@nodecraft/eslint-config/base';
import json from '@nodecraft/eslint-config/json';
import node from '@nodecraft/eslint-config/node';
import antislop from '@nodecraft/eslint-config/plugins/antislop';
import asyncCallback from '@nodecraft/eslint-config/plugins/async-callback';
import optionalChain from '@nodecraft/eslint-config/plugins/optional-chain.js';
import spawnpointCodes from '@nodecraft/eslint-config/plugins/spawnpoint-codes';
import subpathImports from '@nodecraft/eslint-config/plugins/subpath-imports';
import nodecraftVue from '@nodecraft/eslint-config/plugins/vue';
import typescript from '@nodecraft/eslint-config/typescript';
import vueA11y from '@nodecraft/eslint-config/vue-a11y';
import vue3 from '@nodecraft/eslint-config/vue3';

import type { Linter } from 'eslint';

// @ts-expect-error guards against the default export widening to `any`
export const missing = nodecraft.configs.missing;

export default [
	...nodecraft.configs.base,
	...nodecraft.configs.json,
	...nodecraft.configs.node,
	...nodecraft.configs.typescript,
	...nodecraft.configs.vue3,
	...nodecraft.configs.vueA11y,
	...base,
	...json,
	...node,
	...typescript,
	...vue3,
	...vueA11y,
	{
		plugins: {
			antislop,
			'async-callback': asyncCallback,
			'optional-chain': optionalChain,
			'spawnpoint-codes': spawnpointCodes,
			'subpath-imports': subpathImports,
			'nodecraft-vue': nodecraftVue,
		},
	},
] satisfies Linter.Config[];
