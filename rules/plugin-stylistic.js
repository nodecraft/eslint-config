'use strict';

module.exports = {
	rules: {
		// enforce line breaks after opening and before closing array brackets
		'@stylistic/array-bracket-newline': ['error', 'consistent'],

		// enforce consistent spacing inside array brackets
		'@stylistic/array-bracket-spacing': ['error', 'never'],

		// enforce line breaks after each array element
		'@stylistic/array-element-newline': ['error', 'consistent'],

		// enforce spaces inside of blocks after opening block and before closing block
		'@stylistic/block-spacing': ['error', 'always'],

		// enforce consistent brace style for blocks
		'@stylistic/brace-style': ['error', '1tbs', {
			'allowSingleLine': true,
		}],

		// require or disallow trailing commas
		'@stylistic/comma-dangle': ['error', 'always-multiline'],

		// enforce consistent spacing before and after commas
		'@stylistic/comma-spacing': ['error', {
			'before': false,
			'after': true,
		}],

		// enforce consistent comma style
		'@stylistic/comma-style': ['error', 'last'],

		// enforce consistent spacing inside computed property brackets
		'@stylistic/computed-property-spacing': ['error', 'never'],

		// eequire or disallow newline at the end of files
		'@stylistic/eol-last': ['error', 'always'],

		// require or disallow spacing between function identifiers and their invocations
		'@stylistic/func-call-spacing': 'error',

		// enforce the location of arrow function bodies
		'@stylistic/implicit-arrow-linebreak': ['error', 'beside'],

		// enforce consistent indentation
		'@stylistic/indent': ['error', 'tab', {
			'SwitchCase': 1,
		}],

		// enforce consistent spacing between keys and values in object literal properties
		'@stylistic/key-spacing': ['error', {
			'beforeColon': false,
			'afterColon': true,
		}],

		// enforce consistent spacing before and after keywords
		'@stylistic/keyword-spacing': ['error', {
			'before': true,
			'after': true,
		}],

		// enforce consistent linebreak style
		'@stylistic/linebreak-style': ['error', 'unix'],

		// disallow nested ternary expressions
		// handled by eslint-plugin-unicorn
		'@stylistic/no-nested-ternary': 'off',

		// disallow trailing whitespace at the end of lines
		'@stylistic/no-trailing-spaces': 'error',

		// enforce consistent spacing inside braces
		'@stylistic/object-curly-spacing': ['error', 'always'],

		// require newlines around variable declarations
		'@stylistic/one-var-declaration-per-line': ['error', 'always'],

		// enforce the consistent use of either backticks, double, or single quotes
		'@stylistic/quotes': ['error', 'single'],

		// require or disallow semicolons instead of ASI
		'@stylistic/semi': ['error'],

		// enforce location of semicolons
		'@stylistic/semi-style': ['error', 'last'],

		// enforce consistent spacing before blocks
		'@stylistic/space-before-blocks': ['error', {
			'functions': 'always',
			'keywords': 'always',
			'classes': 'always',
		}],

		// enforce consistent spacing before function definition opening parenthesis
		'@stylistic/space-before-function-paren': ['error', {
			'anonymous': 'never',
			'named': 'never',
			'asyncArrow': 'always',
		}],

		// disallow or enforce spaces inside of parentheses
		'@stylistic/space-in-parens': ['error', 'never'],

		// require spacing around infix operators
		'@stylistic/space-infix-ops': ['error'],

		// enforce consistent spacing before or after unary operators
		'@stylistic/space-unary-ops': ['error', {
			'words': true,
			'nonwords': false,
			'overrides': {
				'typeof': false,
			},
		}],
	},
};
