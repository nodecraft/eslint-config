# @nodecraft/eslint-config
[![Actions Status](https://github.com/nodecraft/eslint-config/workflows/Test/badge.svg)](https://github.com/nodecraft/eslint-config/actions)
## Usage

We export our standard ESLint configuration for use in all Nodecraft projects.

For ESLint v10, use version >47.0.0 of this package. For ESLint v8, use version 47.0.0. `eslint-plugin-unicorn` v72 requires at least ESLint v10.4.

Our default export contains all of our ESLint rules, including ECMAScript 6+. It requires `eslint`, `eslint-plugin-unicorn`, `eslint-plugin-regexp`, `@stylistic/eslint-plugin` and `eslint-plugin-import-x`.

The base config sets `import-x/resolver-next` to import-x's built-in node resolver, which keeps `import-x/order` fast. `resolver-next` takes precedence over the legacy `import-x/resolver` setting, so to use a different resolver (such as `eslint-import-resolver-typescript`), set `import-x/resolver-next` in your own config.

`import-x/order` sorts internal imports into their own group between packages and relative imports. Subpath imports (`#/...`) always count as internal through `import-x/internal-regex`, even when only a bundler can resolve them.

1. Install package:

```sh
npm install --save-dev @nodecraft/eslint-config
```

2.

```js
// eslint.config.js
import nodecraftEslint from '@nodecraft/eslint-config';

export default [
	...nodecraftEslint.configs.base,
];
```

### JSON

To lint JSON files, extend `configs.json`. This uses `@eslint/json` with support for JSON with comments (JSONC).

Since the base config's JS rules don't have `files` restrictions, they will cascade onto JSON files and cause errors. You need to scope the base configs to ignore JSON files:

```js
// eslint.config.js
import nodecraftEslint from '@nodecraft/eslint-config';

const jsonIgnore = ['**/*.json'];

export default [
	...nodecraftEslint.configs.base.map(config => ({ ...config, ignores: jsonIgnore })),
	...nodecraftEslint.configs.json,
];
```

### Node.js

If your application runs in Node.js, also extend `configs.node`. Be sure to also install the following optional peer dependencies:
- `eslint-plugin-node`

```js
// eslint.config.js
import nodecraftEslint from '@nodecraft/eslint-config';
export default [
	...nodecraftEslint.configs.base,
	...nodecraftEslint.configs.node,
];
```

### Vue.js

If your application uses Vue.js 3.x, also extend `configs.vue3` in your eslint config. Vue.js 2.x is no longer supported.

Also then extend `configs["vue-a11y"]` for our Vue Accessibility rules.

Be sure to also install the following optional peer dependencies:

- `eslint-plugin-vue`
- `eslint-plugin-vue-a11y`
- `vue-eslint-parser`

### TypeScript

If your application uses TypeScript, instead of extending `configs.base`, extend `configs.typescript`. Also ensure you install the following optional peer depenendies:

- `typescript`
- `typescript-eslint`

## Plugins

### `async-callback`

We ship a standalone ESLint plugin that ensures callbacks are always invoked in [`async`](https://www.npmjs.com/package/async) library task functions (e.g. `series`, `parallel`, `each`, `mapValues`, `auto`). It is included automatically in `configs.node`, but you can also import the plugin directly without our config:

```js
// eslint.config.js
import asyncCallback from '@nodecraft/eslint-config/plugins/async-callback';

export default [
	{
		plugins: {
			'async-callback': asyncCallback,
		},
		rules: {
			'async-callback/no-missing-callback': 'error',
		},
	},
];
```

### `spawnpoint-codes`

We ship a standalone ESLint plugin that validates [`spawnpoint`](https://github.com/nodecraft/spawnpoint) codes. It flags string-literal codes passed to `app.code()`, `app.errorCode()`, `app.failCode()` (and the `spawnpoint-express` `res.success()` / `res.fail()` helpers) that aren't defined anywhere — catching typos that would otherwise fail silently at runtime.

Valid codes are discovered automatically from:

- your app's `config/codes/**/*.json`
- the installed `spawnpoint` package's built-in codes
- any installed `spawnpoint-*` plugin's shipped codes (e.g. `spawnpoint-express`)

The rule treats spawnpoint as the source of truth rather than re-implementing its loader. If no codes are discovered (e.g. a non-spawnpoint project), the rule does nothing. It is not enabled by any of our configs — import the plugin directly to opt in:

```js
// eslint.config.js
import spawnpointCodes from '@nodecraft/eslint-config/plugins/spawnpoint-codes';

export default [
	{
		plugins: {
			'spawnpoint': spawnpointCodes,
		},
		rules: {
			'spawnpoint/no-unknown-code': 'error',
		},
	},
];
```

#### Options

| Option | Default | Description |
| --- | --- | --- |
| `receivers` | `['app', 'res']` | Identifier names whose method calls are checked. |
| `methods` | `['code', 'errorCode', 'failCode', 'success', 'fail']` | Method names that take a code as their first argument. |
| `codePaths` | `['config/codes/**/*.json']` | Globs (relative to the project root) for your application codes. |
| `packages` | `[]` | Extra packages to resolve codes from, on top of `spawnpoint` and auto-discovered `spawnpoint-*` plugins. |
| `additionalCodes` | `[]` | Extra code strings to treat as valid. |

### `subpath-imports`

We ship a standalone ESLint plugin that rewrites relative imports climbing several directories into [subpath imports](https://nodejs.org/api/packages.html#subpath-imports) from your `package.json`. With `"imports": { "#/*": "./assets/*" }`, this:

```js
import { formatBytes } from '../../../libs/helpers';
```

is reported and autofixed to:

```js
import { formatBytes } from '#/libs/helpers';
```

Mappings are read from the `imports` field of the nearest `package.json`, so a project without one is left alone. A rewrite is only offered when the new specifier resolves to the same file under Node's resolution rules, so a more specific key or a `null` exclusion is never sidestepped. Static imports, re-exports, and dynamic `import()` calls with a string literal are checked. Loader syntax (`!`) is skipped and query strings (`?raw`) are kept.

It is not enabled by any of our configs. Whether a subpath import resolves for a given file depends on how that file runs (a bundler alias, TypeScript `paths`, or Node itself), which only the project knows. Scope it to the files that can use the mapping:

```js
// eslint.config.js
import subpathImports from '@nodecraft/eslint-config/plugins/subpath-imports';

export default [
	{
		files: ['assets/**', 'tests/**'],
		plugins: {
			'subpath-imports': subpathImports,
		},
		rules: {
			'subpath-imports/no-deep-relative': 'error',
		},
	},
];
```

Enabling it on an existing codebase rewrites every deep import on the first `eslint --fix`, and `import-x/order` moves them into the internal group in the same run. The rule costs about 0.4% of total rule time on a frontend with roughly 1,000 files.

#### Options

| Option | Default | Description |
| --- | --- | --- |
| `maxDepth` | `1` | How many directories a relative import may climb before it is reported. `0` reports any `../`. |
| `imports` | `package.json` `imports` | A mapping in the same shape as the `imports` field, used instead of the one in `package.json`. Targets are relative to the nearest `package.json`, so this is where aliases only a bundler or `tsconfig.json` knows about (like `@/*`) go. |
| `conditions` | `['import', 'default']` | Conditions used to pick a target from conditional mappings, in Node's first-match order. |

### `nodecraft-vue`

Our own Vue rules, for things `eslint-plugin-vue` doesn't cover. Included automatically in `configs.vue3`, but you can also import the plugin directly:

```js
// eslint.config.js
import nodecraftVue from '@nodecraft/eslint-config/plugins/vue';

export default [
	{
		plugins: {
			'nodecraft-vue': nodecraftVue,
		},
		rules: {
			'nodecraft-vue/no-constant-computed': 'warn',
			'nodecraft-vue/no-deprecated-props': 'warn',
		},
	},
];
```

#### `no-constant-computed`

Flags `computed()` getters that read nothing outside their own body, so the value can never change:

```js
const installLabel = computed(() => 'Change Version'); // reported
const inputClasses = computed(() => ['block w-full rounded-md']); // reported
```

Both should be plain values. The rule reports rather than fixes, because unwrapping a `computed` changes its type and every `.value` read along with it.

Only a local `const` is reported, since that is the one case where every reader lives in the same file and the swap is safe to make. A constant getter is left alone wherever its ref shape is load-bearing:

```js
const status = store?.status?.(scope.value) ?? computed(() => 'idle'); // stands in for a ref
provide(TableContext, computed(() => 'idle')); // consumers read `.value`
export const label = computed(() => 'Static'); // other modules read `.value`
```

A getter that reads any outer identifier is left alone too, even a constant one — so `computed(() => LABELS.title)` and `computed(() => Math.PI)` pass. Proving those never change means following the identifier, which the rule deliberately doesn't do.

Also ignored: getters using `this`, the writable `computed({ get, set })` form, and any `computed` that isn't Vue's — the callee has to resolve to an import from `vue` (or `@vue/*`), or to nothing at all, which is what auto-import setups look like.

#### `no-deprecated-props`

Flags template props that the imported component marks `@deprecated`, reading the tag from the component's own declarations. Nothing about any component library lives in the config:

```ts
// acme-ui, AcmeButton.vue
defineProps({
	variant: { type: String, default: 'primary' },
	/** @deprecated Use `variant` instead. */
	theme: { type: String, default: undefined },
});
```

```vue
<script setup>
import { AcmeButton } from 'acme-ui';
</script>
<template>
	<!-- reported: `theme` is deprecated on `<AcmeButton>`. Use `variant` instead. -->
	<AcmeButton theme="danger"></AcmeButton>
</template>
```

The import is resolved with TypeScript's module resolution, plus `#` subpath imports, and followed through re-exports to the component. For a built package that is its `.vue.d.ts`, where every `@deprecated` member is read. For a local `.vue` file only the `defineProps` (or `props:`) declaration is read. Static attributes, `v-bind:` and `:` are all checked, as are kebab-case tags and props.

Not covered: components registered globally or through a `components:` option, and props spread with `v-bind="object"`. The rule needs `typescript` installed and stays silent without it. Lookups are cached for 30 seconds, so edits in a long editor session are picked up without a restart.

### antislop

Our base config includes a plugin for the patterns that read as filler: shapes that technically work but cost the next reader more than they should. Each rule lives in its own file under `plugins/antislop/`.

The rules are enabled from `configs.base`, so they apply to TypeScript projects too. The two type rules key off TypeScript-only syntax and stay silent under a plain JavaScript parser.

| Rule | Reports |
| --- | --- |
| `antislop/no-multiline-conditional-spread` | A conditional spread that wraps, or holds more than a line's worth of content, inside an array or object literal. |
| `antislop/no-chained-type-assertions` | Assertion chains such as `value as unknown as User`. |
| `antislop/no-object-parameters` | A function parameter typed as the broad `object`, directly or through a same-file type alias. |
| `antislop/no-reduce-accumulator-copy` | A reducer that copies its accumulator on every iteration, such as `[...acc, item]`. |

All four are errors. A warning in a codebase this size is a line nobody reads, and each of these patterns is one that should have to justify itself. Where the pattern is genuinely the right answer — a third-party type gap the compiler can't be talked out of, say — an `eslint-disable-next-line` with a reason says so permanently, which is more use to the next reader than a warning that scrolls past.

Both type rules are off in conventional test and spec paths, where partial test doubles routinely need a deliberate widening step to stand in for a real value.

#### `no-multiline-conditional-spread`

A conditional spread has to earn its place in a literal. Kept to one line it reads as one more entry, and the literal still describes its own contents:

```js
const args = [command, ...(verbose ? ['--verbose'] : [])];
const flags = [
	process.execPath,
	cli,
	...(version ? ['--version', version] : ['--assets', assetsDir]),
	...(cacheDir ? ['--cache-dir', cacheDir] : []),
];
```

Once it wraps, the ternary stops being an entry and becomes structure. The reader now has to unpack a conditional to learn what the collection holds, and the branch is usually a block that wanted a name of its own:

```js
const columns = [
	nameColumn,
	sizeColumn,
	...(canEdit // warns: wraps across 8 lines
		? [{
			id: 'actions',
			label: 'Actions',
			align: 'right' as const,
			width: 'auto' as const,
			sortable: false,
		}]
		: []),
];
```

There are two fixes, and which one applies depends on why it wrapped. A branch that wrapped only because it is long collapses back to a single line. A branch that holds a block gets named, and the literal gets built up with statements:

```js
const actionsColumn: TableColumn = {
	id: 'actions',
	label: 'Actions',
	align: 'right',
	width: 'auto',
	sortable: false,
};

const columns = [nameColumn, sizeColumn];
if (canEdit) {
	columns.push(actionsColumn);
}
```

Naming the branch usually pays for itself twice: the annotation on `actionsColumn` does the work both `as const` assertions were there for.

Only spreads sitting directly in an array or object literal are considered, so a wrapped ternary is left alone anywhere else — including `const columns = canEdit ? [...base, actionsColumn] : base;`, which never spreads a conditional into a literal at all.

#### The one-line escape hatch

A line count on its own is dodgeable: join the lines back up and the warning goes away, however much the branch holds. So the rule also puts a `maxLength` budget on the branch, measured after collapsing it to a single line. Reformatting can't shrink that number, so there is nothing to game:

```js
// Warns: 105 characters, however it is laid out
const columns = [nameColumn, ...(canEdit ? [{ id: 'actions', label: 'Actions', align: 'right', sortable: false, width: 'auto' }] : [])];
```

The default of 100 leaves the real short form comfortably clear — the longest legitimate one-line conditional spread we measured across our own frontends was 82 characters. Both budgets are adjustable:

```js
rules: {
	'antislop/no-multiline-conditional-spread': ['warn', { maxLines: 3, maxLength: 120 }],
},
```

#### `no-chained-type-assertions`

A chain like `value as unknown as User` launders an unrelated type into the one the call site wanted, and the compiler stops being able to help. Validate an untrusted value at its boundary, or keep its precise type through the code that consumes it.

#### `no-object-parameters`

`object` says only that the value isn't a primitive, so the signature tells a caller nothing about what it should pass. Describe the properties the function actually reads.

Hiding it behind a name doesn't help, so the rule follows type aliases declared in the same file, including generic ones: `type Options = object` and `Maybe<object>` (with `type Maybe<T> = T | null`) are both reported. Imported types aren't followed.

#### `no-reduce-accumulator-copy`

Copying the accumulator inside a reducer copies everything gathered so far, once per item, so the reduce goes quadratic as the input grows:

```js
items.reduce((acc, item) => [...acc, item], []);
items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
items.reduce((acc, item) => Object.assign({}, acc, item), {});
items.reduce((acc, item) => acc.concat([item]), []);
```

Mutate the accumulator the reducer already owns and return it, or use a loop:

```js
items.reduce((acc, item) => {
	acc[item.id] = item;
	return acc;
}, {});
```

Copying the current item (`{ ...item }`) is fine, since it doesn't grow. Array copy methods such as `concat` and `slice` are only reported when the initial value is an array literal, so string building with `concat` passes. The rule only looks at a callback passed straight to `reduce` or `reduceRight`, and doesn't follow named callbacks or helper functions. Unlike the type rules, it stays on in test files.

The plugin can also be imported directly, without our config:

```js
// eslint.config.js
import antislop from '@nodecraft/eslint-config/plugins/antislop';

export default [
	{
		plugins: {
			antislop,
		},
		rules: {
			'antislop/no-multiline-conditional-spread': 'warn',
		},
	},
];
```
