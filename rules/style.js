'use strict';


module.exports = {
	rules: {
		// enforce line breaks after opening and before closing array brackets
		'array-bracket-newline': ['error', 'consistent'],

		// enforce consistent spacing inside array brackets
		'array-bracket-spacing': ['error', 'never'],

		// enforce line breaks after each array element
		'array-element-newline': ['error', 'consistent'],

		// enforce spaces inside of blocks after opening block and before closing block
		'block-spacing': ['error', 'always'],

		// enforce consistent brace style for blocks
		'brace-style': ['error', '1tbs', {
			'allowSingleLine': true,
		}],

		// require or disallow trailing commas
		'comma-dangle': ['error', 'always-multiline'],

		// enforce consistent spacing before and after commas
		'comma-spacing': ['error', {
			'before': false,
			'after': true,
		}],

		// enforce consistent comma style
		'comma-style': ['error', 'last'],

		// enforce consistent spacing inside computed property brackets
		'computed-property-spacing': ['error', 'never'],

		// eequire or disallow newline at the end of files
		'eol-last': ['error', 'always'],

		// require or disallow spacing between function identifiers and their invocations
		'func-call-spacing': 'error',

		// enforce minimum and maximum identifier lengths
		'id-length': ['error', {
			'min': 2, // prevent 1 character variables,
			'exceptions': [
				'i', // allow i for iterators
				'x', // allow for coordinates
				'y', // allow for coordinates
				'_', // allow _ for lodash (TODO: remove when enforcing unicorn/import-style for lodash)
			],
			'properties': 'never',
		}],

		// enforce the location of arrow function bodies
		'implicit-arrow-linebreak': ['error', 'beside'],

		// enforce consistent indentation
		'indent': ['error', 'tab', {
			'SwitchCase': 1,
		}],

		// enforce consistent spacing between keys and values in object literal properties
		'key-spacing': ['error', {
			'beforeColon': false,
			'afterColon': true,
		}],

		// enforce consistent spacing before and after keywords
		'keyword-spacing': ['error', {
			'before': false,
			'after': false,
			'overrides': {
				'var': {
					'before': false,
					'after': true,
				},
				'let': {
					'before': false,
					'after': true,
				},
				'const': {
					'before': false,
					'after': true,
				},
				'return': {
					'before': false,
					'after': true,
				},
				'case': {
					'before': false,
					'after': true,
				},
				'from': {
					'before': true,
					'after': true,
				},
				'import': {
					'before': false,
					'after': true,
				},
				'as': {
					'before': true,
					'after': true,
				},
				'of': {
					'before': true,
					'after': true,
				},
				'in': {
					'before': true,
					'after': true,
				},
				'default': {
					'before': true,
					'after': true,
				},
				'class': {
					'before': true,
					'after': true,
				},
				'extends': {
					'before': true,
					'after': true,
				},
				'export': {
					'before': false,
					'after': true,
				},
				'catch': {
					'before': false,
					'after': false,
				},
				'this': {
					'before': true,
					'after': false,
				},
			},
		}],

		// enforce consistent linebreak style
		'linebreak-style': ['error', 'unix'],

		// disallow `if` statements as the only statement in `else` blocks
		'no-lonely-if': ['error'],

		// disallow nested ternary expressions
		// handled by eslint-plugin-unicorn
		'no-nested-ternary': 'off',

		// disallow trailing whitespace at the end of lines
		'no-trailing-spaces': 'error',

		// disallow ternary operators when simpler alternatives exist
		'no-unneeded-ternary': ['error'],

		// enforce consistent spacing inside braces
		'object-curly-spacing': ['error', 'never'],

		// enforce variables to be declared separately
		'one-var': ['error', {
			'var': 'never',
			'let': 'never',
			'const': 'never',
			'separateRequires': true,
		}],

		// require newlines around variable declarations
		'one-var-declaration-per-line': ['error', 'always'],

		// disallow the use of `Math.pow` in favor of the `**` operator
		'prefer-exponentiation-operator': ['error'],

		// enforce the consistent use of either backticks, double, or single quotes
		'quotes': ['error', 'single'],

		// require or disallow semicolons instead of ASI
		'semi': ['error'],

		// enforce location of semicolons
		'semi-style': ['error', 'last'],

		// enforce consistent spacing before blocks
		'space-before-blocks': ['error', {
			'functions': 'always',
			'keywords': 'always',
			'classes': 'always',
		}],

		// enforce consistent spacing before function definition opening parenthesis
		'space-before-function-paren': ['error', {
			'anonymous': 'never',
			'named': 'never',
			'asyncArrow': 'always',
		}],

		// disallow or enforce spaces inside of parentheses
		'space-in-parens': ['error', 'never'],

		// require spacing around infix operators
		'space-infix-ops': ['error'],

		// enforce consistent spacing before or after unary operators
		'space-unary-ops': ['error', {
			'words': true,
			'nonwords': false,
			'overrides': {
				'typeof': false,
			},
		}],
	},
};
