import { readFileSync } from 'node:fs';
import path from 'node:path';

import pkg from '../package.json' with { type: 'json' };

const DEFAULT_MAX_DEPTH = 1;
const DEFAULT_CONDITIONS = ['import', 'default'];

// Expire lookups so an `imports` field edited during a long editor session is picked up without a restart.
const CACHE_TTL_MS = 30000;
const packageCache = new Map();

function readPackage(dir) {
	try {
		return JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8'));
	} catch (err) {
		if (err.code === 'ENOENT') {
			return;
		}
		// A malformed package.json still marks the package root, it just maps nothing.
		return {};
	}
}

// The nearest package.json scopes `imports`, so a nested package without one maps nothing.
function findPackage(dir) {
	const cached = packageCache.get(dir);
	if (cached && cached.expires > Date.now()) {
		return cached.value;
	}
	let value = null;
	const parsed = readPackage(dir);
	if (parsed) {
		value = { root: dir, imports: parsed.imports ?? null };
	} else if (path.dirname(dir) !== dir) {
		value = findPackage(path.dirname(dir));
	}
	packageCache.set(dir, { value, expires: Date.now() + CACHE_TTL_MS });
	return value;
}

// Follows Node's target resolution: `undefined` means try the next candidate, `null` is an explicit exclusion.
function pickTarget(target, conditions) {
	if (typeof target === 'string') {
		return target;
	}
	if (Array.isArray(target)) {
		for (const entry of target) {
			const picked = pickTarget(entry, conditions);
			if (picked !== undefined) {
				return picked;
			}
		}
		return;
	}
	if (target && typeof target === 'object') {
		for (const [condition, value] of Object.entries(target)) {
			if (!conditions.includes(condition)) {
				continue;
			}
			const picked = pickTarget(value, conditions);
			if (picked !== undefined) {
				return picked;
			}
		}
		return;
	}
	return null;
}

function buildMappings(imports, conditions) {
	const mappings = [];
	for (const [key, target] of Object.entries(imports)) {
		const picked = pickTarget(target, conditions);
		if (picked === undefined) {
			continue;
		}
		mappings.push({ key, target: picked });
	}
	return mappings;
}

function splitPattern(pattern) {
	const star = pattern.indexOf('*');
	if (star === -1 || pattern.includes('*', star + 1)) {
		return null;
	}
	return { prefix: pattern.slice(0, star), suffix: pattern.slice(star + 1) };
}

// Mirrors Node's PACKAGE_IMPORTS_EXPORTS_RESOLVE so a rewrite is only offered when it lands on the same file.
function resolveSpecifier(specifier, mappings) {
	const exact = mappings.find(mapping => mapping.key === specifier && !mapping.key.includes('*'));
	if (exact) {
		return exact.target;
	}
	let best = null;
	for (const mapping of mappings) {
		const key = splitPattern(mapping.key);
		if (!key || specifier === key.prefix || !specifier.startsWith(key.prefix) || !specifier.endsWith(key.suffix)) {
			continue;
		}
		if (specifier.length < mapping.key.length) {
			continue;
		}
		const better = !best
			|| key.prefix.length > best.prefix.length
			|| (key.prefix.length === best.prefix.length && mapping.key.length > best.mapping.key.length);
		if (better) {
			best = { mapping, prefix: key.prefix, match: specifier.slice(key.prefix.length, specifier.length - key.suffix.length) };
		}
	}
	if (!best || typeof best.mapping.target !== 'string') {
		return null;
	}
	return best.mapping.target.split('*').join(best.match);
}

// Exported for tests.
export function findSubpath(relativePath, mappings) {
	const candidates = [];
	for (const { key, target } of mappings) {
		if (typeof target !== 'string' || !target.startsWith('./')) {
			continue;
		}
		if (!key.includes('*')) {
			if (target === relativePath) {
				candidates.push(key);
			}
			continue;
		}
		const keyParts = splitPattern(key);
		const targetParts = splitPattern(target);
		if (!keyParts || !targetParts) {
			continue;
		}
		const fits = relativePath.length >= targetParts.prefix.length + targetParts.suffix.length
			&& relativePath.startsWith(targetParts.prefix)
			&& relativePath.endsWith(targetParts.suffix);
		if (!fits) {
			continue;
		}
		const match = relativePath.slice(targetParts.prefix.length, relativePath.length - targetParts.suffix.length);
		if (match === '') {
			continue;
		}
		candidates.push(keyParts.prefix + match + keyParts.suffix);
	}
	const valid = candidates.filter(candidate => resolveSpecifier(candidate, mappings) === relativePath);
	valid.sort((first, second) => first.length - second.length);
	return valid[0] ?? null;
}

function parentDepth(normalized) {
	let depth = 0;
	for (const segment of normalized.split('/')) {
		if (segment !== '..') {
			break;
		}
		depth++;
	}
	return depth;
}

const noDeepRelativeRule = {
	meta: {
		type: 'suggestion',
		fixable: 'code',
		docs: {
			description: 'Prefer package.json subpath imports over relative imports that climb several directories',
		},
		schema: [{
			type: 'object',
			properties: {
				maxDepth: { type: 'integer', minimum: 0 },
				imports: { type: 'object' },
				conditions: { type: 'array', items: { type: 'string' } },
			},
			additionalProperties: false,
		}],
		messages: {
			deepRelative: 'Use "{{replacement}}" instead of the relative import "{{source}}".',
		},
	},
	create(context) {
		const options = context.options[0] ?? {};
		const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;
		const conditions = options.conditions ?? DEFAULT_CONDITIONS;

		const filename = context.physicalFilename;
		if (!path.isAbsolute(filename)) {
			return {};
		}
		const fileDir = path.dirname(filename);
		const found = findPackage(fileDir);
		const root = found?.root ?? context.cwd;
		const imports = options.imports ?? found?.imports;
		if (!imports || typeof imports !== 'object') {
			return {};
		}
		const mappings = buildMappings(imports, conditions);
		if (mappings.length === 0) {
			return {};
		}

		const check = function(source) {
			if (source?.type !== 'Literal' || typeof source.value !== 'string') {
				return;
			}
			// Loader prefixes belong to the bundler, so their paths aren't ours to rewrite.
			if (source.value.includes('!')) {
				return;
			}
			const queryIndex = source.value.search(/[?#]/);
			const specifier = queryIndex === -1 ? source.value : source.value.slice(0, queryIndex);
			if (!specifier.startsWith('../') && !specifier.startsWith('./')) {
				return;
			}
			const query = queryIndex === -1 ? '' : source.value.slice(queryIndex);

			const depth = parentDepth(path.posix.normalize(specifier));
			if (depth <= maxDepth) {
				return;
			}

			const relative = path.relative(root, path.resolve(fileDir, specifier)).split(path.sep).join('/');
			if (relative === '' || relative.split('/', 1)[0] === '..' || path.isAbsolute(relative)) {
				return;
			}
			const subpath = findSubpath(`./${relative}`, mappings);
			if (!subpath) {
				return;
			}

			const replacement = subpath + query;
			const quote = context.sourceCode.getText(source)[0];
			context.report({
				node: source,
				messageId: 'deepRelative',
				data: { source: source.value, replacement },
				fix: fixer => fixer.replaceText(source, quote + replacement + quote),
			});
		};

		return {
			ImportDeclaration: node => check(node.source),
			ExportAllDeclaration: node => check(node.source),
			ExportNamedDeclaration: node => check(node.source),
			ImportExpression: node => check(node.source),
		};
	},
};

export default {
	meta: {
		name: 'eslint-plugin-subpath-imports',
		version: pkg.version,
	},
	rules: {
		'no-deep-relative': noDeepRelativeRule,
	},
};
