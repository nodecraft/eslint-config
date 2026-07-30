import { ESLint, RuleTester } from 'eslint';
import { describe, expect, it } from 'vitest';
import vueEslintParser from 'vue-eslint-parser';

import vue3Config from '../../configs/vue3.js';
import plugin from '../../plugins/vue.js';
import vue3Rules from '../../rules/plugin-nodecraft-vue.js';

const rule = plugin.rules['no-constant-computed'];

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
});

// Real components declare computeds inside <script setup>, so cover that path too.
const vueRuleTester = new RuleTester({
	languageOptions: {
		parser: vueEslintParser,
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
});

describe('no-constant-computed', () => {
	it('flags getters with no reactive dependencies', () => {
		ruleTester.run('no-constant-computed', rule, {
			valid: [
				// Reads a ref, a store, a prop, or a global
				'const label = computed(() => version.value ? "Change" : "Install");',
				// eslint-disable-next-line no-template-curly-in-string -- the placeholder belongs to the linted snippet
				'const label = computed(() => `v${version.value}`);',
				'const label = computed(() => store.instance.name);',
				'const label = computed(() => props.label ?? "Install");',
				'const now = computed(() => Date.now());',
				'const classes = computed(() => ({ active: isOpen.value }));',
				'const classes = computed(() => [props.class]);',
				// Nested functions still leak their references to the getter's scope
				'const total = computed(() => items.value.map(item => item.size).reduce((a, b) => a + b, 0));',
				'const total = computed(() => { function sum() { return items.value.length; } return sum(); });',
				// A constant standing in for a ref that may come from elsewhere, however it is wrapped
				'const status = store?.status?.(scope.value) ?? computed(() => "idle");',
				'const status = store ? store.status(scope.value) : computed(() => "idle");',
				'const status = store?.status?.(scope.value) ?? computed?.(() => "idle");',
				// Handed to an API that unwraps it, so the ref shape is load-bearing
				'provide(TableContext, computed(() => "idle"));',
				'useFloating(anchor, floating, { middleware: computed(() => []) });',
				'watch(computed(() => "idle"), () => {});',
				'function useThing() { return { label: computed(() => "Static") }; }',
				// Read as a ref by other modules
				'export const label = computed(() => "Static");',
				'state.label = computed(() => "Static");',
				// Some other `computed`, not the one Vue exports
				'import { computed } from "knockout";\nconst label = computed(() => "static");',
				'function computed(fn) { return fn(); }\nconst label = computed(() => "static");',
				// Not a getter we can analyse
				'const label = computed(getLabel);',
				'const label = computed({ get: () => "static", set: () => {} });',
				'const label = computed();',
				// Unrelated `computed` callee
				'const label = obj.computed(() => "static");',
				// `this` is not a tracked reference, so we cannot prove independence
				'const label = computed(function() { return this.label; });',
				'const label = computed(function() { return this.$route.name; });',
				'const label = computed(() => this.label);',
			],
			invalid: [
				{
					code: 'const installLabel = computed(() => "Change Version");',
					errors: [{ messageId: 'constantComputed' }],
				},
				{
					// Resolving the callee must not lose the ordinary imported case
					code: 'import { computed } from "vue";\nconst installLabel = computed(() => "Change Version");',
					errors: [{ messageId: 'constantComputed' }],
				},
				{
					code: 'import { computed } from "@vue/reactivity";\nconst installLabel = computed(() => "Change Version");',
					errors: [{ messageId: 'constantComputed' }],
				},
				{
					code: 'const installLabel = computed(() => { return "Change Version"; });',
					errors: [{ messageId: 'constantComputed' }],
				},
				{
					code: 'const installLabel = computed(function() { return "Change Version"; });',
					errors: [{ messageId: 'constantComputed' }],
				},
				{
					code: 'const backups = computed(() => 0);',
					errors: [{ messageId: 'constantComputed' }],
				},
				{
					code: 'const selected = computed(() => null);',
					errors: [{ messageId: 'constantComputed' }],
				},
				{
					code: 'const label = computed(() => `Change Version`);',
					errors: [{ messageId: 'constantComputed' }],
				},
				{
					// A non-empty literal array is still one frozen value
					code: 'const inputClasses = computed(() => ["block w-full rounded-md"]);',
					errors: [{ messageId: 'constantComputed' }],
				},
				{
					code: 'const route = computed(() => ({ name: "oneClickInstallerFile" }));',
					errors: [{ messageId: 'constantComputed' }],
				},
				{
					code: 'const empty = computed(() => []);',
					errors: [{ messageId: 'constantComputed' }],
				},
				{
					// Locals declared inside the getter do not escape it
					code: 'const label = computed(() => { const parts = ["Change", "Version"]; return parts.join(" "); });',
					errors: [{ messageId: 'constantComputed' }],
				},
			],
		});
	});

	it('flags getters inside <script setup>', () => {
		vueRuleTester.run('no-constant-computed', rule, {
			valid: [
				{
					filename: 'component.vue',
					code: '<script setup>\nimport { computed } from "vue";\nconst label = computed(() => props.label);\n</script>',
				},
			],
			invalid: [
				{
					filename: 'component.vue',
					code: '<script setup>\nimport { computed } from "vue";\nconst label = computed(() => "Change Version");\n</script>',
					errors: [{ messageId: 'constantComputed' }],
				},
			],
		});
	});
});

describe('plugin shape', () => {
	it('exposes named plugin meta', () => {
		expect(plugin.meta.name).toBe('eslint-plugin-nodecraft-vue');
		expect(plugin.meta.version).toBeTypeOf('string');
	});

	it('never offers a fix, since the value would lose its ref shape', () => {
		expect(rule.meta.fixable).toBeUndefined();
		expect(rule.meta.hasSuggestions).toBeUndefined();
	});
});

// A namespace that drifts from the rule prefix throws for every consumer, so lint through the
// shipped config rather than asserting the two files agree.
describe('configs.vue3 wiring', () => {
	it('enables the rule as a warning', () => {
		expect(vue3Rules.rules['nodecraft-vue/no-constant-computed']).toBe('warn');
	});

	it('resolves the rule in a .vue file', async () => {
		const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: vue3Config });
		const [result] = await eslint.lintText(
			'<template><div>{{ label }}</div></template>\n<script setup>\nimport { computed } from "vue";\nconst label = computed(() => "Change Version");\n</script>\n',
			{ filePath: 'component.vue' },
		);

		// An unresolved rule id surfaces as a fatal config error, not a missed report.
		expect(result.messages.filter(message => message.fatal)).toHaveLength(0);
		expect(result.messages).toEqual(expect.arrayContaining([
			expect.objectContaining({ ruleId: 'nodecraft-vue/no-constant-computed', severity: 1 }),
		]));
	});
});
