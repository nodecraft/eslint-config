'use strict';

module.exports = {
	rules: {
		// Improve regexes by making them shorter, consistent, and safer
		"unicorn/better-regex": "error",

		// Enforce a specific parameter name in catch clauses
		"unicorn/catch-error-name": "off",

		// Use destructured variables over properties
		"unicorn/consistent-destructuring": "off",

		// Move function definitions to the highest possible scope
		"unicorn/consistent-function-scoping": "off",

		// Enforce correct Error subclassing
		"unicorn/custom-error-definition": "error",

		// Enforce no spaces between braces
		"unicorn/empty-brace-spaces": "error",

		// Enforce passing a message value when creating a built-in error
		"unicorn/error-message": "error",

		// Require escape sequences to use uppercase values
		"unicorn/escape-case": "error",

		// Add expiration conditions to TODO comments
		"unicorn/expiring-todo-comments": "off",

		// Enforce explicitly comparing the length property of a value
		"unicorn/explicit-length-check": "error",

		// Enforce a case style for filenames
		"unicorn/filename-case": "off",

		// Enforce importing index files with .
		"unicorn/import-index": "off",

		// Enforce specific import styles per module
		// TODO expand
		"unicorn/import-style": "error",

		// Enforce the use of new for all builtins, except String, Number, Boolean, Symbol and BigInt
		"unicorn/new-for-builtins": "error",

		// Enforce specifying rules to disable in eslint-disable comments
		"unicorn/no-abusive-eslint-disable": "error",

		// Prevent passing a function reference directly to iterator methods
		"unicorn/no-array-callback-reference": "warn",

		// Prefer for…of over Array#forEach(…)
		"unicorn/no-array-for-each": "warn",

		// Disallow using the this argument in array methods
		"unicorn/no-array-method-this-argument": "error",

		// Enforce combining multiple Array#push() into one call
		"unicorn/no-array-push-push": "off",

		// Disallow Array#reduce() and Array#reduceRight()
		"unicorn/no-array-reduce": "off",

		// Do not use leading/trailing space between console.log parameters
		"unicorn/no-console-spaces": "off",

		// Do not use document.cookie directly
		// TODO: enforce once Cookie Store API becomes more ubiquitous
		"unicorn/no-document-cookie": "off",

		// Do not use a for loop that can be replaced with a for-of loop
		"unicorn/no-for-loop": "error",

		// Enforce the use of Unicode escapes instead of hexadecimal escapes
		"unicorn/no-hex-escape": "error",

		// Require Array.isArray() instead of instanceof Array
		"unicorn/no-instanceof-array": "error",

		// Disallow identifiers starting with new or class
		"unicorn/no-keyword-prefix": "off",

		// Disallow if statements as the only statement in if blocks without else
		"unicorn/no-lonely-if": "error",

		// Disallow nested ternary expressions
		"unicorn/no-nested-ternary": "error",

		// Disallow new Array()
		"unicorn/no-new-array": "error",

		// Enforce the use of Buffer.from() and Buffer.alloc() instead of the deprecated new Buffer()
		"unicorn/no-new-buffer": "error",

		// Disallow the use of the null literal
		"unicorn/no-null": "off",

		// Disallow the use of objects as default parameters
		"unicorn/no-object-as-default-parameter": "error",

		// Disallow process.exit()
		// handled by eslint-plugin-node
		"unicorn/no-process-exit": "off",

		// Forbid classes that only have static members
		"unicorn/no-static-only-class": "error",

		// Disallow assigning this to a variable
		"unicorn/no-this-assignment": "warn",

		// Disallow unreadable array destructuring
		"unicorn/no-unreadable-array-destructuring": "error",

		// Disallow unsafe regular expressions
		"unicorn/no-unsafe-regex": "off",

		// Disallow unused object properties
		"unicorn/no-unused-properties": "off",

		// Disallow useless undefined
		"unicorn/no-useless-undefined": ["error", {
			checkArguments: false,
		}],

		// Disallow number literals with zero fractions or dangling dots
		"unicorn/no-zero-fractions": "error",

		// Enforce proper case for numeric literals
		"unicorn/number-literal-case": "error",

		// Enforce the style of numeric separators by correctly grouping digits
		"unicorn/numeric-separators-style": ["error", {
			"hexadecimal": {
				"minimumDigits": 0,
				"groupLength": 2,
			},
			"binary": {
				"minimumDigits": 0,
				"groupLength": 4,
			},
			"octal": {
				"minimumDigits": 0,
				"groupLength": 4,
			},
			"number": {
				"minimumDigits": 7,
				"groupLength": 3,
			},
		}],

		// Prefer .addEventListener() and .removeEventListener() over on-functions
		"unicorn/prefer-add-event-listener": "error",

		//  Prefer .find(…) over the first element from .filter(…)
		"unicorn/prefer-array-find": "error",

		// Prefer Array#flat() over legacy techniques to flatten arrays
		"unicorn/prefer-array-flat": "error",

		// Prefer .flatMap(…) over .map(…).flat()
		"unicorn/prefer-array-flat-map": "error",

		// Prefer Array#indexOf() over Array#findIndex() when looking for the index of an item
		"unicorn/prefer-array-index-of": "error",

		// Prefer .some(…) over .find(…)
		"unicorn/prefer-array-some": "error",

		// Prefer Date.now() to get the number of milliseconds since the Unix Epoch
		"unicorn/prefer-date-now": "error",

		// Prefer default parameters over reassignment
		"unicorn/prefer-default-parameters": "error",

		// Prefer Node#append() over Node#appendChild()
		"unicorn/prefer-dom-node-append": "error",

		// Prefer using .dataset on DOM elements over .setAttribute(…)
		"unicorn/prefer-dom-node-dataset": "error",

		// Prefer childNode.remove() over parentNode.removeChild(childNode)
		"unicorn/prefer-dom-node-remove": "error",

		// Prefer .textContent over .innerText
		"unicorn/prefer-dom-node-text-content": "error",

		// Prefer .includes() over .indexOf() when checking for existence or non-existence
		"unicorn/prefer-includes": "error",

		// Prefer KeyboardEvent#key over KeyboardEvent#keyCode
		"unicorn/prefer-keyboard-event-key": "error",

		// Enforce the use of Math.trunc instead of bitwise operators
		"unicorn/prefer-math-trunc": "error",

		// Prefer .before() over .insertBefore(), .replaceWith() over .replaceChild(), prefer one of .before(), .after(), .append() or .prepend() over insertAdjacentText() and insertAdjacentElement()
		"unicorn/prefer-modern-dom-apis": "error",

		// Prefer JavaScript modules (ESM) over CommonJS
		// TODO: enforce as we transition our codebase to ESM
		"unicorn/prefer-module": "off",

		// Prefer negative index over .length - index for {String,Array,TypedArray}#slice() and Array#splice()
		"unicorn/prefer-negative-index": "error",

		// Prefer using the node: protocol when importing Node.js builtin modules
		// TODO: enable for Node 16+
		"unicorn/prefer-node-protocol": "off",

		// Prefer Number static properties over global ones
		"unicorn/prefer-number-properties": "error",

		// Prefer omitting the catch binding parameter
		"unicorn/prefer-optional-catch-binding": "error",

		// Prefer borrowing methods from the prototype instead of methods from an instance
		"unicorn/prefer-prototype-methods": "off",

		// Prefer .querySelector() over .getElementById(), .querySelectorAll() over .getElementsByClassName() and .getElementsByTagName()
		"unicorn/prefer-query-selector": "error",

		// Prefer Reflect.apply() over Function#apply()
		"unicorn/prefer-reflect-apply": "error",

		// Prefer RegExp#test() over String#match() and RegExp#exec()
		"unicorn/prefer-regexp-test": "error",

		// Prefer Set#has() over Array#includes() when checking for existence or non-existence
		"unicorn/prefer-set-has": "error",

		// Prefer the spread operator over Array.from()
		"unicorn/prefer-spread": "error",

		// Prefer String#replaceAll() over regex searches with the global flag
		// TODO: enable for Node 15+
		"unicorn/prefer-string-replace-all": "off",

		// Prefer String#slice() over String#substr() and String#substring()
		"unicorn/prefer-string-slice": "error",

		// Prefer String#startsWith() & String#endsWith() over more complex alternatives
		"unicorn/prefer-string-starts-ends-with": "error",

		// Prefer String#trimStart() / String#trimEnd() over String#trimLeft() / String#trimRight()
		"unicorn/prefer-string-trim-start-end": "error",

		// Prefer switch over multiple else-if
		"unicorn/prefer-switch": "off",

		// Prefer ternary expressions over simple if-else statements
		"unicorn/prefer-ternary": "off",

		// Enforce throwing TypeError in type checking conditions
		"unicorn/prefer-type-error": "error",

		// Prevent abbreviations
		"unicorn/prevent-abbreviations": "off",

		// Enforce using the separator argument with Array#join()
		"unicorn/require-array-join-separator": "error",

		// Enforce using the digits argument with Number#toFixed()
		"unicorn/require-number-to-fixed-digits-argument": "error",

		// Enforce using the targetOrigin argument with window.postMessage()
		"unicorn/require-post-message-target-origin": "error",

		// Enforce better string content
		"unicorn/string-content": "off",

		// Require new when throwing an error
		"unicorn/throw-new-error": "error",
	},
};