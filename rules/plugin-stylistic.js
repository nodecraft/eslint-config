'use strict';

module.exports = {
	rules: {
		// enforce line breaks after opening and before closing array brackets
		'@stylistic/array-bracket-newline': ['error', 'consistent'],

		// enforce consistent spacing inside array brackets
		'@stylistic/array-bracket-spacing': ['error', 'never'],

		// enforce line breaks after each array element
		'@stylistic/array-element-newline': ['error', 'consistent'],

		// require parentheses around arrow function arguments
		'@stylistic/arrow-parens': ['error', 'as-needed', {
			requireForBlockBody: true,
		}],

		// enforce consistent spacing before and after the arrow in arrow functions
		'@stylistic/arrow-spacing': ['error', { before: true, after: true }],

		// enforce spaces inside of blocks after opening block and before closing block
		'@stylistic/block-spacing': ['error', 'always'],

		// enforce consistent brace style for blocks
		'@stylistic/brace-style': ['error', '1tbs', {
			allowSingleLine: true,
		}],

		// require or disallow trailing commas
		'@stylistic/comma-dangle': ['error', 'always-multiline'],

		// enforce consistent spacing before and after commas
		'@stylistic/comma-spacing': ['error', {
			before: false,
			after: true,
		}],

		// enforce consistent comma style
		'@stylistic/comma-style': ['error', 'last'],

		// enforce consistent spacing inside computed property brackets
		'@stylistic/computed-property-spacing': ['error', 'never'],

		// eequire or disallow newline at the end of files
		'@stylistic/eol-last': ['error', 'always'],

		// require or disallow spacing between function identifiers and their invocations
		'@stylistic/function-call-spacing': 'error',

		// enforce line breaks between arguments of a function call
		'@stylistic/function-call-argument-newline': ['error', 'consistent'],

		// enforces consistent line breaks inside parentheses of function parameters or arguments
		'@stylistic/function-paren-newline': ['error', 'consistent'],

		// enforce spacing around the * of generator functions
		'@stylistic/generator-star-spacing': ['error', {
			before: true,
			after: false,
		}],

		// enforce the location of arrow function bodies
		'@stylistic/implicit-arrow-linebreak': ['error', 'beside'],

		// enforce consistent indentation
		'@stylistic/indent': ['error', 'tab', {
			SwitchCase: 1,
		}],

		// indentation for binary operators in multiline expressions. This is a supplement to the indent rule.
		'@stylistic/indent-binary-ops': ['error', 'tab'],

		// enforce consistent spacing between keys and values in object literal properties
		'@stylistic/key-spacing': ['error', {
			beforeColon: false,
			afterColon: true,
		}],

		// enforce consistent spacing before and after keywords
		'@stylistic/keyword-spacing': ['error', {
			before: true,
			after: true,
		}],

		// enforce consistent linebreak style
		'@stylistic/linebreak-style': ['error', 'unix'],

		// enforces a maximum number of statements allowed per line
		'@stylistic/max-statements-per-line': ['error', {
			max: 1,
			ignoredNodes: [
				'ContinueStatement',
				'BreakStatement',
				'ReturnStatement',
				'ThrowStatement',
			],
		}],

		// enforce semicolon member delimiters on typescript interfaces and types
		'@stylistic/member-delimiter-style': ['error', {
			multiline: {
				delimiter: 'semi',
				requireLast: true,
			},
			singleline: {
				delimiter: 'semi',
				requireLast: true,
			},
			multilineDetection: 'brackets',
		}],

		// enforce newlines for chained calls after a certain depth
		'@stylistic/newline-per-chained-call': ['error', {
			ignoreChainWithDepth: 3,
		}],

		// disallow arrow functions where they could be confused with comparisons
		'@stylistic/no-confusing-arrow': 'error',

		// disallow unnecessary duplicate semicolons
		'@stylistic/no-extra-semi': 'error',

		// disallow floating decimals
		'@stylistic/no-floating-decimal': 'error',

		// disallow mixed operators without parenthesis
		'@stylistic/no-mixed-operators': ['error'],

		// disallow mixed spaces and tabs for indentation
		'@stylistic/no-mixed-spaces-and-tabs': ['error'],

		// disallow multiple spaces
		'@stylistic/no-multi-spaces': 'error',

		// disallow multiple empty lines, especially at start and end of files
		'@stylistic/no-multiple-empty-lines': ['error', {
			max: 3,
			maxEOF: 1,
			maxBOF: 0,
		}],

		// disallow nested ternary expressions
		// handled by eslint-plugin-unicorn
		'@stylistic/no-nested-ternary': 'off',

		// disallow trailing whitespace at the end of lines
		'@stylistic/no-trailing-spaces': 'error',

		// enforce consistent spacing before object properties
		'@stylistic/no-whitespace-before-property': 'error',

		// enforce consistent spacing inside braces
		'@stylistic/object-curly-newline': ['error', {
			consistent: true,
		}],

		// enforce consistent spacing inside braces
		'@stylistic/object-curly-spacing': ['error', 'always'],

		'@stylistic/object-property-newline': ['error', {
			allowAllPropertiesOnSameLine: true,
		}],

		// require newlines around variable declarations
		'@stylistic/one-var-declaration-per-line': ['error', 'always'],

		// enforces consistent empty line padding within blocks
		'@stylistic/padded-blocks': ['error', 'never'],

		// enforce the consistent use of either backticks, double, or single quotes
		'@stylistic/quotes': ['error', 'single'],

		// enforce consistent quotes around object literal property names
		'@stylistic/quote-props': ['error', 'consistent-as-needed'],

		// enforce consistent spacing between rest and spread operators and their expressions
		'@stylistic/rest-spread-spacing': ['error', 'never'],

		// require or disallow semicolons instead of ASI
		'@stylistic/semi': ['error'],

		// enforce location of semicolons
		'@stylistic/semi-style': ['error', 'last'],

		// enforce consistent spacing before blocks
		'@stylistic/space-before-blocks': ['error', {
			functions: 'always',
			keywords: 'always',
			classes: 'always',
		}],

		// enforce consistent spacing before function definition opening parenthesis
		'@stylistic/space-before-function-paren': ['error', {
			anonymous: 'never',
			named: 'never',
			asyncArrow: 'always',
		}],

		// disallow or enforce spaces inside of parentheses
		'@stylistic/space-in-parens': ['error', 'never'],

		// require spacing around infix operators
		'@stylistic/space-infix-ops': ['error'],

		// enforce consistent spacing before or after unary operators
		'@stylistic/space-unary-ops': ['error', {
			words: true,
			nonwords: false,
			overrides: {
				typeof: false,
			},
		}],

		// enforce consistent spacing around switch/case colons
		'@stylistic/switch-colon-spacing': ['error', {
			after: true,
			before: false,
		}],

		// require or disallow spacing around embedded expressions of template strings
		'@stylistic/template-curly-spacing': ['error', 'never'],

		// enforce consistent spacing with template tags and their literals
		'@stylistic/template-tag-spacing': ['error', 'never'],

		// enforce specific spacing patterns around type annotations and function types in type literals
		'@stylistic/type-annotation-spacing': ['error', {
			before: false,
			after: true,
		}],

		// enforces consistent spacing inside TypeScript type generics.
		'@stylistic/type-generic-spacing': ['error'],

		// expect space before the type declaration in the named tuple.
		'@stylistic/type-named-tuple-spacing': ['error'],
	},
};
