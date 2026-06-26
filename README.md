# @nodecraft/eslint-config
[![Actions Status](https://github.com/nodecraft/eslint-config/workflows/Test/badge.svg)](https://github.com/nodecraft/eslint-config/actions)
## Usage

We export our standard ESLint configuration for use in all Nodecraft projects.

For ESLint v10, use version >47.0.0 of this package. For ESLint v8, use version 47.0.0.

Our default export contains all of our ESLint rules, including ECMAScript 6+. It requires `eslint`, `eslint-plugin-unicorn`, `@stylistic/eslint-plugin` and `eslint-plugin-import-x`.

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
