import {
	mkdirSync,
	mkdtempSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { ESLint, Linter, RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	it,
	vi,
} from 'vitest';
import vueEslintParser from 'vue-eslint-parser';

import vue3Config from '../../configs/vue3.js';
import plugin from '../../plugins/vue.js';
import vue3Rules from '../../rules/plugin-nodecraft-vue.js';

const rule = plugin.rules['no-deprecated-props'];

// node_modules is gitignored, so the fixture app and its "published" UI package are written out per run.
const files = {
	'package.json': JSON.stringify({ name: 'fixture-app', imports: { '#/*': './src/*' } }),
	// A local source component, reached through a `#/` barrel.
	'src/components/UserAvatar/UserAvatar.vue': `<template><div></div></template>
<script setup lang="ts">
const legacy = {
	/** @deprecated Not a prop, so never reported. */
	label: 'x',
};
defineProps({
	/** @deprecated Use \`shape\` instead. */
	rounded: { type: Boolean, default: false },
	shape: { type: String, default: 'circle' },
	/** @deprecated Use \`status\` instead. */
	'badge-color': String,
	config: {
		type: Object as PropType<{
			/** @deprecated Nested in a prop's type, so never reported. */
			shape?: string;
		}>,
	},
});
</script>
`,
	'src/components/UserAvatar/index.ts': 'import component from \'./UserAvatar.vue\';\nexport default component;\n',
	'src/components/Plain.vue': '<template><div></div></template>\n<script setup>\ndefineProps({ rounded: Boolean });\n</script>\n',
	'src/components/SearchInput.vue': `<template><div></div></template>
<script setup lang="ts">
interface BaseProps {
	/** @deprecated Use \`size\` instead. */
	dense?: boolean;
}
interface Props extends BaseProps {
	/** @deprecated Use \`v-model:query\` instead. */
	modelValue?: string;
	query?: string;
	/** @deprecated Use \`query\` instead. */
	term?: string;
}
defineProps<Props>();
</script>
`,
	// A built package: entry barrel, `export *` noise, and a component declaration emitted by vue-tsc.
	'node_modules/acme-ui/package.json': JSON.stringify({
		name: 'acme-ui',
		exports: { '.': { types: './dist/index.d.ts', import: './dist/index.js' } },
	}),
	'node_modules/acme-ui/dist/index.js': '',
	'node_modules/acme-ui/dist/index.d.ts': 'export * from \'./types\';\nexport { default as AcmeButton } from \'./components/AcmeButton\';\nexport { default as AcmeCard } from \'./components/AcmeCard.vue\';\n',
	'node_modules/acme-ui/dist/types.d.ts': 'export type Other = { /** @deprecated unrelated */ old: string };\n',
	'node_modules/acme-ui/dist/components/AcmeButton/index.d.ts': 'import { default as component } from \'./AcmeButton.vue\';\nexport default component;\nexport * from \'./AcmeButton.vue\';\n',
	'node_modules/acme-ui/dist/components/AcmeButton/AcmeButton.vue.d.ts': `declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    variant: { type: StringConstructor; default: string };
    /** @deprecated Use \`variant\` instead. */
    theme: { type: StringConstructor; default: undefined };
    iconPosition: { type: StringConstructor; default: string };
    /** @deprecated Use \`variant="outline"\` instead. */
    'outlined': { type: BooleanConstructor; default: boolean };
}>>;
export default _default;
export interface ButtonTheme {
    /** @deprecated Not a prop, so never reported. */
    variant?: string;
}
`,
	// vue-tsc emits type-declared props as a named alias passed to \`DefineComponent\`.
	'node_modules/acme-ui/dist/components/AcmeCard.vue.d.ts': `type __VLS_Props = {
    /** @deprecated Use \`elevation\` instead. */
    raised?: boolean;
    elevation?: number;
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>>;
declare const _default: typeof __VLS_export;
export default _default;
`,
};

let root;
let filename;

beforeAll(() => {
	root = mkdtempSync(path.join(tmpdir(), 'no-deprecated-props-'));
	for (const [file, content] of Object.entries(files)) {
		const target = path.join(root, file);
		mkdirSync(path.dirname(target), { recursive: true });
		writeFileSync(target, content);
	}
	filename = path.join(root, 'src/pages/Page.vue');
});

afterAll(() => {
	rmSync(root, { recursive: true, force: true });
});

const ruleTester = new RuleTester({
	languageOptions: {
		parser: vueEslintParser,
		parserOptions: { parser: tseslint.parser },
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
});

const page = (imports, template) => `<template>\n\t${template}\n</template>\n<script setup>\n${imports}\n</script>\n`;
const fromPackage = 'import { AcmeButton } from \'acme-ui\';';
const fromSource = 'import UserAvatar from \'#/components/UserAvatar\';';
const fromTyped = 'import SearchInput from \'#/components/SearchInput.vue\';';
const fromCard = 'import { AcmeCard } from \'acme-ui\';';

describe('no-deprecated-props', () => {
	it('reads @deprecated from imported component declarations', () => {
		ruleTester.run('no-deprecated-props', rule, {
			valid: [
				{ code: page(fromPackage, '<AcmeButton variant="primary" icon-position="end"></AcmeButton>'), filename },
				{ code: page(fromSource, '<UserAvatar shape="square"></UserAvatar>'), filename },
				// Deprecated members outside the props declaration don't count
				{ code: page(fromSource, '<UserAvatar label="x"></UserAvatar>'), filename },
				{ code: page(fromPackage, '<AcmeButton old="x"></AcmeButton>'), filename },
				// Deprecated fields nested in a prop's type, or in another exported type, aren't props
				{ code: page(fromSource, '<UserAvatar shape="square" :config="{}"></UserAvatar>'), filename },
				{ code: page(fromPackage, '<AcmeButton variant="primary"></AcmeButton>'), filename },
				{ code: page(fromTyped, '<SearchInput v-model:query="q"></SearchInput>'), filename },
				{ code: page(fromCard, '<AcmeCard :elevation="2"></AcmeCard>'), filename },
				// No @deprecated in the component at all
				{ code: page('import Plain from \'../components/Plain.vue\';', '<Plain rounded></Plain>'), filename },
				// Unresolvable imports and unimported tags are skipped
				{ code: page('import Missing from \'not-installed\';', '<Missing theme="x"></Missing>'), filename },
				{ code: page('', '<AcmeButton theme="x"></AcmeButton>'), filename },
				// A native tag never resolves to a same-named import
				{ code: page('import Button from \'#/components/UserAvatar\';', '<button rounded></button>'), filename },
				// Type-only imports are never template components
				{ code: page('import type { AcmeButton } from \'acme-ui\';', '<AcmeButton theme="x"></AcmeButton>'), filename },
			],
			invalid: [
				{
					code: page(fromPackage, '<AcmeButton theme="danger"></AcmeButton>'),
					filename,
					errors: [{ message: '`theme` is deprecated on `<AcmeButton>`. Use `variant` instead.' }],
				},
				{
					code: page(fromPackage, '<AcmeButton v-bind:theme="tone" :outlined="isGhost"></AcmeButton>'),
					filename,
					errors: [{ messageId: 'deprecatedProp' }, { message: '`outlined` is deprecated on `<AcmeButton>`. Use `variant="outline"` instead.' }],
				},
				{
					// Kebab-case tags resolve to their PascalCase binding, as the SFC compiler does
					code: page(fromSource, '<user-avatar rounded></user-avatar>'),
					filename,
					errors: [{ messageId: 'deprecatedProp' }],
				},
				{
					code: page(fromSource, '<UserAvatar v-bind:rounded="true"></UserAvatar>'),
					filename,
					errors: [{ message: '`rounded` is deprecated on `<UserAvatar>`. Use `shape` instead.' }],
				},
				{
					// A prop declared with a kebab key matches either spelling
					code: page(fromSource, '<UserAvatar badge-color="red" :badgeColor="tone"></UserAvatar>'),
					filename,
					errors: [{ messageId: 'deprecatedProp' }, { messageId: 'deprecatedProp' }],
				},
				{
					// `defineProps<Props>()` resolves a same-file interface, including what it extends
					code: page(fromTyped, '<SearchInput term="x" dense></SearchInput>'),
					filename,
					errors: [{ message: '`term` is deprecated on `<SearchInput>`. Use `query` instead.' }, { messageId: 'deprecatedProp' }],
				},
				{
					code: page(fromTyped, '<SearchInput v-model="q" v-model:term="t"></SearchInput>'),
					filename,
					errors: [{ message: '`modelValue` is deprecated on `<SearchInput>`. Use `v-model:query` instead.' }, { messageId: 'deprecatedProp' }],
				},
				{
					code: page(fromCard, '<AcmeCard raised></AcmeCard>'),
					filename,
					errors: [{ message: '`raised` is deprecated on `<AcmeCard>`. Use `elevation` instead.' }],
				},
			],
		});
	});
});

describe('cache expiry', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('picks up a component created after a failed lookup', () => {
		const linter = new Linter({ cwd: root });
		const config = [{
			files: ['**/*.vue'],
			languageOptions: { parser: vueEslintParser, parserOptions: { parser: tseslint.parser } },
			plugins: { vue: plugin },
			rules: { 'vue/no-deprecated-props': 'warn' },
		}];
		const code = page('import Late from \'#/Late\';', '<Late rounded></Late>');

		expect(linter.verify(code, config, filename)).toEqual([]);

		writeFileSync(path.join(root, 'src/Late.vue'), files['src/components/UserAvatar/UserAvatar.vue']);
		mkdirSync(path.join(root, 'src/Late'));
		writeFileSync(path.join(root, 'src/Late/index.ts'), 'export { default } from \'../Late.vue\';\n');
		const now = Date.now();
		vi.spyOn(Date, 'now').mockReturnValue(now + 60000);

		expect(linter.verify(code, config, filename)).toEqual([
			expect.objectContaining({ message: '`rounded` is deprecated on `<Late>`. Use `shape` instead.' }),
		]);
	});
});

describe('configs.vue3 wiring', () => {
	it('enables the rule as a warning', () => {
		expect(vue3Rules.rules['nodecraft-vue/no-deprecated-props']).toBe('warn');
	});

	it('reports through the shipped config', async () => {
		const eslint = new ESLint({ cwd: root, overrideConfigFile: true, overrideConfig: vue3Config });
		const [result] = await eslint.lintText(page(fromPackage, '<AcmeButton theme="danger"></AcmeButton>'), { filePath: filename });

		expect(result.messages.filter(message => message.fatal)).toHaveLength(0);
		expect(result.messages).toEqual(expect.arrayContaining([
			expect.objectContaining({ ruleId: 'nodecraft-vue/no-deprecated-props', severity: 1 }),
		]));
	});
});
