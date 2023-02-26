'use strict';

module.exports = {
	rules: {
		// Enforce consistent indentation in <template>
		'vue/html-indent': ['error', 'tab', {
			'attribute': 1,
			'baseIndent': 1,
			'closeBracket': 0,
			'alignAttributesVertically': false,
			'ignores': [],
		}],

		// Enforce the maximum number of attributes per line
		'vue/max-attributes-per-line': 'off',

		// Enforce v-bind directive style
		'vue/v-bind-style': ['error', 'longform'],

		// Enforce v-on directive style
		'vue/v-on-style': ['error', 'longform'],

		// Enforce v-slot directive style
		'vue/v-slot-style': ['error', {
			'atComponent': 'longform',
			'default': 'longform',
			'named': 'longform',
		}],

		// Disallow usage of button without an explicit type attribute
		'vue/html-button-has-type': ['error'],

		// Enforce self-closing style
		'vue/html-self-closing': ['error', {
			'html': {
				'void': 'never',
				'normal': 'never',
				'component': 'never',
			},
			'svg': 'always',
			'math': 'always',
		}],

		// Require a line break before and after the contents of a multiline element
		'vue/multiline-html-element-content-newline': 'error',

		// Disallow target="_blank" attribute without rel="noopener"
		'vue/no-template-target-blank': ['error', {
			'allowReferrer': true,
			'enforceDynamicLinks': 'always',
		}],

		// Enforce specific casing for the name property in Vue components
		'vue/component-definition-name-casing': ['error', 'kebab-case'],

		// Enforce order of properties in components
		'vue/order-in-components': 'error',

		// Enforce valid nextTick function calls
		'vue/valid-next-tick': 'error',
	},
};
