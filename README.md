# @nodecraft/eslint-config
[![Actions Status](https://github.com/nodecraft/eslint-config/workflows/Test/badge.svg)](https://github.com/nodecraft/eslint-config/actions)

This package is modeled heavily off of [Airbnb's base config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base). A huge thanks to their team.

## Usage

We export our standard ESLint configuration.

Our default export contains all of our ESLint rules, including ECMAScript 6+. It requires `eslint`, `eslint-plugin-node`, `eslint-plugin-json` & `eslint-plugin-unicorn.

1. Install package:

```sh
npm install --save-dev @nodecraft/eslint-config
```

2. Add `"extends": "@nodecraft"` to your .eslintrc

### Vue.js

If your application uses Vue.js 3.x, also add `@nodecraft/eslint-config/vue3` to your `extends` array to inherit our Vue rules. If using Vue.js 2.x, add `@nodecraft/eslint-config/vue`.

Also add `@nodecraft/eslint-config/vue-a11y` for our Vue Accessibility rules (compatible with both Vue.js 3 and Vue.js 2.

Be sure to also install the following optional peer dependencies:

- `eslint-plugin-vue`
- `eslint-plugin-vue-a11y`

### TypeScript

If your application uses TypeScript, instead of extending `@nodecraft/eslint-config`, extend `@nodecraft/eslint-config/typescript`. Also ensure you install the following optional peer depenendies:

- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `typescript`