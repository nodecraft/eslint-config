# @nodecraft/eslint-config
[![Actions Status](https://github.com/nodecraft/eslint-config/workflows/Test/badge.svg)](https://github.com/nodecraft/eslint-config/actions)

This package is modeled heavily off of [Airbnb's base config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base). A huge thanks to their team.

## Usage

We export our standard ESLint configuration.

Our default export contains all of our ESLint rules, including ECMAScript 6+. It requires `eslint`, `eslint-plugin-node`, `eslint-plugin-unicorn`, `@stylistic/eslint-plugin` and `eslint-plugin-import`.

1. Install package:

```sh
npm install --save-dev @nodecraft/eslint-config
```

2. ```js
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
