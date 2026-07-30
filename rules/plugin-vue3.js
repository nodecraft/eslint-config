export default {
	rules: {
		// Enforce consistent indentation in <template>
		'vue/html-indent': ['error', 'tab', {
			attribute: 1,
			baseIndent: 1,
			closeBracket: 0,
			alignAttributesVertically: false,
			ignores: [],
		}],

		// Enforce the maximum number of attributes per line
		'vue/max-attributes-per-line': ['error', {
			singleline: {
				max: 1,
			},
			multiline: {
				max: 1,
			},
		}],

		// Enforce v-bind directive style
		'vue/v-bind-style': ['error', 'longform'],

		// Enforce v-on directive style
		'vue/v-on-style': ['error', 'longform'],

		// enforce writing style for handlers in v-on directives
		// TODO in future
		//'vue/v-on-handler-style': ['error', ['method', 'inline-function']],

		// Discourage multi-statement template expressions, which hide logic in the template and are untestable
		// Each selector targets a distinct AST shape: statement lists, comma sequences, and inline functions
		'vue/no-restricted-syntax': [
			'warn',
			{
				selector: 'VOnExpression[body.length>1]',
				message: 'Avoid multiple statements in a v-on handler. Extract them into a single method.',
			},
			{
				selector: 'VOnExpression > ExpressionStatement > SequenceExpression',
				message: 'Avoid comma-separated expressions in a v-on handler. Extract them into a single method.',
			},
			{
				// VExpressionContainer keeps this scoped to the template, covering v-bind and interpolation too
				selector: 'VExpressionContainer ArrowFunctionExpression > BlockStatement[body.length>1]',
				message: 'Avoid multiple statements in an inline template function. Extract them into a single method.',
			},
		],

		// Enforce v-slot directive style
		'vue/v-slot-style': ['error', {
			atComponent: 'longform',
			default: 'longform',
			named: 'longform',
		}],

		// Disallow usage of button without an explicit type attribute
		'vue/html-button-has-type': ['error'],

		// Enforce self-closing style
		'vue/html-self-closing': ['error', {
			html: {
				void: 'never',
				normal: 'never',
				component: 'never',
			},
			svg: 'always',
			math: 'always',
		}],

		// Require a line break before and after the contents of a multiline element
		'vue/multiline-html-element-content-newline': 'error',

		// Disallow target="_blank" attribute without rel="noopener"
		'vue/no-template-target-blank': ['error', {
			allowReferrer: true,
			enforceDynamicLinks: 'always',
		}],

		// Disallow useless attribute on <template>
		'vue/no-useless-template-attributes': 'error',

		// Enforce specific casing for the name property in Vue components
		'vue/component-definition-name-casing': ['error', 'kebab-case'],

		// Enforce order of properties in components
		'vue/order-in-components': 'error',

		// Enforce valid nextTick function calls
		'vue/valid-next-tick': 'error',

		// Require component names to be always multi-word
		'vue/multi-word-component-names': 'off',

		// Disallow use of undefined components in <template>
		'vue/no-undef-components': 'warn',

		// enforce v-for directive's delimiter style
		'vue/v-for-delimiter-style': ['error', 'of'],

		// disallow use other than available lang
		'vue/block-lang': ['warn', {
			script: {
				lang: 'ts',
				allowNoLang: false,
			},
		}],

		// vue/component-api-style
		'vue/component-api-style': [
			'warn', ['script-setup', 'composition'],
		],

		// disallow unwrapping a `ref` where the binding then stops tracking updates
		'vue/no-ref-object-reactivity-loss': 'error',

		// disallow destructuring `props`, which snapshots the value and drops reactivity
		'vue/no-setup-props-reactivity-loss': 'error',

		// disallow `v-bind` with a constant value, which is just a static attribute
		'vue/no-useless-v-bind': 'error',

		// disallow mustache interpolation that only wraps a string literal
		'vue/no-useless-mustaches': 'error',

		// disallow template refs that are declared but never referenced
		'vue/no-unused-refs': 'error',

		// disallow empty `<template>`, `<script>` and `<style>` blocks
		'vue/no-empty-component-block': 'error',

		// require `inheritAttrs: false` when `$attrs` is bound explicitly, to avoid duplicate attributes
		'vue/no-duplicate-attr-inheritance': 'error',

		// prefer `useTemplateRef()` over a matching `ref()` binding
		// Warn-only: not auto-fixable, and every existing string-ref call site needs converting
		'vue/prefer-use-template-ref': 'warn',

		// require a type parameter on a `ref()` initialised without a value, which is otherwise `any`
		// Warn-only: not auto-fixable, and each site needs a hand-written type
		'vue/require-typed-ref': 'warn',
	},
};
