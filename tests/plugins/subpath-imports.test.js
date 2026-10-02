import path from 'node:path';

import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';
import vueEslintParser from 'vue-eslint-parser';

import plugin, { findSubpath } from '../../plugins/subpath-imports.js';

const rule = plugin.rules['no-deep-relative'];

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
});

const typescriptRuleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		parser: tseslint.parser,
		sourceType: 'module',
	},
});

const vueRuleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		parser: vueEslintParser,
		parserOptions: {
			parser: tseslint.parser,
		},
		sourceType: 'module',
	},
});

// The fixture package.json maps `#/*` to `./src/*`, so files only need a path, not to exist.
const fixtureRoot = path.join(import.meta.dirname, '../fixtures/subpath-imports');
const fixture = file => path.join(fixtureRoot, file);
const formsInput = fixture('src/components/forms/input.ts');

describe('no-deep-relative', () => {
	it('allows shallow relative, package, and subpath imports', () => {
		ruleTester.run('no-deep-relative', rule, {
			valid: [
				{ code: 'import { a } from \'../helpers\';', filename: formsInput },
				{ code: 'import { a } from \'./local\';', filename: formsInput },
				{ code: 'import { a } from \'#/libs/helpers\';', filename: formsInput },
				{ code: 'import { ref } from \'vue\';', filename: formsInput },
				{ code: 'export const value = 1;', filename: formsInput },
				{ code: 'import(name);', filename: formsInput },
				// eslint-disable-next-line no-template-curly-in-string -- literal source string, not a JS template
				{ code: 'import(`../../libs/${name}`);', filename: formsInput },
			],
			invalid: [],
		});
	});

	it('rewrites imports that climb more than one directory into the mapped folder', () => {
		ruleTester.run('no-deep-relative', rule, {
			valid: [],
			invalid: [
				{
					code: 'import { a } from \'../../libs/helpers\';',
					filename: formsInput,
					output: 'import { a } from \'#/libs/helpers\';',
					errors: [{ messageId: 'deepRelative', data: { source: '../../libs/helpers', replacement: '#/libs/helpers' } }],
				},
				{
					code: 'import { a } from "../../../../libs/helpers";',
					filename: fixture('src/components/forms/fields/text/input.ts'),
					output: 'import { a } from "#/libs/helpers";',
					errors: [{ messageId: 'deepRelative', data: { source: '../../../../libs/helpers', replacement: '#/libs/helpers' } }],
				},
				{
					code: 'import \'../../css/app.css\';',
					filename: formsInput,
					output: 'import \'#/css/app.css\';',
					errors: [{ messageId: 'deepRelative' }],
				},
				{
					code: 'import a from \'../../a\';\nimport b from \'../../b\';',
					filename: formsInput,
					output: 'import a from \'#/a\';\nimport b from \'#/b\';',
					errors: [{ messageId: 'deepRelative' }, { messageId: 'deepRelative' }],
				},
			],
		});
	});

	it('checks re-exports and dynamic imports', () => {
		ruleTester.run('no-deep-relative', rule, {
			valid: [],
			invalid: [
				{
					code: 'export * from \'../../libs/helpers\';',
					filename: formsInput,
					output: 'export * from \'#/libs/helpers\';',
					errors: [{ messageId: 'deepRelative' }],
				},
				{
					code: 'export { a } from \'../../libs/helpers\';',
					filename: formsInput,
					output: 'export { a } from \'#/libs/helpers\';',
					errors: [{ messageId: 'deepRelative' }],
				},
				{
					code: 'const page = () => import(\'../../routes/page.vue\');',
					filename: formsInput,
					output: 'const page = () => import(\'#/routes/page.vue\');',
					errors: [{ messageId: 'deepRelative' }],
				},
			],
		});
	});

	it('measures depth after normalizing the path', () => {
		ruleTester.run('no-deep-relative', rule, {
			valid: [
				// Climbs one, down one and up again, which normalizes to a single `../`.
				{ code: 'import { a } from \'../fields/../helpers\';', filename: formsInput },
			],
			invalid: [
				{
					code: 'import { a } from \'./../../libs/helpers\';',
					filename: formsInput,
					output: 'import { a } from \'#/libs/helpers\';',
					errors: [{ messageId: 'deepRelative', data: { source: './../../libs/helpers', replacement: '#/libs/helpers' } }],
				},
				{
					code: 'import { a } from \'../fields/../../libs/helpers\';',
					filename: formsInput,
					output: 'import { a } from \'#/libs/helpers\';',
					errors: [{ messageId: 'deepRelative', data: { source: '../fields/../../libs/helpers', replacement: '#/libs/helpers' } }],
				},
			],
		});
	});

	it('keeps bundler query strings and skips loader syntax', () => {
		ruleTester.run('no-deep-relative', rule, {
			valid: [
				{ code: 'import raw from \'../../libs/template.html!raw\';', filename: formsInput },
			],
			invalid: [
				{
					code: 'import logo from \'../../images/logo.svg?raw\';',
					filename: formsInput,
					output: 'import logo from \'#/images/logo.svg?raw\';',
					errors: [{ messageId: 'deepRelative', data: { source: '../../images/logo.svg?raw', replacement: '#/images/logo.svg?raw' } }],
				},
			],
		});
	});

	it('only reports when a subpath import actually reaches the target', () => {
		ruleTester.run('no-deep-relative', rule, {
			valid: [
				// Escapes the package root.
				{ code: 'import { a } from \'../../outside\';', filename: fixture('src/index.ts') },
				// Lands outside every mapped folder.
				{ code: 'import { a } from \'../../helpers/setup\';', filename: fixture('tests/unit/deep/input.test.ts') },
				// `#/internal/*` is excluded with `null`, and its longer prefix wins over `#/*`.
				{ code: 'import { a } from \'../../internal/secret\';', filename: formsInput },
				// A nested package.json without `imports` scopes the file out of the parent's mappings.
				{ code: 'import { a } from \'../../libs/helpers\';', filename: fixture('nested-package/src/components/input.ts') },
				// Without a real path there is no package.json to read.
				{ code: 'import { a } from \'../../libs/helpers\';' },
			],
			invalid: [
				{
					// A file outside the mapped folder can still reach into it.
					code: 'import { a } from \'../../src/libs/helpers\';',
					filename: fixture('tests/unit/input.test.ts'),
					output: 'import { a } from \'#/libs/helpers\';',
					errors: [{ messageId: 'deepRelative' }],
				},
			],
		});
	});

	it('prefers the shortest subpath that resolves to the same file', () => {
		ruleTester.run('no-deep-relative', rule, {
			valid: [],
			invalid: [
				{
					code: 'import config from \'../../config/index.js\';',
					filename: formsInput,
					output: 'import config from \'#config\';',
					errors: [{ messageId: 'deepRelative', data: { source: '../../config/index.js', replacement: '#config' } }],
				},
				{
					code: 'import lib from \'../../../vendor/lib.js\';',
					filename: formsInput,
					output: 'import lib from \'#vendor/lib.js\';',
					errors: [{ messageId: 'deepRelative' }],
				},
			],
		});
	});

	it('honors maxDepth', () => {
		ruleTester.run('no-deep-relative', rule, {
			valid: [
				{ code: 'import { a } from \'../../../libs/helpers\';', filename: fixture('src/components/forms/fields/input.ts'), options: [{ maxDepth: 3 }] },
			],
			invalid: [
				{
					code: 'import { a } from \'../helpers\';',
					filename: fixture('src/libs/forms/input.ts'),
					options: [{ maxDepth: 0 }],
					output: 'import { a } from \'#/libs/helpers\';',
					errors: [{ messageId: 'deepRelative', data: { source: '../helpers', replacement: '#/libs/helpers' } }],
				},
				{
					code: 'import { a } from \'../../../../libs/helpers\';',
					filename: fixture('src/components/forms/fields/text/input.ts'),
					options: [{ maxDepth: 3 }],
					output: 'import { a } from \'#/libs/helpers\';',
					errors: [{ messageId: 'deepRelative', data: { source: '../../../../libs/helpers', replacement: '#/libs/helpers' } }],
				},
			],
		});
	});

	it('uses the imports option in place of package.json', () => {
		ruleTester.run('no-deep-relative', rule, {
			valid: [
				// The option replaces the package.json mappings rather than merging with them.
				{ code: 'import config from \'../../config/index.js\';', filename: formsInput, options: [{ imports: { '@/*': './src/libs/*' } }] },
			],
			invalid: [
				{
					code: 'import { a } from \'../../libs/helpers\';',
					filename: formsInput,
					options: [{ imports: { '@/*': './src/*' } }],
					output: 'import { a } from \'@/libs/helpers\';',
					errors: [{ messageId: 'deepRelative', data: { source: '../../libs/helpers', replacement: '@/libs/helpers' } }],
				},
			],
		});
	});

	it('picks conditional targets by the configured conditions', () => {
		const conditional = { '#/*': { node: './server/*', default: './src/*' } };
		ruleTester.run('no-deep-relative', rule, {
			valid: [
				// The fixture's `#/*` only has an `import` condition.
				{ code: 'import { a } from \'../../libs/helpers\';', filename: formsInput, options: [{ conditions: ['require'] }] },
				// Node picks the first matching condition in object order, so `node` wins and `./src` is unmapped.
				{ code: 'import { a } from \'../../libs/helpers\';', filename: formsInput, options: [{ imports: conditional, conditions: ['node', 'default'] }] },
			],
			invalid: [
				{
					code: 'import { a } from \'../../libs/helpers\';',
					filename: formsInput,
					options: [{ imports: conditional }],
					output: 'import { a } from \'#/libs/helpers\';',
					errors: [{ messageId: 'deepRelative' }],
				},
				{
					code: 'import { a } from \'../../libs/helpers\';',
					filename: formsInput,
					options: [{ imports: { '#/*': [{ browser: './web/*' }, './src/*'] } }],
					output: 'import { a } from \'#/libs/helpers\';',
					errors: [{ messageId: 'deepRelative' }],
				},
			],
		});
	});

	it('rewrites type-only imports', () => {
		typescriptRuleTester.run('no-deep-relative', rule, {
			valid: [],
			invalid: [
				{
					code: 'import type { User } from \'../../types/user\';',
					filename: formsInput,
					output: 'import type { User } from \'#/types/user\';',
					errors: [{ messageId: 'deepRelative' }],
				},
				{
					code: 'export type { User } from \'../../types/user\';',
					filename: formsInput,
					output: 'export type { User } from \'#/types/user\';',
					errors: [{ messageId: 'deepRelative' }],
				},
			],
		});
	});

	it('checks Vue single-file component scripts', () => {
		vueRuleTester.run('no-deep-relative', rule, {
			valid: [],
			invalid: [
				{
					code: '<script setup lang="ts">\nimport { a } from \'../../libs/helpers\';\n</script>',
					filename: fixture('src/components/forms/input.vue'),
					output: '<script setup lang="ts">\nimport { a } from \'#/libs/helpers\';\n</script>',
					errors: [{ messageId: 'deepRelative' }],
				},
			],
		});
	});
});

describe('findSubpath', () => {
	it('declines a rewrite that a more specific key would resolve elsewhere', () => {
		const mappings = [
			{ key: '#/*', target: './src/*' },
			{ key: '#/libs/*', target: './vendor/*' },
		];

		expect(findSubpath('./src/libs/helpers', mappings)).toBeNull();
		expect(findSubpath('./vendor/helpers', mappings)).toBe('#/libs/helpers');
		expect(findSubpath('./src/stores/user', mappings)).toBe('#/stores/user');
	});

	it('requires pattern suffixes to match', () => {
		const mappings = [{ key: '#*.js', target: './src/*.js' }];

		expect(findSubpath('./src/libs/helpers.js', mappings)).toBe('#libs/helpers.js');
		expect(findSubpath('./src/libs/helpers', mappings)).toBeNull();
	});

	it('ignores targets that are not package-relative files', () => {
		const mappings = [
			{ key: '#dep', target: 'some-package' },
			{ key: '#/*', target: null },
		];

		expect(findSubpath('./src/libs/helpers', mappings)).toBeNull();
	});
});
