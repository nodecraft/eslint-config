export default {
	rules: {
		// Prefer better DOM traversal APIs
		'unicorn/better-dom-traversing': 'error',

		// Enforce a specific parameter name in catch clauses
		'unicorn/catch-error-name': 'off',

		// Enforce consistent class references in static methods
		'unicorn/class-reference-in-static-methods': 'error',

		// Enforce better comment content
		// Re-cases tokens inside every comment, which is churn with no correctness value
		'unicorn/comment-content': 'off',

		// Enforce consistent assertion style with `node:assert`
		'unicorn/consistent-assert': 'error',

		// Enforce consistent naming for boolean names
		// Mandates is/has/should prefixes, and we do not enforce naming conventions
		'unicorn/consistent-boolean-name': 'off',

		// Enforce consistent class member order
		'unicorn/consistent-class-member-order': 'error',

		// Enforce consistent spelling of compound words in identifiers
		// Naming mandate that trips over game and product terms
		'unicorn/consistent-compound-words': 'off',

		// Enforce consistent conditional object spread style
		// Picking between `&&` and ternary spreads is a style call, not a correctness one
		'unicorn/consistent-conditional-object-spread': 'warn',

		// Prefer passing `Date` directly to the constructor when cloning
		'unicorn/consistent-date-clone': 'error',

		// Use destructured variables over properties
		'unicorn/consistent-destructuring': 'off',

		// Prefer consistent types when spreading a ternary in an array literal.
		'unicorn/consistent-empty-array-spread': 'error',

		// Enforce consistent style for element existence checks with `indexOf()`, `lastIndexOf()`, `findIndex()`, and `findLastIndex()`
		'unicorn/consistent-existence-index-check': 'error',

		// Enforce consistent decorator position on exported classes
		'unicorn/consistent-export-decorator-position': 'error',

		// Move function definitions to the highest possible scope
		'unicorn/consistent-function-scoping': 'off',

		// Enforce function syntax by role
		// Every option defaults to ignore, so this does nothing until we pick a house style
		'unicorn/consistent-function-style': 'off',

		// Enforce consistent JSON file reads before `JSON.parse()`
		'unicorn/consistent-json-file-read': 'warn',

		// Enforce consistent optional chaining for same-base member access
		'unicorn/consistent-optional-chaining': 'error',

		// Enforce consistent style for escaping `${` in template literals
		'unicorn/consistent-template-literal-escape': 'error',

		// Enforce consistent labels on tuple type elements
		'unicorn/consistent-tuple-labels': 'error',

		// Enforce correct Error subclassing
		'unicorn/custom-error-definition': 'error',

		// Enforce consistent default export declarations
		'unicorn/default-export-style': 'error',

		// Enforce consistent style for DOM element dataset access
		'unicorn/dom-node-dataset': 'error',

		// Enforce no spaces between braces
		'unicorn/empty-brace-spaces': 'error',

		// Enforce passing a message value when creating a built-in error
		'unicorn/error-message': 'error',

		// Require escape sequences to use uppercase values
		'unicorn/escape-case': 'error',

		// Add expiration conditions to TODO comments
		'unicorn/expiring-todo-comments': 'off',

		// Enforce explicitly comparing the length property of a value
		'unicorn/explicit-length-check': 'error',

		// Enforce or disallow explicit `delay` argument for `setTimeout()` and `setInterval()`
		'unicorn/explicit-timer-delay': 'error',

		// Enforce a case style for filenames
		'unicorn/filename-case': 'off',

		// Require identifiers to match a specified regular expression
		// No-op without a project specific pattern
		'unicorn/id-match': 'off',

		// Enforce specific import styles per module
		// TODO expand
		'unicorn/import-style': 'error',

		// Prevent usage of variables from outside the scope of isolated functions
		'unicorn/isolated-functions': 'error',

		// Require or disallow logical assignment operator shorthand
		'unicorn/logical-assignment-operators': 'error',

		// Limit the depth of nested calls
		// Arbitrary depth limit rather than a correctness signal
		'unicorn/max-nested-calls': 'off',

		// Enforce replacements for variable, property, and filenames
		// Renamed from prevent-abbreviations, which we have always left off
		'unicorn/name-replacements': 'off',

		// Enforce the use of new for all builtins, except String, Number, Boolean, Symbol and BigInt
		'unicorn/new-for-builtins': 'error',

		// Enforce specifying rules to disable in eslint-disable comments
		'unicorn/no-abusive-eslint-disable': 'error',

		// Disallow recursive access to `this` within getters and setters
		'unicorn/no-accessor-recursion': 'error',

		// Disallow bitwise operators where a logical operator was likely intended
		'unicorn/no-accidental-bitwise-operator': 'error',

		// Disallow anonymous functions and classes as the default export
		// module.exports = function(app) {…} is our standard module shape
		'unicorn/no-anonymous-default-export': 'off',

		// Prevent passing a function reference directly to iterator methods
		'unicorn/no-array-callback-reference': 'warn',

		// Disallow array accumulation with `Array#concat()` in loops
		'unicorn/no-array-concat-in-loop': 'error',

		// Disallow using reference values as `Array#fill()` values
		'unicorn/no-array-fill-with-reference-type': 'error',

		// Disallow `.fill()` after `Array.from({length: …})`
		'unicorn/no-array-from-fill': 'error',

		// Disallow front-of-array mutation
		// shift() and unshift() are legitimate queue operations
		'unicorn/no-array-front-mutation': 'off',

		// Disallow using the this argument in array methods
		'unicorn/no-array-method-this-argument': 'error',

		// Disallow Array#reduce() and Array#reduceRight()
		'unicorn/no-array-reduce': 'off',

		// Prefer `Array#toReversed()` over `Array#reverse()`
		'unicorn/no-array-reverse': 'error',

		// Prefer `Array#toSorted()` over `Array#sort()`
		'unicorn/no-array-sort': 'error',

		// Disallow sorting arrays to get the minimum or maximum value
		'unicorn/no-array-sort-for-min-max': 'error',

		// Prefer `Array#toSpliced()` over `Array#splice()`
		'unicorn/no-array-splice': 'error',

		// Disallow asterisk prefixes in documentation comments
		// Conflicts with standard JSDoc formatting
		'unicorn/no-asterisk-prefix-in-documentation-comments': 'off',

		// Disallow async functions as `Promise#finally()` callbacks
		'unicorn/no-async-promise-finally': 'error',

		// Forbid member access from await expression
		'unicorn/no-await-expression-member': 'error',

		// Disallow using `await` in `Promise` method parameters
		'unicorn/no-await-in-promise-methods': 'error',

		// Disallow unnecessary `Blob` to `File` conversion
		'unicorn/no-blob-to-file': 'error',

		// Disallow boolean-returning sort comparators
		'unicorn/no-boolean-sort-comparator': 'error',

		// Disallow `break` and `continue` in nested loops and switches inside loops
		// Forces extracting nested loops into their own functions
		'unicorn/no-break-in-nested-loop': 'off',

		// Prefer drawing canvases directly instead of converting them to images
		'unicorn/no-canvas-to-image': 'error',

		// Disallow chained comparisons such as `a < b < c`
		'unicorn/no-chained-comparison': 'error',

		// Disallow accessing `Map`, `Set`, `WeakMap`, and `WeakSet` entries with bracket notation
		'unicorn/no-collection-bracket-access': 'error',

		// Disallow dynamic object property existence checks
		// Also flags plain truthiness checks on a computed key
		'unicorn/no-computed-property-existence-check': 'off',

		// Disallow confusing uses of `Array#{splice,toSpliced}()`
		'unicorn/no-confusing-array-splice': 'error',

		// Disallow confusing uses of `Array#with()`
		'unicorn/no-confusing-array-with': 'error',

		// Do not use leading/trailing space between console.log parameters
		'unicorn/no-console-spaces': 'off',

		// Disallow arithmetic and bitwise operations that always evaluate to `0`
		'unicorn/no-constant-zero-expression': 'error',

		// Disallow declarations before conditional early exits when they are only used after the exit
		// Reported without a fix or suggestion, so every hit is a manual reorder for position alone
		'unicorn/no-declarations-before-early-exit': 'warn',

		// Do not use document.cookie directly
		// TODO: enforce once Cookie Store API becomes more ubiquitous
		'unicorn/no-document-cookie': 'off',

		// Disallow two comparisons of the same operands that can be combined into one
		'unicorn/no-double-comparison': 'error',

		// Disallow duplicate adjacent branches in if chains
		'unicorn/no-duplicate-if-branches': 'error',

		// Disallow adjacent duplicate operands in logical expressions
		'unicorn/no-duplicate-logical-operands': 'error',

		// Disallow `.map()` and `.filter()` in `for…of` and `for await…of` loop headers
		'unicorn/no-duplicate-loops': 'error',

		// Disallow duplicate values in `Set` constructor array literals
		'unicorn/no-duplicate-set-values': 'error',

		// Disallow empty files
		'unicorn/no-empty-file': 'off',

		// Disallow assigning to built-in error properties
		'unicorn/no-error-property-assignment': 'error',

		// Disallow exports in scripts
		'unicorn/no-exports-in-scripts': 'error',

		// Prefer for…of over the forEach method
		'unicorn/no-for-each': 'warn',

		// Do not use a for loop that can be replaced with a for-of loop
		'unicorn/no-for-loop': 'error',

		// Disallow assigning properties on the global object
		// Third-party SDKs still hand us global callbacks to register
		'unicorn/no-global-object-property-assignment': 'warn',

		// Disallow immediate mutation after variable assignment
		// The suggested rewrite is not always possible around reactive objects
		'unicorn/no-immediate-mutation': 'warn',

		// Disallow impossible comparisons against `.length` or `.size`
		'unicorn/no-impossible-length-comparison': 'error',

		// Disallow incorrect `querySelector()` and `querySelectorAll()` usage
		'unicorn/no-incorrect-query-selector': 'error',

		// Disallow incorrect template literal interpolation syntax
		// Vue slot props inside a template literal look like the typo it hunts for
		'unicorn/no-incorrect-template-string-interpolation': 'warn',

		// Disallow instanceof for builtins like Array, Error, etc.
		'unicorn/no-instanceof-builtins': 'error',

		// Disallow calling functions and constructors with an invalid number of arguments
		'unicorn/no-invalid-argument-count': 'error',

		// Disallow comparing a single character from a string to a multi-character string
		'unicorn/no-invalid-character-comparison': 'error',

		// Disallow invalid options in `fetch()` and `new Request()`
		'unicorn/no-invalid-fetch-options': 'error',

		// Disallow invalid `accept` values on file inputs
		// Not in unicorn's recommended config
		'unicorn/no-invalid-file-input-accept': 'off',

		// Prevent calling EventTarget#removeEventListener() with the result of an expression
		'unicorn/no-invalid-remove-event-listener': 'error',

		// Disallow invalid implementations of well-known symbol methods
		'unicorn/no-invalid-well-known-symbol-methods': 'error',

		// Disallow identifiers starting with new or class
		'unicorn/no-keyword-prefix': 'off',

		// Disallow accessing `event.currentTarget` after the synchronous event dispatch has finished
		'unicorn/no-late-current-target-access': 'error',

		// Disallow event-control method calls after the synchronous event dispatch has finished
		'unicorn/no-late-event-control': 'error',

		// Disallow if statements as the only statement in if blocks without else
		'unicorn/no-lonely-if': 'error',

		// Disallow mutating a loop iterable during iteration
		'unicorn/no-loop-iterable-mutation': 'error',

		// Disallow a magic number as the `depth` argument in `Array#flat(…).`
		'unicorn/no-magic-array-flat-depth': 'error',

		// Disallow manually wrapped comments
		// Collapses a wrapped comment onto one long line
		'unicorn/no-manually-wrapped-comments': 'off',

		// Disallow checking a Map key before accessing a different key
		'unicorn/no-mismatched-map-key': 'error',

		// Disallow misrefactored compound assignments where the target is duplicated in the right-hand side
		'unicorn/no-misrefactored-assignment': 'error',

		// Disallow references to missing local resources
		// Cannot see bundler aliases, so it reports valid references
		'unicorn/no-missing-local-resource': 'off',

		// Disallow calling Promise executor resolver functions more than once on the same execution path
		'unicorn/no-multiple-promise-resolver-calls': 'error',

		// Disallow named usage of default import and export
		'unicorn/no-named-default': 'error',

		// Disallow negated array predicate calls
		// !array.some(…) reads better than every() with a negated predicate
		'unicorn/no-negated-array-predicate': 'off',

		// Disallow negated comparisons
		'unicorn/no-negated-comparison': 'error',

		// Disallow negated conditions
		'unicorn/no-negated-condition': 'off',

		// Disallow negated expression in equality check
		'unicorn/no-negation-in-equality-check': 'error',

		// Disallow nested ternary expressions
		'unicorn/no-nested-ternary': 'error',

		// Disallow new Array()
		'unicorn/no-new-array': 'error',

		// Enforce the use of Buffer.from() and Buffer.alloc() instead of the deprecated new Buffer()
		'unicorn/no-new-buffer': 'error',

		// Disallow non-function values with function-style verb prefixes
		'unicorn/no-non-function-verb-prefix': 'error',

		// Disallow non-standard properties on built-in objects
		'unicorn/no-nonstandard-builtin-properties': 'error',

		// Disallow the use of the null literal
		'unicorn/no-null': 'off',

		// Disallow the use of objects as default parameters
		'unicorn/no-object-as-default-parameter': 'error',

		// Disallow `Object` methods with `Map` or `Set`
		'unicorn/no-object-methods-with-collections': 'error',

		// Disallow optional chaining on undeclared variables
		'unicorn/no-optional-chaining-on-undeclared-variable': 'error',

		// Disallow process.exit()
		// handled by eslint-plugin-node
		'unicorn/no-process-exit': 'off',

		// Disallow comparisons made redundant by an equality check in the same logical AND
		'unicorn/no-redundant-comparison': 'error',

		// Disallow using the return value of `Array#push()` and `Array#unshift()`
		'unicorn/no-return-array-push': 'error',

		// Disallow selector syntax in DOM names
		'unicorn/no-selector-as-dom-name': 'error',

		// Disallow shorthand properties that override related longhand properties
		'unicorn/no-shorthand-property-overrides': 'error',

		// Disallow passing single-element arrays to `Promise` methods
		'unicorn/no-single-promise-in-promise-methods': 'error',

		// Forbid classes that only have static members
		'unicorn/no-static-only-class': 'error',

		// Prefer comparing values directly over subtracting and comparing to `0`
		'unicorn/no-subtraction-comparison': 'error',

		// Disallow then property
		'unicorn/no-thenable': 'error',

		// Disallow assigning this to a variable
		'unicorn/no-this-assignment': 'warn',

		// Disallow `this` outside of classes
		// Callers bind this throughout our callback code and Vue Options API components
		'unicorn/no-this-outside-of-class': 'off',

		// Disallow assigning to top-level variables from inside functions
		// Module-scoped mutable state is intentional in our services
		'unicorn/no-top-level-assignment-in-function': 'off',

		// Disallow top-level side effects in exported modules
		// Entrypoints exist to have side effects
		'unicorn/no-top-level-side-effects': 'off',

		// Disallow `all` as a transition property
		'unicorn/no-transition-all': 'error',

		// Disallow comparing undefined using typeof
		'unicorn/no-typeof-undefined': 'error',

		// Disallow referencing methods without calling them
		'unicorn/no-uncalled-method': 'error',

		// Require class members to be declared
		'unicorn/no-undeclared-class-members': 'error',

		// Disallow using `1` as the `depth` argument of `Array#flat()`
		'unicorn/no-unnecessary-array-flat-depth': 'error',

		// Disallow `Array#flatMap()` callbacks that only wrap a single item
		'unicorn/no-unnecessary-array-flat-map': 'error',

		// Disallow using `.length` or `Infinity` as the `deleteCount` or `skipCount` argument of `Array#{splice,toSpliced}()`
		'unicorn/no-unnecessary-array-splice-count': 'error',

		// Disallow awaiting non-promise values
		'unicorn/no-unnecessary-await': 'warn',

		// Disallow unnecessary comparisons against boolean literals
		'unicorn/no-unnecessary-boolean-comparison': 'error',

		// Disallow unnecessary options in `fetch()` and `new Request()`
		'unicorn/no-unnecessary-fetch-options': 'error',

		// Disallow unnecessary `globalThis` references
		// Bare localStorage throws during SSR where globalThis.localStorage is merely undefined
		'unicorn/no-unnecessary-global-this': 'off',

		// Disallow unnecessary nested ternary expressions
		'unicorn/no-unnecessary-nested-ternary': 'error',

		// Enforce the use of built-in methods instead of unnecessary polyfills
		'unicorn/no-unnecessary-polyfills': 'error',

		// Disallow using `.length` or `Infinity` as the `end` argument of `{Array,String,TypedArray}#slice()`
		'unicorn/no-unnecessary-slice-end': 'error',

		// Disallow `Array#splice()` when simpler alternatives exist
		'unicorn/no-unnecessary-splice': 'error',

		// Disallow `String#trim()` before `String#startsWith()` or `String#endsWith()`
		'unicorn/no-unnecessary-string-trim': 'error',

		// Disallow unreadable array destructuring
		'unicorn/no-unreadable-array-destructuring': 'error',

		// Disallow unreadable iterable expressions in `for…of` and `for await…of` loop headers
		// Hoisting every mapped or filtered iterable out of the loop header adds noise
		'unicorn/no-unreadable-for-of-expression': 'off',

		// Disallow unreadable IIFEs
		'unicorn/no-unreadable-iife': 'error',

		// Disallow unreadable `new` expressions
		// new Date().getTime() and friends read fine
		'unicorn/no-unreadable-new-expression': 'off',

		// Disallow unreadable object destructuring
		'unicorn/no-unreadable-object-destructuring': 'error',

		// Prevent unsafe use of ArrayBuffer view `.buffer`
		'unicorn/no-unsafe-buffer-conversion': 'error',

		// Disallow unsafe DOM HTML APIs
		// Not in unicorn's recommended config
		'unicorn/no-unsafe-dom-html': 'off',

		// Disallow reading `.value` from `Promise.allSettled()` results without a fulfilled status guard
		'unicorn/no-unsafe-promise-all-settled-values': 'error',

		// Disallow unsafe values as property keys
		'unicorn/no-unsafe-property-key': 'error',

		// Disallow non-literal replacement values in `String#replace()` and `String#replaceAll()`
		// $& and $1 in a variable replacement are usually, but not always, a bug
		'unicorn/no-unsafe-string-replacement': 'warn',

		// Disallow ignoring the return value of selected array methods
		// Matches on method name, so non-array join() and filter() APIs report falsely
		'unicorn/no-unused-array-method-return': 'warn',

		// Disallow unused object properties
		'unicorn/no-unused-properties': 'off',

		// Disallow unnecessary `Boolean()` casts in array predicate callbacks
		'unicorn/no-useless-boolean-cast': 'error',

		// Disallow useless type coercions of values that are already of the target type
		// Inferred from syntax rather than real types, and a deliberate coercion at a boundary reads as intent
		'unicorn/no-useless-coercion': 'warn',

		// Disallow useless values or fallbacks in `Set`, `Map`, `WeakSet`, or `WeakMap`
		'unicorn/no-useless-collection-argument': 'error',

		// Disallow useless compound assignments such as `x += 0`
		'unicorn/no-useless-compound-assignment': 'error',

		// Disallow useless concatenation of literals
		'unicorn/no-useless-concat': 'error',

		// Disallow useless `continue` statements
		'unicorn/no-useless-continue': 'error',

		// Disallow unnecessary existence checks before deletion
		'unicorn/no-useless-delete-check': 'error',

		// Disallow `else` after a statement that exits
		'unicorn/no-useless-else': 'error',

		// Disallow unnecessary `Error.captureStackTrace(…)`
		'unicorn/no-useless-error-capture-stack-trace': 'error',

		// Forbid useless fallback when spreading in object literals
		'unicorn/no-useless-fallback-in-spread': 'error',

		// Disallow unnecessary `.toArray()` on iterators
		'unicorn/no-useless-iterator-to-array': 'error',

		// Disallow useless array length check
		'unicorn/no-useless-length-check': 'error',

		// Disallow unnecessary operands in logical expressions involving boolean literals
		'unicorn/no-useless-logical-operand': 'error',

		// Disallow useless overrides of class methods
		'unicorn/no-useless-override': 'error',

		// Disallow returning/yielding Promise.resolve/reject() in async functions or promise callbacks
		'unicorn/no-useless-promise-resolve-reject': 'error',

		// Disallow redundant re-exports
		'unicorn/no-useless-re-export': 'error',

		// Disallow simple recursive function calls that can be replaced with a loop
		// The loop rewrite is not always the clearer one
		'unicorn/no-useless-recursion': 'warn',

		// Disallow useless spread
		'unicorn/no-useless-spread': 'error',

		// Disallow useless case in switch statements
		'unicorn/no-useless-switch-case': 'error',

		// Disallow useless template literal expressions
		'unicorn/no-useless-template-literals': 'error',

		// Disallow useless undefined
		'unicorn/no-useless-undefined': ['error', {
			checkArguments: false,
		}],

		// Disallow the bitwise XOR operator where exponentiation was likely intended
		'unicorn/no-xor-as-exponentiation': 'error',

		// Disallow number literals with zero fractions or dangling dots
		'unicorn/no-zero-fractions': 'error',

		// Enforce proper case for numeric literals
		'unicorn/number-literal-case': 'error',

		// Enforce the style of numeric separators by correctly grouping digits
		'unicorn/numeric-separators-style': ['error', {
			hexadecimal: {
				minimumDigits: 0,
				groupLength: 2,
			},
			binary: {
				minimumDigits: 0,
				groupLength: 4,
			},
			octal: {
				minimumDigits: 0,
				groupLength: 4,
			},
			number: {
				minimumDigits: 7,
				groupLength: 3,
			},
		}],

		// Require assignment operator shorthand where possible
		'unicorn/operator-assignment': 'error',

		// Prefer `AbortSignal.any()` over manually forwarding abort events between signals
		'unicorn/prefer-abort-signal-any': 'error',

		// Prefer `AbortSignal.timeout()` over manually aborting an `AbortController` with `setTimeout()`
		'unicorn/prefer-abort-signal-timeout': 'error',

		// Prefer .addEventListener() and .removeEventListener() over on-functions
		'unicorn/prefer-add-event-listener': 'error',

		// Prefer an options object over a boolean in `.addEventListener()`
		'unicorn/prefer-add-event-listener-options': 'error',

		// Prefer `AggregateError` when throwing collected errors
		'unicorn/prefer-aggregate-error': 'error',

		//  Prefer .find(…) over the first element from .filter(…)
		'unicorn/prefer-array-find': 'error',

		// Prefer Array#flat() over legacy techniques to flatten arrays
		'unicorn/prefer-array-flat': 'error',

		// Prefer .flatMap(…) over .map(…).flat()
		'unicorn/prefer-array-flat-map': 'error',

		// Prefer `Array.fromAsync()` over `for await…of` array accumulation
		'unicorn/prefer-array-from-async': 'error',

		// Prefer using the `Array.from()` mapping function argument
		'unicorn/prefer-array-from-map': 'error',

		// Prefer `Array.from({length}, …)` when creating range arrays
		'unicorn/prefer-array-from-range': 'error',

		// Prefer Array#indexOf() over Array#findIndex() when looking for the index of an item
		'unicorn/prefer-array-index-of': 'error',

		// Prefer iterating an array directly or with `Array#keys()` over `Array#entries()` when the index or value is unused
		'unicorn/prefer-array-iterable-methods': 'error',

		// Prefer last-oriented array methods over `Array#reverse()` or `Array#toReversed()` followed by a method
		'unicorn/prefer-array-last-methods': 'error',

		// Prefer `Array#slice()` over `Array#splice()` when reading from the returned array
		'unicorn/prefer-array-slice': 'error',

		// Prefer .some(…) over .find(…)
		'unicorn/prefer-array-some': 'error',

		// Prefer `.at()` method for index access and `String#charAt()`
		'unicorn/prefer-at': 'error',

		// Prefer `await` over promise chaining
		// Our Node services are callback and promise-chain heavy by design
		'unicorn/prefer-await': 'off',

		// Prefer `BigInt` literals over the constructor
		'unicorn/prefer-bigint-literals': 'error',

		// Prefer `Blob#arrayBuffer()` over `FileReader#readAsArrayBuffer(…)` and `Blob#text()` over `FileReader#readAsText(…)`
		'unicorn/prefer-blob-reading-methods': 'error',

		// Prefer block statements over IIFEs used only for scoping
		'unicorn/prefer-block-statement-over-iife': 'error',

		// Prefer directly returning boolean expressions over `if` statements
		'unicorn/prefer-boolean-return': 'error',

		// Prefer class field declarations over `this` assignments in constructors
		'unicorn/prefer-class-fields': 'error',

		// Prefer using `Element#classList.toggle()` to toggle class names
		'unicorn/prefer-classlist-toggle': 'error',

		// Prefer String#codePointAt(…) over String#charCodeAt(…) and String.fromCodePoint(…) over String.fromCharCode(…)
		'unicorn/prefer-code-point': 'error',

		// Prefer early continues over whole-loop conditional wrapping
		'unicorn/prefer-continue': 'error',

		// Prefer Date.now() to get the number of milliseconds since the Unix Epoch
		'unicorn/prefer-date-now': 'error',

		// Prefer default parameters over reassignment
		'unicorn/prefer-default-parameters': 'error',

		// Prefer direct iteration over default iterator method calls
		'unicorn/prefer-direct-iteration': 'error',

		// Prefer using `using`/`await using` over manual `try`/`finally` resource disposal
		// using needs runtime and bundler support we do not have yet
		'unicorn/prefer-dispose': 'off',

		// Prefer Node#append() over Node#appendChild()
		'unicorn/prefer-dom-node-append': 'error',

		// Prefer `.getHTML()` and `.setHTML()` over `.innerHTML`
		// setHTML() sanitizes, so swapping it in changes behavior
		'unicorn/prefer-dom-node-html-methods': 'warn',

		// Prefer childNode.remove() over parentNode.removeChild(childNode)
		'unicorn/prefer-dom-node-remove': 'error',

		// Prefer `.replaceChildren()` when emptying DOM children
		'unicorn/prefer-dom-node-replace-children': 'error',

		// Prefer .textContent over .innerText
		'unicorn/prefer-dom-node-text-content': 'error',

		// Prefer early returns over full-function conditional wrapping
		// Restructures whole function bodies
		'unicorn/prefer-early-return': 'off',

		// Prefer `else if` over adjacent `if` statements with related conditions
		'unicorn/prefer-else-if': 'error',

		// Prefer `Error.isError()` when checking for errors
		// Missing from Firefox ESR 140, and no-instanceof-builtins keeps useErrorIsError off for the same reason
		'unicorn/prefer-error-is-error': 'off',

		// Prefer EventTarget over EventEmitter
		'unicorn/prefer-event-target': 'warn',

		// Prefer explicit viewport units
		// CSS-only rule, so it cannot be enabled from a JavaScript config
		'unicorn/prefer-explicit-viewport-units': 'off',

		// Prefer export…from when re-exporting
		'unicorn/prefer-export-from': ['error', {
			checkUsedVariables: false,
		}],

		// Prefer flat `Math.min()` and `Math.max()` calls over nested calls
		'unicorn/prefer-flat-math-min-max': 'error',

		// Prefer `.getOrInsertComputed()` when the default value has side effects
		// Map#getOrInsertComputed() has not shipped in a stable runtime
		'unicorn/prefer-get-or-insert-computed': 'off',

		// Prefer global numeric constants over `Number` static properties
		'unicorn/prefer-global-number-constants': 'error',

		// Prefer `globalThis` over `window`, `self`, and `global`
		// window is the clearer spelling in browser-only code
		'unicorn/prefer-global-this': 'off',

		// Prefer `Object.groupBy()` or `Map.groupBy()` over reduce-based grouping
		'unicorn/prefer-group-by': 'error',

		// Prefer `.has()` when checking existence
		'unicorn/prefer-has-check': 'error',

		// Prefer moving code shared by all branches of an `if` statement out of the branches
		'unicorn/prefer-hoisting-branch-code': 'error',

		// Prefer HTTPS over HTTP
		'unicorn/prefer-https': 'error',

		// Prefer identifiers over string literals in import and export specifiers
		'unicorn/prefer-identifier-import-export-specifiers': 'error',

		// Prefer `import.meta.{dirname,filename}` over legacy techniques for getting file paths
		// Not in unicorn's recommended config
		'unicorn/prefer-import-meta-properties': 'off',

		// Prefer .includes() over .indexOf() when checking for existence or non-existence
		'unicorn/prefer-includes': 'error',

		// Prefer `.includes()` over repeated equality comparisons
		'unicorn/prefer-includes-over-repeated-comparisons': 'error',

		// Prefer passing iterables directly to constructors instead of filling empty collections
		'unicorn/prefer-iterable-in-constructor': 'error',

		// Prefer `Iterator.concat(…)` over temporary spread arrays
		// Iterator.concat() has not shipped in our browser targets
		'unicorn/prefer-iterator-concat': 'off',

		// Prefer iterator helpers over temporary arrays from iterators
		'unicorn/prefer-iterator-helpers': 'error',

		// Prefer `Iterator#toArray()` over temporary arrays from iterator spreads
		'unicorn/prefer-iterator-to-array': 'error',

		// Prefer moving `.toArray()` to the end of iterator helper chains
		'unicorn/prefer-iterator-to-array-at-end': 'error',

		// Prefer KeyboardEvent#key over KeyboardEvent#keyCode
		'unicorn/prefer-keyboard-event-key': 'error',

		// Prefer `location.assign()` over assigning to `location.href`
		'unicorn/prefer-location-assign': 'error',

		// Prefer using a logical operator over a ternary
		'unicorn/prefer-logical-operator-over-ternary': 'error',

		// Prefer `new Map()` over `Object.fromEntries()` when using the result as a map
		'unicorn/prefer-map-from-entries': 'error',

		// Prefer `Math.abs()` over manual absolute value expressions and symmetric range checks
		'unicorn/prefer-math-abs': 'error',

		// Prefer `Math` constants over their approximate numeric values
		'unicorn/prefer-math-constants': 'error',

		// Prefer `Math.min()` and `Math.max()` over ternaries for simple comparisons
		'unicorn/prefer-math-min-max': 'error',

		// Enforce the use of Math.trunc instead of bitwise operators
		'unicorn/prefer-math-trunc': 'error',

		// Prefer moving ternaries into the minimal varying part of an expression
		'unicorn/prefer-minimal-ternary': 'error',

		// Prefer .before() over .insertBefore(), .replaceWith() over .replaceChild(), prefer one of .before(), .after(), .append() or .prepend() over insertAdjacentText() and insertAdjacentElement()
		'unicorn/prefer-modern-dom-apis': 'error',

		// Prefer modern Math APIs over legacy patterns
		'unicorn/prefer-modern-math-apis': 'error',

		// Prefer JavaScript modules (ESM) over CommonJS
		// TODO: enforce as we transition our codebase to ESM
		'unicorn/prefer-module': 'off',

		// Prefer using String, Number, BigInt, Boolean, and Symbol directly.
		'unicorn/prefer-native-coercion-functions': 'error',

		// Prefer negative index over .length - index for {String,Array,TypedArray}#slice() and Array#splice()
		'unicorn/prefer-negative-index': 'error',

		// Prefer using the node: protocol when importing Node.js builtin modules
		'unicorn/prefer-node-protocol': 'error',

		// Prefer `Number()` over `parseFloat()` and base-10 `parseInt()`
		// Number() rejects the trailing-unit strings parseInt() accepts
		'unicorn/prefer-number-coercion': 'off',

		// Prefer `Number.isSafeInteger()` over integer checks
		// Flags every Number.isInteger() call, including the bounded validation where it is already correct
		'unicorn/prefer-number-is-safe-integer': 'warn',

		// Prefer Number static properties over global ones
		// NaN/Infinity checks stay off so this cannot fight prefer-global-number-constants
		'unicorn/prefer-number-properties': ['error', {
			checkInfinity: false,
			checkNaN: false,
		}],

		// Prefer `Object.defineProperties()` over multiple `Object.defineProperty()` calls
		'unicorn/prefer-object-define-properties': 'error',

		// Prefer object destructuring defaults over default object literals with spread
		'unicorn/prefer-object-destructuring-defaults': 'error',

		// Prefer using `Object.fromEntries(…)` to transform a list of key-value pairs into an object
		'unicorn/prefer-object-from-entries': 'error',

		// Prefer the most specific `Object` iterable method
		'unicorn/prefer-object-iterable-methods': 'error',

		// Prefer observer APIs over resize and scroll listeners with layout reads
		// Swapping a listener for an observer changes when callbacks fire, so it needs a human call
		'unicorn/prefer-observer-apis': 'warn',

		// Prefer omitting the catch binding parameter
		'unicorn/prefer-optional-catch-binding': 'error',

		// Prefer `Path2D` for repeatedly drawn canvas paths
		'unicorn/prefer-path2d': 'error',

		// Prefer private class fields over the underscore-prefix convention
		// Renaming _foo to #foo breaks anything reaching in from outside
		'unicorn/prefer-private-class-fields': 'warn',

		// Prefer `Promise.try()` over promise-wrapping boilerplate
		'unicorn/prefer-promise-try': 'error',

		// Prefer `Promise.withResolvers()` when extracting resolver functions from `new Promise()`
		'unicorn/prefer-promise-with-resolvers': 'error',

		// Prefer borrowing methods from the prototype instead of methods from an instance
		'unicorn/prefer-prototype-methods': 'off',

		// Prefer .querySelector() over .getElementById(), .querySelectorAll() over .getElementsByClassName() and .getElementsByTagName()
		'unicorn/prefer-query-selector': 'error',

		// Prefer `queueMicrotask()` over `process.nextTick()`, `setImmediate()`, and `setTimeout(…, 0)`
		// queueMicrotask() does not share process.nextTick() ordering or error semantics
		'unicorn/prefer-queue-microtask': 'off',

		// Prefer Reflect.apply() over Function#apply()
		'unicorn/prefer-reflect-apply': 'error',

		// Prefer `RegExp.escape()` for escaping strings to use in regular expressions
		// Not in unicorn's recommended config
		'unicorn/prefer-regexp-escape': 'off',

		// Prefer RegExp#test() over String#match() and RegExp#exec()
		'unicorn/prefer-regexp-test': 'error',

		// Prefer `Response.json()` over `new Response(JSON.stringify())`
		'unicorn/prefer-response-static-json': 'error',

		// Prefer `:scope` when using element query selector methods
		// Fires on every element-relative query, but a plain descendant search is usually what we mean
		'unicorn/prefer-scoped-selector': 'off',

		// Prefer Set#has() over Array#includes() when checking for existence or non-existence
		'unicorn/prefer-set-has': 'error',

		// Prefer `Set` methods for Set operations
		'unicorn/prefer-set-methods': 'error',

		// Prefer using Set#size instead of Array#length
		'unicorn/prefer-set-size': 'error',

		// Prefer arrow function properties over methods with a single return
		// We use object methods freely
		'unicorn/prefer-short-arrow-method': 'off',

		// Prefer simple conditions first in logical expressions
		// Reordering operands changes short-circuit behavior
		'unicorn/prefer-simple-condition-first': 'off',

		// Prefer a simple comparison function for `Array#sort()`
		'unicorn/prefer-simple-sort-comparator': 'error',

		// Prefer simplified conditions
		'unicorn/prefer-simplified-conditions': 'error',

		// Prefer a single `Array#some()` or `Array#every()` with a combined predicate
		'unicorn/prefer-single-array-predicate': 'error',

		// Enforce combining multiple `Array#{push,unshift}()`, `Element#classList.{add,remove}()`, and `importScripts()` into one call
		// Renamed from no-array-push-push, which we have always left off
		'unicorn/prefer-single-call': 'off',

		// Prefer a single object destructuring declaration per local const source
		'unicorn/prefer-single-object-destructuring': 'error',

		// Enforce combining multiple single-character replacements into a single `String#replaceAll()` with a regular expression
		'unicorn/prefer-single-replace': 'error',

		// Prefer declaring variables in the smallest possible scope
		'unicorn/prefer-smaller-scope': 'error',

		// Prefer `String#split()` with a limit
		'unicorn/prefer-split-limit': 'error',

		// Prefer the spread operator over Array.from()
		'unicorn/prefer-spread': 'error',

		// Prefer `String#matchAll()` over `RegExp#exec()` loops
		'unicorn/prefer-string-match-all': 'error',

		// Prefer `String#padStart()` and `String#padEnd()` over manual string padding
		'unicorn/prefer-string-pad-start-end': 'error',

		// Prefer using the `String.raw` tag to avoid escaping `\`
		'unicorn/prefer-string-raw': 'error',

		// Prefer `String#repeat()` for repeated whitespace
		'unicorn/prefer-string-repeat': 'error',

		// Prefer String#replaceAll() over regex searches with the global flag
		'unicorn/prefer-string-replace-all': 'error',

		// Prefer String#slice() over String#substr() and String#substring()
		'unicorn/prefer-string-slice': 'error',

		// Prefer String#startsWith() & String#endsWith() over more complex alternatives
		'unicorn/prefer-string-starts-ends-with': 'error',

		// Prefer String#trimStart() / String#trimEnd() over String#trimLeft() / String#trimRight()
		'unicorn/prefer-string-trim-start-end': 'error',

		// Prefer using structuredClone to create a deep clone
		'unicorn/prefer-structured-clone': 'error',

		// Prefer switch over multiple else-if
		'unicorn/prefer-switch': 'off',

		// Prefer `Temporal` over `Date`
		// Temporal is not in our Node or browser targets
		'unicorn/prefer-temporal': 'off',

		// Prefer ternary expressions over simple if-else statements
		'unicorn/prefer-ternary': 'off',

		// Prefer `.then().catch()` over `.then(…, …)` for error handling
		// .catch() also catches errors thrown by the fulfillment handler
		'unicorn/prefer-then-catch': 'warn',

		// Prefer using `Element#toggleAttribute()` to toggle attributes
		'unicorn/prefer-toggle-attribute': 'error',

		// Prefer top-level await over top-level promises and async function calls
		// Top-level await changes module evaluation in bundled entrypoints
		'unicorn/prefer-top-level-await': 'off',

		// Enforce throwing TypeError in type checking conditions
		'unicorn/prefer-type-error': 'error',

		// Require type literals to be last in union types
		'unicorn/prefer-type-literal-last': 'error',

		// Prefer `Uint8Array#toBase64()` and `Uint8Array.fromBase64()` over `atob()`, `btoa()`, and `Buffer` base64 conversions
		// Buffer already handles base64 on the Node side
		'unicorn/prefer-uint8array-base64': 'off',

		// Prefer the unary minus operator over multiplying or dividing by `-1`
		'unicorn/prefer-unary-minus': 'error',

		// Prefer Unicode code point escapes over legacy escape sequences
		'unicorn/prefer-unicode-code-point-escapes': 'error',

		// Prefer `URL.canParse()` over constructing a `URL` in a try/catch for validation
		'unicorn/prefer-url-can-parse': 'error',

		// Prefer `URL#href` over stringifying a `URL`
		'unicorn/prefer-url-href': 'error',

		// Prefer `URLSearchParams` over manually splitting query strings
		'unicorn/prefer-url-search-parameters': 'error',

		// Prefer putting the condition in the while statement
		'unicorn/prefer-while-loop-condition': 'error',

		// Enforce consistent relative URL style
		'unicorn/relative-url-style': ['error', 'always'],

		// Enforce using the separator argument with Array#join()
		'unicorn/require-array-join-separator': 'error',

		// Require a compare function when calling `Array#sort()` or `Array#toSorted()`
		'unicorn/require-array-sort-compare': 'error',

		// Require `CSS.escape()` for interpolated values in CSS selectors
		'unicorn/require-css-escape': 'error',

		// Require configured YAML frontmatter fields
		// No-op without a configured field list
		'unicorn/require-frontmatter-fields': 'off',

		// Require non-empty module attributes for imports and exports
		'unicorn/require-module-attributes': 'error',

		// Require non-empty specifier list in import and export statements
		'unicorn/require-module-specifiers': 'error',

		// Enforce using the digits argument with Number#toFixed()
		'unicorn/require-number-to-fixed-digits-argument': 'error',

		// Require passive event listeners for high-frequency events
		'unicorn/require-passive-events': 'error',

		// Enforce using the targetOrigin argument with window.postMessage()
		'unicorn/require-post-message-target-origin': 'error',

		// Require boolean-returning Proxy traps to return booleans
		'unicorn/require-proxy-trap-boolean-return': 'error',

		// Enforce better string content
		'unicorn/string-content': 'off',

		// Enforce consistent brace style for case clauses
		'unicorn/switch-case-braces': 'error',

		// Enforce consistent `break`/`return`/`continue`/`throw` position in `case` clauses
		'unicorn/switch-case-break-position': 'error',

		// Fix whitespace-insensitive template indentation.
		'unicorn/template-indent': 'error',

		// Enforce consistent case for text encoding identifiers
		'unicorn/text-encoding-identifier-case': 'error',

		// Require new when throwing an error
		'unicorn/throw-new-error': 'error',

		// Limit the complexity of `try` blocks
		// Caps try blocks at a single statement
		'unicorn/try-complexity': 'off',
	},
};
