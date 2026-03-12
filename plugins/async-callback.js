// Mapping of async library method names to how their task/iteratee functions are structured.
// type: 'iteratee' = single function at argIndex
//       'array'    = array of functions at argIndex
//       'object'   = object of functions at argIndex (async.auto style)
const METHODS = {
	// Array of task functions at arg 0
	series: { type: 'array', argIndex: 0 },
	parallel: { type: 'array', argIndex: 0 },
	parallelLimit: { type: 'array', argIndex: 0 },
	waterfall: { type: 'array', argIndex: 0 },

	// Object of task functions at arg 0
	auto: { type: 'object', argIndex: 0 },

	// Iteratee at arg 1
	each: { type: 'iteratee', argIndex: 1 },
	eachSeries: { type: 'iteratee', argIndex: 1 },
	forEach: { type: 'iteratee', argIndex: 1 },
	forEachSeries: { type: 'iteratee', argIndex: 1 },
	eachOf: { type: 'iteratee', argIndex: 1 },
	eachOfSeries: { type: 'iteratee', argIndex: 1 },
	forEachOf: { type: 'iteratee', argIndex: 1 },
	forEachOfSeries: { type: 'iteratee', argIndex: 1 },
	map: { type: 'iteratee', argIndex: 1 },
	mapSeries: { type: 'iteratee', argIndex: 1 },
	mapValues: { type: 'iteratee', argIndex: 1 },
	mapValuesSeries: { type: 'iteratee', argIndex: 1 },
	filter: { type: 'iteratee', argIndex: 1 },
	filterSeries: { type: 'iteratee', argIndex: 1 },
	select: { type: 'iteratee', argIndex: 1 },
	selectSeries: { type: 'iteratee', argIndex: 1 },
	reject: { type: 'iteratee', argIndex: 1 },
	rejectSeries: { type: 'iteratee', argIndex: 1 },
	detect: { type: 'iteratee', argIndex: 1 },
	detectSeries: { type: 'iteratee', argIndex: 1 },
	find: { type: 'iteratee', argIndex: 1 },
	findSeries: { type: 'iteratee', argIndex: 1 },
	some: { type: 'iteratee', argIndex: 1 },
	someSeries: { type: 'iteratee', argIndex: 1 },
	every: { type: 'iteratee', argIndex: 1 },
	everySeries: { type: 'iteratee', argIndex: 1 },
	concat: { type: 'iteratee', argIndex: 1 },
	concatSeries: { type: 'iteratee', argIndex: 1 },
	sortBy: { type: 'iteratee', argIndex: 1 },
	groupBy: { type: 'iteratee', argIndex: 1 },
	groupBySeries: { type: 'iteratee', argIndex: 1 },
	times: { type: 'iteratee', argIndex: 1 },
	timesSeries: { type: 'iteratee', argIndex: 1 },
	transform: { type: 'iteratee', argIndex: 1 },

	// Iteratee at arg 2 (limit and reduce variants)
	eachLimit: { type: 'iteratee', argIndex: 2 },
	forEachLimit: { type: 'iteratee', argIndex: 2 },
	eachOfLimit: { type: 'iteratee', argIndex: 2 },
	forEachOfLimit: { type: 'iteratee', argIndex: 2 },
	mapLimit: { type: 'iteratee', argIndex: 2 },
	mapValuesLimit: { type: 'iteratee', argIndex: 2 },
	filterLimit: { type: 'iteratee', argIndex: 2 },
	selectLimit: { type: 'iteratee', argIndex: 2 },
	rejectLimit: { type: 'iteratee', argIndex: 2 },
	detectLimit: { type: 'iteratee', argIndex: 2 },
	findLimit: { type: 'iteratee', argIndex: 2 },
	someLimit: { type: 'iteratee', argIndex: 2 },
	everyLimit: { type: 'iteratee', argIndex: 2 },
	concatLimit: { type: 'iteratee', argIndex: 2 },
	groupByLimit: { type: 'iteratee', argIndex: 2 },
	timesLimit: { type: 'iteratee', argIndex: 2 },
	reduce: { type: 'iteratee', argIndex: 2 },
	reduceRight: { type: 'iteratee', argIndex: 2 },

	// Control flow
	forever: { type: 'iteratee', argIndex: 0 },
	whilst: { type: 'iteratee', argIndex: 1 },
	doWhilst: { type: 'iteratee', argIndex: 0 },
	until: { type: 'iteratee', argIndex: 1 },
	doUntil: { type: 'iteratee', argIndex: 0 },
	retry: { type: 'iteratee', argIndex: 0 },
};

const FUNCTION_TYPES = new Set(['FunctionExpression', 'ArrowFunctionExpression']);

function getTaskFunctions(callNode, methodInfo) {
	const arg = callNode.arguments[methodInfo.argIndex];
	if (!arg) {
		return [];
	}

	if (methodInfo.type === 'iteratee') {
		return FUNCTION_TYPES.has(arg.type) ? [arg] : [];
	}

	if (methodInfo.type === 'array') {
		if (arg.type !== 'ArrayExpression') {
			return [];
		}
		return arg.elements.filter(el => el && FUNCTION_TYPES.has(el.type));
	}

	if (methodInfo.type === 'object') {
		if (arg.type !== 'ObjectExpression') {
			return [];
		}
		const functions = [];
		for (const prop of arg.properties) {
			if (!prop.value) {
				continue;
			}
			if (FUNCTION_TYPES.has(prop.value.type)) {
				functions.push(prop.value);
			}
			// Handle async.auto [dependencies..., fn] pattern
			if (prop.value.type === 'ArrayExpression' && prop.value.elements.length > 0) {
				const lastElement = prop.value.elements[prop.value.elements.length - 1];
				if (lastElement && FUNCTION_TYPES.has(lastElement.type)) {
					functions.push(lastElement);
				}
			}
		}
		return functions;
	}

	return [];
}

function checkCallbackUsage(context, taskFn, methodName) {
	const { params } = taskFn;
	if (params.length === 0) {
		return;
	}

	const lastParam = params[params.length - 1];
	// Skip rest params, destructuring, etc.
	if (lastParam.type !== 'Identifier') {
		return;
	}

	const scope = context.sourceCode.getScope(taskFn);
	const variable = scope.variables.find(variable => variable.name === lastParam.name);
	if (!variable) {
		return;
	}

	// Check if the callback is referenced at all (called, passed as argument, etc.)
	if (variable.references.length === 0) {
		context.report({
			node: lastParam,
			messageId: 'missingCallback',
			data: { name: lastParam.name, methodName },
		});
	}
}

const noMissingCallbackRule = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Ensure callbacks are called in async library task functions',
		},
		schema: [],
		messages: {
			missingCallback: 'Callback "{{name}}" is never called in async.{{methodName}}() task function.',
		},
	},
	create(context) {
		const asyncDefaultBindings = new Set();
		const asyncNamedBindings = new Map();

		return {
			ImportDeclaration(node) {
				if (node.source.value !== 'async') {
					return;
				}
				for (const specifier of node.specifiers) {
					if (specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportNamespaceSpecifier') {
						asyncDefaultBindings.add(specifier.local.name);
					} else if (specifier.type === 'ImportSpecifier') {
						asyncNamedBindings.set(specifier.local.name, specifier.imported.name);
					}
				}
			},

			VariableDeclarator(node) {
				// Handle: const async = require('async')
				const init = node.init;
				if (!init || init.type !== 'CallExpression') {
					return;
				}
				if (init.callee.type !== 'Identifier' || init.callee.name !== 'require') {
					return;
				}
				if (!init.arguments[0] || init.arguments[0].value !== 'async') {
					return;
				}

				if (node.id.type === 'Identifier') {
					asyncDefaultBindings.add(node.id.name);
				} else if (node.id.type === 'ObjectPattern') {
					for (const prop of node.id.properties) {
						if (prop.type === 'Property' && prop.key.type === 'Identifier' && prop.value.type === 'Identifier') {
							asyncNamedBindings.set(prop.value.name, prop.key.name);
						}
					}
				}
			},

			CallExpression(node) {
				let methodName = null;

				if (node.callee.type === 'MemberExpression' && node.callee.object.type === 'Identifier' && node.callee.property.type === 'Identifier') {
					const objectName = node.callee.object.name;
					// Match tracked imports or any identifier literally named 'async'
					if (asyncDefaultBindings.has(objectName) || objectName === 'async') {
						methodName = node.callee.property.name;
					}
				}

				// Match destructured/named imports: series([...])
				if (!methodName && node.callee.type === 'Identifier' && asyncNamedBindings.has(node.callee.name)) {
					methodName = asyncNamedBindings.get(node.callee.name);
				}

				const methodInfo = methodName && METHODS[methodName];
				if (!methodInfo) {
					return;
				}

				const taskFunctions = getTaskFunctions(node, methodInfo);
				for (const taskFn of taskFunctions) {
					checkCallbackUsage(context, taskFn, methodName);
				}
			},
		};
	},
};

export default {
	meta: {
		name: 'eslint-plugin-async-callback',
		version: '1.0.0',
	},
	rules: {
		'no-missing-callback': noMissingCallbackRule,
	},
};
