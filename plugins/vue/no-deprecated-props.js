import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { findPackage, mapSubpathImport } from '../subpath-imports.js';

const require = createRequire(import.meta.url);

// Expire lookups so edits made during a long editor session are picked up without a restart.
const CACHE_TTL_MS = 30000;
const NO_PROPS = new Map();

const resolveCache = new Map();
const componentCache = new Map();
const parseCache = new Map();
const deprecationCache = new Map();

// TypeScript is an optional peer, so the rule stays silent in projects without it.
let ts;
function loadTypescript() {
	if (ts === undefined) {
		try {
			ts = require('typescript');
		} catch {
			ts = null;
		}
	}
	return ts;
}

let resolveOptions;
let resolutionCache;
let resolutionCacheExpires = 0;
function resolveWithTypescript(request, importer) {
	if (!resolveOptions) {
		resolveOptions = {
			moduleResolution: ts.ModuleResolutionKind.Bundler,
			module: ts.ModuleKind.ESNext,
			allowArbitraryExtensions: true,
		};
		resolutionCache = ts.createModuleResolutionCache(process.cwd(), name => name, resolveOptions);
	}
	// TypeScript's cache never expires, so a module created mid-session would stay unresolved without this.
	if (resolutionCacheExpires <= Date.now()) {
		resolutionCache.clear();
		resolutionCacheExpires = Date.now() + CACHE_TTL_MS;
	}
	return ts.resolveModuleName(request, importer, resolveOptions, ts.sys, resolutionCache).resolvedModule;
}

function memo(cache, key, compute) {
	const cached = cache.get(key);
	if (cached && cached.expires > Date.now()) {
		return cached.value;
	}
	const value = compute();
	cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
	return value;
}

const isComponentModule = file => file.endsWith('.vue') || file.endsWith('.vue.d.ts');

// A bare package import resolves the same from anywhere in a package, so share it rather than probing per directory.
function resolveScope(specifier, importer) {
	const dir = path.dirname(importer);
	if (specifier.startsWith('.') || specifier.startsWith('#') || path.isAbsolute(specifier)) {
		return dir;
	}
	return findPackage(dir)?.root ?? dir;
}

function resolveModule(specifier, importer) {
	return memo(resolveCache, `${resolveScope(specifier, importer)}\0${specifier}`, () => {
		let request = specifier;
		if (specifier.startsWith('#')) {
			request = mapSubpathImport(specifier, importer);
			if (!request) {
				return null;
			}
		}
		// A `.vue` source file has no declaration beside it, so TypeScript can't resolve it; a built package can.
		const isPath = request.startsWith('.') || path.isAbsolute(request);
		if (isPath && request.endsWith('.vue')) {
			const absolute = path.resolve(path.dirname(importer), request);
			if (existsSync(absolute)) {
				return absolute;
			}
		}
		const resolved = resolveWithTypescript(request, importer);
		return resolved ? path.normalize(resolved.resolvedFileName) : null;
	});
}

// `requireTag` skips the TypeScript parse for files that can't contain a deprecation, which is nearly every component.
function parseScript(file, requireTag = false) {
	return memo(parseCache, `${file}\0${requireTag}`, () => {
		let text;
		try {
			text = readFileSync(file, 'utf8');
		} catch {
			return null;
		}
		if (requireTag && !text.includes('@deprecated')) {
			return null;
		}
		if (file.endsWith('.vue')) {
			// Only the script blocks matter; joining them keeps both `<script>` and `<script setup>` declarations.
			text = text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g).map(match => match[1]).toArray()
				.join('\n');
		}
		return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	});
}

function collectImports(sourceFile) {
	const imports = new Map();
	for (const statement of sourceFile.statements) {
		if (!ts.isImportDeclaration(statement) || !statement.importClause) {
			continue;
		}
		const specifier = statement.moduleSpecifier.text;
		const { name, namedBindings } = statement.importClause;
		if (name) {
			imports.set(name.text, { specifier, imported: 'default' });
		}
		if (namedBindings && ts.isNamedImports(namedBindings)) {
			for (const element of namedBindings.elements) {
				imports.set(element.name.text, { specifier, imported: (element.propertyName ?? element.name).text });
			}
		}
	}
	return imports;
}

// Follows re-exports from a package entry or barrel down to the module that declares the component.
function findComponentModule(file, exportName, seen = new Set()) {
	if (isComponentModule(file)) {
		return exportName === 'default' ? file : null;
	}
	const key = `${file}\0${exportName}`;
	if (seen.has(key)) {
		return null;
	}
	seen.add(key);

	const sourceFile = parseScript(file);
	if (!sourceFile) {
		return null;
	}
	const follow = (specifier, name) => {
		const target = resolveModule(specifier, file);
		return target ? findComponentModule(target, name, seen) : null;
	};
	const imports = collectImports(sourceFile);
	const followLocal = (local) => {
		const binding = imports.get(local);
		return binding ? follow(binding.specifier, binding.imported) : null;
	};

	// Named exports first: a barrel's `export *` lines would otherwise send us through every module it lists.
	for (const statement of sourceFile.statements) {
		if (ts.isExportAssignment(statement) && exportName === 'default' && ts.isIdentifier(statement.expression)) {
			return followLocal(statement.expression.text);
		}
		if (!ts.isExportDeclaration(statement) || !statement.exportClause || !ts.isNamedExports(statement.exportClause)) {
			continue;
		}
		const element = statement.exportClause.elements.find(entry => entry.name.text === exportName);
		if (!element) {
			continue;
		}
		const local = (element.propertyName ?? element.name).text;
		if (statement.moduleSpecifier) {
			return follow(statement.moduleSpecifier.text, local);
		}
		return followLocal(local);
	}
	if (exportName === 'default') {
		return null;
	}
	for (const statement of sourceFile.statements) {
		if (!(ts.isExportDeclaration(statement) && !statement.exportClause && statement.moduleSpecifier)) {
			continue;
		}

		const found = follow(statement.moduleSpecifier.text, exportName);
		if (found) {
			return found;
		}
	}
	return null;
}

const camelize = value => value.replaceAll(/-(\w)/g, (_match, letter) => letter.toUpperCase());
const capitalize = value => value.charAt(0).toUpperCase() + value.slice(1);

function localTypes(sourceFile) {
	const types = new Map();
	for (const statement of sourceFile.statements) {
		if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
			types.set(statement.name.text, statement);
		}
	}
	return types;
}

function referencedName(node) {
	if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
		return node.typeName.text;
	}
	if (ts.isExpressionWithTypeArguments(node) && ts.isIdentifier(node.expression)) {
		return node.expression.text;
	}
	return null;
}

// Reads only the direct members of a props declaration, so a deprecated field nested inside a prop's type isn't mistaken for a prop.
function collectDeprecated(node, types, props, seen = new Set()) {
	if (ts.isParenthesizedTypeNode(node) || ts.isTypeAliasDeclaration(node)) {
		collectDeprecated(node.type, types, props, seen);
		return;
	}
	if (ts.isIntersectionTypeNode(node)) {
		for (const type of node.types) {
			collectDeprecated(type, types, props, seen);
		}
		return;
	}
	if (ts.isObjectLiteralExpression(node) || ts.isTypeLiteralNode(node) || ts.isInterfaceDeclaration(node)) {
		for (const member of node.members ?? node.properties) {
			const tag = ts.getJSDocDeprecatedTag(member);
			if (tag && member.name && (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name))) {
				props.set(camelize(member.name.text), ts.getTextOfJSDocComment(tag.comment) ?? '');
			}
		}
		for (const clause of node.heritageClauses ?? []) {
			for (const type of clause.types) {
				collectDeprecated(type, types, props, seen);
			}
		}
		return;
	}
	const local = types.get(referencedName(node));
	if (local) {
		if (!seen.has(local)) {
			seen.add(local);
			collectDeprecated(local, types, props, seen);
		}
		return;
	}
	// Wrappers like `ExtractPropTypes<...>` and `Readonly<...>` carry the props as their first type argument.
	const [first] = node.typeArguments ?? [];
	if (first) {
		collectDeprecated(first, types, props, seen);
	}
}

const isDefineComponent = node => (ts.isImportTypeNode(node) && node.qualifier?.getText() === 'DefineComponent')
	|| (ts.isTypeReferenceNode(node) && /(?:^|\.)DefineComponent$/.test(node.typeName.getText()));

function findPropsDeclarations(sourceFile) {
	const found = [];
	const visit = (node) => {
		if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'defineProps') {
			found.push(...node.arguments, ...(node.typeArguments ?? []));
			return;
		}
		if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && node.name.text === 'props') {
			found.push(node.initializer);
			return;
		}
		// A built `.vue.d.ts` declares its props as the first type argument of `DefineComponent`.
		if (isDefineComponent(node) && node.typeArguments?.length) {
			found.push(node.typeArguments[0]);
			return;
		}
		ts.forEachChild(node, visit);
	};
	visit(sourceFile);
	return found;
}

function deprecatedPropsOf(componentFile) {
	return memo(deprecationCache, componentFile, () => {
		const sourceFile = parseScript(componentFile, true);
		if (!sourceFile) {
			return NO_PROPS;
		}
		const types = localTypes(sourceFile);
		const props = new Map();
		for (const declaration of findPropsDeclarations(sourceFile)) {
			collectDeprecated(declaration, types, props);
		}
		return props.size > 0 ? props : NO_PROPS;
	});
}

function getDeprecatedProps(binding, importer) {
	const moduleFile = resolveModule(binding.specifier, importer);
	if (!moduleFile) {
		return NO_PROPS;
	}
	const componentFile = memo(componentCache, `${moduleFile}\0${binding.imported}`, () => findComponentModule(moduleFile, binding.imported));
	return componentFile ? deprecatedPropsOf(componentFile) : NO_PROPS;
}

// Matches tags the way the SFC compiler matches them to `<script setup>` bindings; only hyphenated tags get the
// camel/Pascal lookup, so a native `<button>` never resolves to an imported `Button`.
function findBinding(tagName, bindings) {
	const exact = bindings.get(tagName);
	if (exact || !tagName.includes('-')) {
		return exact;
	}
	const camel = camelize(tagName);
	return bindings.get(camel) ?? bindings.get(capitalize(camel));
}

function attributeName(attribute) {
	if (!attribute.directive) {
		return attribute.key.rawName;
	}
	const directive = attribute.key.name.name;
	if (directive !== 'bind' && directive !== 'model') {
		return null;
	}
	if (attribute.key.argument?.type === 'VIdentifier') {
		return attribute.key.argument.rawName;
	}
	// A bare `v-model` on a component binds `modelValue`.
	if (directive === 'model' && !attribute.key.argument) {
		return 'modelValue';
	}
	return null;
}

function templateBindings(program) {
	const bindings = new Map();
	for (const statement of program.body) {
		if (statement.type !== 'ImportDeclaration' || statement.importKind === 'type') {
			continue;
		}
		for (const specifier of statement.specifiers) {
			if (specifier.type === 'ImportDefaultSpecifier') {
				bindings.set(specifier.local.name, { specifier: statement.source.value, imported: 'default' });
			} else if (specifier.type === 'ImportSpecifier' && specifier.importKind !== 'type') {
				const imported = specifier.imported.name ?? specifier.imported.value;
				bindings.set(specifier.local.name, { specifier: statement.source.value, imported });
			}
		}
	}
	return bindings;
}

export default {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallow passing props that the imported component marks `@deprecated`',
		},
		schema: [],
		messages: {
			deprecatedProp: '`{{prop}}` is deprecated on `<{{component}}>`. {{reason}}',
		},
	},
	create(context) {
		const { sourceCode } = context;
		const parserServices = sourceCode.parserServices;
		if (!parserServices?.defineTemplateBodyVisitor || !loadTypescript()) {
			return {};
		}
		const bindings = templateBindings(sourceCode.ast);
		if (bindings.size === 0) {
			return {};
		}
		// A template repeats the same few components, so look each one up once per file.
		const propsByBinding = new Map();
		const deprecatedPropsFor = (binding) => {
			let props = propsByBinding.get(binding);
			if (!props) {
				props = getDeprecatedProps(binding, context.filename);
				propsByBinding.set(binding, props);
			}
			return props;
		};
		return parserServices.defineTemplateBodyVisitor({
			VElement(node) {
				const binding = findBinding(node.rawName, bindings);
				if (!binding) {
					return;
				}
				const deprecated = deprecatedPropsFor(binding);
				if (deprecated.size === 0) {
					return;
				}
				for (const attribute of node.startTag.attributes) {
					const name = attributeName(attribute);
					if (!name) {
						continue;
					}
					const reason = deprecated.get(camelize(name));
					if (reason === undefined) {
						continue;
					}
					context.report({
						node: attribute.key,
						messageId: 'deprecatedProp',
						data: { prop: name, component: node.rawName, reason },
					});
				}
			},
		});
	},
};
