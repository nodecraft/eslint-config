export default {
	rules: {
		// disallow confusing quantifiers
		'regexp/confusing-quantifier': 'warn',

		// enforce consistent escaping of control characters
		'regexp/control-character-escape': 'error',

		// enforce single grapheme in string literal
		// Only applies to `\q{...}` in `v` flag patterns, which we don't require
		'regexp/grapheme-string-literal': 'off',

		// enforce consistent usage of hexadecimal escape
		// Escape-style churn with no correctness value
		'regexp/hexadecimal-escape': 'off',

		// enforce into your favorite case
		// Re-cases every hex escape and character range, which is pure churn
		'regexp/letter-case': 'off',

		// enforce match any character style
		'regexp/match-any': 'error',

		// enforce use of escapes on negation
		'regexp/negation': 'error',

		// disallow elements that contradict assertions
		'regexp/no-contradiction-with-assertion': 'error',

		// disallow control characters
		// The core `no-control-regex` rule already covers this
		'regexp/no-control-character': 'off',

		// disallow duplicate characters in the RegExp character class
		'regexp/no-dupe-characters-character-class': 'error',

		// disallow duplicate disjunctions
		'regexp/no-dupe-disjunctions': 'error',

		// disallow alternatives without elements
		'regexp/no-empty-alternative': 'warn',

		// disallow capturing group that captures empty
		'regexp/no-empty-capturing-group': 'error',

		// disallow character classes that match no characters
		'regexp/no-empty-character-class': 'error',

		// disallow empty group
		'regexp/no-empty-group': 'error',

		// disallow empty lookahead assertion or empty lookbehind assertion
		'regexp/no-empty-lookarounds-assertion': 'error',

		// disallow empty string literals in character classes
		'regexp/no-empty-string-literal': 'error',

		// disallow escape backspace (`[\b]`)
		'regexp/no-escape-backspace': 'error',

		// disallow unnecessary nested lookaround assertions
		'regexp/no-extra-lookaround-assertions': 'error',

		// disallow invalid regular expression strings in `RegExp` constructors
		'regexp/no-invalid-regexp': 'error',

		// disallow invisible raw character
		'regexp/no-invisible-character': 'error',

		// disallow lazy quantifiers at the end of an expression
		'regexp/no-lazy-ends': 'warn',

		// disallow legacy RegExp features
		'regexp/no-legacy-features': 'error',

		// disallow capturing groups that do not behave as one would expect
		'regexp/no-misleading-capturing-group': 'error',

		// disallow multi-code-point characters in character classes and quantifiers
		'regexp/no-misleading-unicode-character': 'error',

		// disallow missing `g` flag in patterns used in `String#matchAll` and `String#replaceAll`
		'regexp/no-missing-g-flag': 'error',

		// disallow non-standard flags
		'regexp/no-non-standard-flag': 'error',

		// disallow obscure character ranges
		'regexp/no-obscure-range': 'error',

		// disallow octal escape sequence
		'regexp/no-octal': 'error',

		// disallow optional assertions
		'regexp/no-optional-assertion': 'error',

		// disallow backreferences that reference a group that might not be matched
		'regexp/no-potentially-useless-backreference': 'warn',

		// disallow standalone backslashes (`\`)
		'regexp/no-standalone-backslash': 'off',

		// disallow exponential and polynomial backtracking
		'regexp/no-super-linear-backtracking': 'error',

		// disallow quantifiers that cause quadratic moves
		// Flags patterns that aren't exploitable and often can't be rewritten; `no-super-linear-backtracking` covers the real ReDoS cases
		'regexp/no-super-linear-move': 'off',

		// disallow trivially nested assertions
		'regexp/no-trivially-nested-assertion': 'error',

		// disallow nested quantifiers that can be rewritten as one quantifier
		'regexp/no-trivially-nested-quantifier': 'error',

		// disallow unused capturing group
		'regexp/no-unused-capturing-group': 'error',

		// disallow assertions that are known to always accept (or reject)
		'regexp/no-useless-assertions': 'error',

		// disallow useless backreferences in regular expressions
		'regexp/no-useless-backreference': 'error',

		// disallow character class with one character
		'regexp/no-useless-character-class': 'error',

		// disallow useless `$` replacements in replacement string
		'regexp/no-useless-dollar-replacements': 'error',

		// disallow unnecessary escape characters in RegExp
		'regexp/no-useless-escape': 'error',

		// disallow unnecessary regex flags
		'regexp/no-useless-flag': 'warn',

		// disallow unnecessarily non-greedy quantifiers
		'regexp/no-useless-lazy': 'error',

		// disallow unnecessary non-capturing group
		'regexp/no-useless-non-capturing-group': 'error',

		// disallow quantifiers that can be removed
		'regexp/no-useless-quantifier': 'error',

		// disallow unnecessary character ranges
		'regexp/no-useless-range': 'error',

		// disallow unnecessary elements in expression character classes
		'regexp/no-useless-set-operand': 'error',

		// disallow string disjunction of single characters in `\q{...}`
		'regexp/no-useless-string-literal': 'error',

		// disallow unnecessary `{n,m}` quantifier
		'regexp/no-useless-two-nums-quantifier': 'error',

		// disallow quantifiers with a maximum of zero
		'regexp/no-zero-quantifier': 'error',

		// disallow the alternatives of lookarounds that end with a non-constant quantifier
		'regexp/optimal-lookaround-quantifier': 'warn',

		// require optimal quantifiers for concatenated quantifiers
		'regexp/optimal-quantifier-concatenation': 'error',

		// enforce using character class
		'regexp/prefer-character-class': 'error',

		// enforce using `\d`
		'regexp/prefer-d': 'error',

		// enforces escape of replacement `$` character (`$$`)
		'regexp/prefer-escape-replacement-dollar-char': 'error',

		// prefer lookarounds over capturing group that do not replace
		// Rewrites working patterns into lookarounds that are harder to read
		'regexp/prefer-lookaround': 'off',

		// enforce using named backreferences
		'regexp/prefer-named-backreference': 'error',

		// enforce using named capture groups
		// Naming every group is a large rewrite of existing patterns for no correctness gain
		'regexp/prefer-named-capture-group': 'off',

		// enforce using named replacement
		'regexp/prefer-named-replacement': 'error',

		// enforce using `+` quantifier
		'regexp/prefer-plus-quantifier': 'error',

		// prefer predefined assertion over equivalent lookarounds
		'regexp/prefer-predefined-assertion': 'error',

		// enforce using quantifier
		// Collapsing repeated characters into `{n}` is a readability preference, not a correctness one
		'regexp/prefer-quantifier': 'off',

		// enforce using `?` quantifier
		'regexp/prefer-question-quantifier': 'error',

		// enforce using character class range
		'regexp/prefer-range': 'error',

		// enforce that `RegExp#exec` is used instead of `String#match` if no global flag is provided
		// Contradicts `unicorn/prefer-regexp-test`, which we enable
		'regexp/prefer-regexp-exec': 'off',

		// enforce that `RegExp#test` is used instead of `String#match` and `RegExp#exec`
		// Duplicates `unicorn/prefer-regexp-test`, which we enable
		'regexp/prefer-regexp-test': 'off',

		// enforce using result array `groups`
		'regexp/prefer-result-array-groups': 'error',

		// prefer character class set operations instead of lookarounds
		'regexp/prefer-set-operation': 'error',

		// enforce using `*` quantifier
		'regexp/prefer-star-quantifier': 'error',

		// enforce use of unicode codepoint escapes
		'regexp/prefer-unicode-codepoint-escapes': 'error',

		// enforce using `\w`
		'regexp/prefer-w': 'error',

		// enforce the use of the `u` flag
		// Adding `u` changes matching semantics, so it needs a per-pattern review rather than a blanket autofix
		'regexp/require-unicode-regexp': 'off',

		// enforce the use of the `v` flag
		// Same semantics concern as the `u` flag, and the two are mutually exclusive
		'regexp/require-unicode-sets-regexp': 'off',

		// require simplify set operations
		'regexp/simplify-set-operations': 'error',

		// sort alternatives if order doesn't matter
		// Reorders existing patterns with no correctness value
		'regexp/sort-alternatives': 'off',

		// enforces elements order in character class
		// Reorders existing patterns with no correctness value
		'regexp/sort-character-class-elements': 'off',

		// require regex flags to be sorted
		'regexp/sort-flags': 'error',

		// disallow not strictly valid regular expressions
		'regexp/strict': 'error',

		// enforce consistent usage of unicode escape or unicode codepoint escape
		// Escape-style churn with no correctness value
		'regexp/unicode-escape': 'off',

		// enforce consistent naming of unicode properties
		'regexp/unicode-property': 'error',

		// use the `i` flag if it simplifies the pattern
		'regexp/use-ignore-case': 'error',

		// Core rules the plugin supersedes, matching its recommended config
		'no-empty-character-class': 'off',
		'no-invalid-regexp': 'off',
		'no-useless-backreference': 'off',

		// disallow use of the `RegExp` constructor in favor of regular expression literals
		'prefer-regex-literals': 'error',
	},
};
