import { globSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import pkg from '../package.json' with { type: 'json' };

const DEFAULT_RECEIVERS = ['app', 'res'];
const DEFAULT_METHODS = ['code', 'errorCode', 'failCode', 'success', 'fail'];
const DEFAULT_CODE_PATHS = ['config/codes/**/*.json'];
const DEFAULT_PACKAGES = ['spawnpoint'];

// Match the `spawnpoint` package and any installed `spawnpoint-*` plugin.
const SPAWNPOINT_PACKAGE = /^spawnpoint(?:-|$)/;

// Cache keeps the filesystem read to once per lint process, not once per file.
const cache = new Map();

// spawnpoint flattens code files via `Object.assign`, so top-level keys are the codes.
function readCodeKeys(file, codes) {
	try {
		const parsed = JSON.parse(readFileSync(file, 'utf8'));
		if (parsed && typeof parsed === 'object') {
			for (const key of Object.keys(parsed)) {
				codes.add(key);
			}
		}
	} catch {
		// Skip malformed code files rather than crashing the lint run.
	}
}

function collectFromPackage(name, cwd, codes) {
	try {
		const require = createRequire(path.join(cwd, 'noop.js'));
		const pkgRoot = path.dirname(require.resolve(`${name}/package.json`, { paths: [cwd] }));
		for (const file of globSync('codes/**/*.json', { cwd: pkgRoot })) {
			readCodeKeys(path.join(pkgRoot, file), codes);
		}
	} catch {
		// An unresolvable package simply contributes no codes.
	}
}

function discoverPackageNames(cwd, extraPackages) {
	const names = new Set([...DEFAULT_PACKAGES, ...extraPackages]);
	try {
		const projectPkg = JSON.parse(readFileSync(path.join(cwd, 'package.json'), 'utf8'));
		const deps = { ...projectPkg.dependencies, ...projectPkg.devDependencies };
		for (const name of Object.keys(deps)) {
			if (SPAWNPOINT_PACKAGE.test(name)) {
				names.add(name);
			}
		}
	} catch {
		// No readable project package.json — use the defaults/extras only.
	}
	return names;
}

// Exported for tests.
export function collectCodes(cwd, options = {}) {
	const codePaths = options.codePaths ?? DEFAULT_CODE_PATHS;
	const packages = options.packages ?? [];
	const additionalCodes = options.additionalCodes ?? [];

	const codes = new Set(additionalCodes);

	for (const pattern of codePaths) {
		for (const file of globSync(pattern, { cwd })) {
			readCodeKeys(path.join(cwd, file), codes);
		}
	}

	for (const name of discoverPackageNames(cwd, packages)) {
		collectFromPackage(name, cwd, codes);
	}

	return codes;
}

function loadCodes(cwd, options) {
	const key = `${cwd} ${JSON.stringify(options)}`;
	let codes = cache.get(key);
	if (!codes) {
		codes = collectCodes(cwd, options);
		cache.set(key, codes);
	}
	return codes;
}

const noUnknownCodeRule = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Ensure spawnpoint codes reference a code defined in config/codes or a resolved spawnpoint package',
		},
		schema: [{
			type: 'object',
			properties: {
				receivers: { type: 'array', items: { type: 'string' } },
				methods: { type: 'array', items: { type: 'string' } },
				codePaths: { type: 'array', items: { type: 'string' } },
				packages: { type: 'array', items: { type: 'string' } },
				additionalCodes: { type: 'array', items: { type: 'string' } },
			},
			additionalProperties: false,
		}],
		messages: {
			unknownCode: 'Unknown spawnpoint code "{{code}}". It is not defined in config/codes or any resolved spawnpoint package.',
		},
	},
	create(context) {
		const options = context.options[0] ?? {};
		const receivers = new Set(options.receivers ?? DEFAULT_RECEIVERS);
		const methods = new Set(options.methods ?? DEFAULT_METHODS);

		const codes = loadCodes(context.cwd ?? process.cwd(), {
			codePaths: options.codePaths ?? DEFAULT_CODE_PATHS,
			packages: options.packages ?? [],
			additionalCodes: options.additionalCodes ?? [],
		});

		// No codes discovered means this isn't a spawnpoint project, so stay silent.
		if (codes.size === 0) {
			return {};
		}

		return {
			CallExpression(node) {
				const { callee } = node;
				if (callee.type !== 'MemberExpression' || callee.computed) {
					return;
				}
				if (callee.object.type !== 'Identifier' || callee.property.type !== 'Identifier') {
					return;
				}
				if (!receivers.has(callee.object.name) || !methods.has(callee.property.name)) {
					return;
				}

				// Only string literals can be validated; skip variables, templates, and Errors like `res.fail(err)`.
				const arg = node.arguments[0];
				if (!arg || arg.type !== 'Literal' || typeof arg.value !== 'string') {
					return;
				}

				if (!codes.has(arg.value)) {
					context.report({
						node: arg,
						messageId: 'unknownCode',
						data: { code: arg.value },
					});
				}
			},
		};
	},
};

export default {
	meta: {
		name: 'eslint-plugin-spawnpoint-codes',
		version: pkg.version,
	},
	rules: {
		'no-unknown-code': noUnknownCodeRule,
	},
};
