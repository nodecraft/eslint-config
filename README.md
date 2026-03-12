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
