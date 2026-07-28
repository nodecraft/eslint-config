import { Linter } from 'eslint';
import pluginVue from 'eslint-plugin-vue';
import { describe, expect, it } from 'vitest';
import vueEslintParser from 'vue-eslint-parser';

import vue3Rules from '../../rules/plugin-vue3.js';

// Asserts the shipped config rather than a copy, so a bad edit to the selectors fails here.
const restrictedSyntax = vue3Rules.rules['vue/no-restricted-syntax'];

const linter = new Linter();

// Every snippet is linted against a <script setup> holding multi-statement functions, so the
// script-isolation guarantee that keeps the inline-function selector narrow is always exercised.
const SCRIPT = `
<script setup>
const format = (value) => {
	const parsed = Number(value);
	return parsed.toFixed(2);
};
function submit() {
	track('save');
	navigate();
}
</script>
`;

// `files` is required because flat config only applies to JS extensions by default.
const config = {
	files: ['**/*.vue'],
	plugins: { vue: pluginVue },
	languageOptions: {
		parser: vueEslintParser,
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: { 'vue/no-restricted-syntax': restrictedSyntax },
};

const lint = code => linter.verify(code, config, 'component.vue');

const messagesFor = (template) => {
	const results = lint(`<template>\n\t<div>\n\t\t${template}\n\t</div>\n</template>\n${SCRIPT}`);
	// A selector typo yields a parse/config failure rather than a miss, so surface it loudly.
	const fatal = results.find(result => result.fatal);
	if (fatal) {
		throw new Error(`unexpected fatal error: ${fatal.message}`);
	}
	return results;
};

// ── Rule wiring ──────────────────────────────────────────────────────────────

describe('vue/no-restricted-syntax wiring', () => {
	it('is enabled as a warning with three selectors', () => {
		const [severity, ...selectors] = restrictedSyntax;

		expect(severity).toBe('warn');
		expect(selectors).toHaveLength(3);
		for (const selector of selectors) {
			expect(selector.selector).toBeTypeOf('string');
			expect(selector.message).toBeTypeOf('string');
		}
	});

	it('reports at warning severity, never error', () => {
		const results = messagesFor('<button v-on:click="track(\'a\'); navigate($event)">x</button>');

		expect(results).toHaveLength(1);
		expect(results[0].severity).toBe(1);
	});
});

// ── Multi-statement v-on handlers ────────────────────────────────────────────

describe('multi-statement v-on handlers', () => {
	const cases = [
		['semicolon-separated calls', '<button v-on:click="track(\'secure-account\'); navigate($event);">x</button>'],
		['three statements', '<button v-on:click="a(); b(); c()">x</button>'],
		['assignment then call', '<button v-on:click="open = true; track(\'open\')">x</button>'],
		['handler with a modifier', '<form v-on:submit.prevent="validate(); send()">x</form>'],
		['custom component event', '<Child v-on:done="log(); close()" />'],
		['handler split across lines', '<button\n\t\t\tv-on:click="\n\t\t\t\ttrack(\'a\');\n\t\t\t\tnavigate($event);\n\t\t\t"\n\t\t>x</button>'],
	];

	it.each(cases)('flags %s', (_name, template) => {
		const results = messagesFor(template);

		expect(results).toHaveLength(1);
		expect(results[0].message).toContain('multiple statements in a v-on handler');
	});
});

// ── Comma-sequenced expressions ──────────────────────────────────────────────

describe('comma-sequenced v-on handlers', () => {
	const cases = [
		['two calls', '<button v-on:click="track(\'a\'), navigate($event)">x</button>'],
		['three calls', '<button v-on:click="a(), b(), c()">x</button>'],
	];

	it.each(cases)('flags %s', (_name, template) => {
		const results = messagesFor(template);

		expect(results).toHaveLength(1);
		expect(results[0].message).toContain('comma-separated expressions');
	});
});

// ── Multi-statement inline functions, anywhere in the template ───────────────

describe('multi-statement inline template functions', () => {
	const cases = [
		['inline v-on arrow', '<button v-on:click="() => { track(\'a\'); navigate(); }">x</button>'],
		['arrow passed via v-bind', '<Child v-bind:format="() => { const a = 1; return a; }" />'],
		['arrow in a slot prop', '<Child v-bind:row-class="(row) => { const base = \'r\'; return base + row.id; }" />'],
		['IIFE in interpolation', '<span>{{ (() => { const a = 1; return a; })() }}</span>'],
		['async inline arrow', '<button v-on:click="async () => { await save(); track(\'save\'); }">x</button>'],
	];

	it.each(cases)('flags %s', (_name, template) => {
		const results = messagesFor(template);

		expect(results).toHaveLength(1);
		expect(results[0].message).toContain('inline template function');
	});
});

// ── Idiomatic single-statement handlers stay allowed ─────────────────────────

describe('allowed handlers', () => {
	const cases = [
		['bare method reference', '<button v-on:click="save">x</button>'],
		['call without arguments', '<button v-on:click="save()">x</button>'],
		['call with arguments', '<button v-on:click="pick(item.id)">x</button>'],
		['call forwarding $event', '<button v-on:click="navigate($event)">x</button>'],
		['toggle assignment', '<button v-on:click="isOpen = !isOpen">x</button>'],
		['single statement with trailing semicolon', '<button v-on:click="save();">x</button>'],
		['optional call', '<button v-on:click="onClose?.()">x</button>'],
		['single-expression arrow', '<button v-on:click="() => pick(item.id)">x</button>'],
		['single-statement arrow block', '<button v-on:click="() => { pick(item.id); }">x</button>'],
		['single-statement arrow via v-bind', '<Child v-bind:format="(value) => { return value * 2; }" />'],
		['ternary interpolation', '<span>{{ isOpen ? \'open\' : \'closed\' }}</span>'],
		['handler inside v-for', '<li v-for="id in ids" v-bind:key="id" v-on:click="pick(id)">x</li>'],
	];

	it.each(cases)('allows %s', (_name, template) => {
		expect(messagesFor(template)).toHaveLength(0);
	});
});

// ── Script isolation ─────────────────────────────────────────────────────────

describe('script isolation', () => {
	// The inline-function selector matches any multi-statement arrow body, so it would flood every
	// component if the rule ever visited <script>. This pins the template-only behavior.
	it('ignores multi-statement functions in <script setup>', () => {
		expect(messagesFor('<button v-on:click="submit">x</button>')).toHaveLength(0);
	});

	it('ignores multi-statement functions in a plain <script>', () => {
		const results = lint('<template>\n\t<button v-on:click="submit">x</button>\n</template>\n<script>\nexport default {\n\tmethods: {\n\t\tsubmit() {\n\t\t\tthis.track(\'save\');\n\t\t\tthis.navigate();\n\t\t},\n\t},\n};\n</script>\n');

		expect(results).toHaveLength(0);
	});
});
