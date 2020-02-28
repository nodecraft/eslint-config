# eslint-config-nodecraft
[![Actions Status](https://github.com/nodecraft/eslint-config-nodecraft/workflows/Test/badge.svg)](https://github.com/nodecraft/eslint-config-nodecraft/actions)

This package is modeled heavily off of [Airbnb's base config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base). A huge thanks to their team.

## Usage

We export our standard ESLint configuration.

Our default export contains all of our ESLint rules, including ECMAScript 6+. It requires `eslint`, `eslint-plugin-node`, `eslint-plugin-json` & eslint-plugin-vue.

1. Install the correct versions of each package, which are listed by the command:

```sh
npm info "eslint-config-nodecraft@latest" peerDependencies
```

Linux/OSX users can simply run
```sh
(
export PKG=eslint-config-nodecraft;
npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@latest"
)
```

Which produces and runs a command like:

```sh
npm install --save-dev eslint-config-nodecraft eslint@^#.#.# eslint-plugin-node@^#.#.# eslint-plugin-json@^#.#.#
```

Windows users can either install all the peer dependencies manually, or use the [install-peerdeps](https://github.com/nathanhleung/install-peerdeps) cli tool.

```sh
npm install -g install-peerdeps
install-peerdeps --dev eslint-config-nodecraft
```

The cli will produce and run a command like:

```sh
npm install --save-dev eslint-config-nodecraft eslint@^#.#.# eslint-plugin-node@^#.#.# eslint-plugin-json@^#.#.#
```

2. Add `"extends": "nodecraft"` to your .eslintrc