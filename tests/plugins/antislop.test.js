import { ESLint, RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';

import baseConfig from '../../configs/base.js';
import plugin from '../../plugins/antislop.js';

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
});

const typescriptRuleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		parser: tseslint.parser,
		sourceType: 'module',
	},
});

describe('no-multiline-conditional-spread', () => {
	it('accepts single-line conditional spreads and rejects wrapped ones', () => {
		ruleTester.run('no-multiline-conditional-spread', plugin.rules['no-multiline-conditional-spread'], {
			valid: [
				'const args = [command, ...(verbose ? [\'--verbose\'] : [])];',
				'const args = [\n\tcommand,\n\t...(verbose ? [flag] : []),\n];',
				'const config = {\n\t...(verbose ? { flag } : {}),\n};',
				// A wrapped ternary is only structure worth reporting inside a literal.
				'const args = cond\n\t? [a]\n\t: [b];',
				'run(...(verbose\n\t? [flag]\n\t: []));',
				'const options = [...items];',
			],
			invalid: [
				{
					code: 'const columns = [\n\tnameColumn,\n\t...(canEdit\n\t\t? [{\n\t\t\tid: \'actions\',\n\t\t\tlabel: \'Actions\',\n\t\t}]\n\t\t: []),\n];',
					errors: [{ messageId: 'multilineConditionalSpread', data: { lines: 6, label: 'array' } }],
				},
				{
					code: 'const config = {\n\t...(debug\n\t\t? {\n\t\t\tverbose: true,\n\t\t\ttrace: true,\n\t\t}\n\t\t: {}),\n};',
					errors: [{ messageId: 'multilineConditionalSpread', data: { lines: 6, label: 'object' } }],
				},
				{
					// Wrapping a one-value branch is the common shape, and still costs a read.
					code: 'const args = [\n\t...(verbose\n\t\t? [flag]\n\t\t: []),\n];',
					errors: [{ messageId: 'multilineConditionalSpread', data: { lines: 3, label: 'array' } }],
				},
				{
					// Neither branch has to be a literal for the wrap to be the problem.
					code: 'const args = [\n\t...(verbose\n\t\t? loudArguments()\n\t\t: quietArguments()),\n];',
					errors: [{ messageId: 'multilineConditionalSpread', data: { lines: 3, label: 'array' } }],
				},
			],
		});
	});

	it('honours the maxLines option', () => {
		const code = 'const args = [\n\t...(verbose\n\t\t? [flag]\n\t\t: []),\n];';
		ruleTester.run('no-multiline-conditional-spread', plugin.rules['no-multiline-conditional-spread'], {
			valid: [{ code, options: [{ maxLines: 3 }] }],
			invalid: [{
				code,
				options: [{ maxLines: 2 }],
				errors: [{ messageId: 'multilineConditionalSpread', data: { lines: 3, label: 'array' } }],
			}],
		});
	});

	it('closes the one-line escape hatch with a content budget', () => {
		const long = '[{ id: \'actions\', label: \'Actions\', align: \'right\', sortable: false, width: \'auto\' }]';
		ruleTester.run('no-multiline-conditional-spread', plugin.rules['no-multiline-conditional-spread'], {
			valid: [
				// Comfortably the longest shape we want to keep: a flat entry on one line.
				'const rows = [...(played ? [{ label: \'Played:\', value: played }] : [])];',
			],
			invalid: [
				{
					// Collapsing a block onto one line dodges the line count, not the budget.
					code: `const columns = [nameColumn, ...(canEdit ? ${long} : [])];`,
					errors: [{ messageId: 'longConditionalSpread', data: { length: 105, label: 'array' } }],
				},
				{
					// The budget measures the collapsed branch, so wrapping it doesn't shrink it
					// either — a wrapped one reports the line count first.
					code: `const columns = [\n\tnameColumn,\n\t...(canEdit\n\t\t? ${long}\n\t\t: []),\n];`,
					errors: [{ messageId: 'multilineConditionalSpread', data: { lines: 3, label: 'array' } }],
				},
			],
		});
	});

	it('honours the maxLength option', () => {
		const code = 'const rows = [...(played ? [{ label: \'Played:\', value: played }] : [])];';
		ruleTester.run('no-multiline-conditional-spread', plugin.rules['no-multiline-conditional-spread'], {
			valid: [{ code, options: [{ maxLength: 60 }] }],
			invalid: [{
				code,
				options: [{ maxLength: 40 }],
				errors: [{ messageId: 'longConditionalSpread', data: { length: 56, label: 'array' } }],
			}],
		});
	});
});

describe('no-chained-type-assertions', () => {
	it('accepts single assertions and rejects assertion chains', () => {
		typescriptRuleTester.run('no-chained-type-assertions', plugin.rules['no-chained-type-assertions'], {
			valid: [
				'const value = input as User;',
				'const value = { id: 1 } as const;',
			],
			invalid: [
				{
					code: 'const value = input as unknown as User;',
					errors: [{ messageId: 'chained' }],
				},
				{
					code: 'const value = (input as object) as User;',
					errors: [{ messageId: 'chained' }],
				},
				{
					code: 'const value = <User><unknown>input;',
					errors: [{ messageId: 'chained' }],
				},
			],
		});
	});
});

describe('no-object-parameters', () => {
	it('accepts described inputs and rejects broad object parameters', () => {
		typescriptRuleTester.run('no-object-parameters', plugin.rules['no-object-parameters'], {
			valid: [
				'function save(value: { id: string }) {}',
				'function save<T>(value: T) {}',
				'type Entry = { value: object };',
			],
			invalid: [
				{
					code: 'function save(value: object) {}',
					errors: [{ messageId: 'objectParameter', data: { parameter: 'value' } }],
				},
				{
					code: 'const save = (value: object | null) => value;',
					errors: [{ messageId: 'objectParameter', data: { parameter: 'value' } }],
				},
				{
					code: 'interface Service { save(value: object): void }',
					errors: [{ messageId: 'objectParameter', data: { parameter: 'value' } }],
				},
			],
		});
	});

	it('sees through same-file type aliases', () => {
		typescriptRuleTester.run('no-object-parameters', plugin.rules['no-object-parameters'], {
			valid: [
				'type Options = { id: string }; function save(value: Options) {}',
				'type Maybe<T> = T | null; function save(value: Maybe<string>) {}',
				// A function's own type parameter isn't an alias, even when constrained to object.
				'function save<T extends object>(value: T) {}',
				// Inner declarations shadow the outer alias.
				'type Options = object; function save() { type Options = { id: string }; return (value: Options) => value; }',
				'type Loop = Loop | null; function save(value: Loop) {}',
				'import type { Options } from \'./options\'; function save(value: Options) {}',
			],
			invalid: [
				{
					code: 'type Options = object; function save(value: Options) {}',
					errors: [{ messageId: 'objectParameter', data: { parameter: 'value' } }],
				},
				{
					code: 'type Payload = object | null; type Input = Payload; const save = (value: Input) => value;',
					errors: [{ messageId: 'objectParameter', data: { parameter: 'value' } }],
				},
				{
					code: 'type Maybe<T> = T | undefined; function save(value: Maybe<object>) {}',
					errors: [{ messageId: 'objectParameter', data: { parameter: 'value' } }],
				},
				{
					code: 'type Maybe<T = object> = T | null; function save(value: Maybe) {}',
					errors: [{ messageId: 'objectParameter', data: { parameter: 'value' } }],
				},
				{
					code: 'type Box<T> = Wrap<T>; type Wrap<U> = U | null; function save(value: Box<object>) {}',
					errors: [{ messageId: 'objectParameter', data: { parameter: 'value' } }],
				},
			],
		});
	});
});

describe('no-reduce-accumulator-copy', () => {
	const error = { messageId: 'accumulatorCopy' };

	it('accepts mutated accumulators and rejects per-iteration copies', () => {
		ruleTester.run('no-reduce-accumulator-copy', plugin.rules['no-reduce-accumulator-copy'], {
			valid: [
				'items.reduce((acc, item) => { acc.push(item); return acc; }, []);',
				'items.reduce((acc, item) => Object.assign(acc, item), {});',
				// Copying the incoming item is bounded; only the growing accumulator is a problem.
				'items.reduce((acc, item) => { acc[item.id] = { ...item }; return acc; }, {});',
				'items.reduce((acc, item) => { acc.push(Object.assign({}, item)); return acc; }, []);',
				'items.reduce((acc, item) => { acc.push(item.slice()); return acc; }, []);',
				'items.reduce((acc, item) => acc.concat(item), \'\');',
				'items.reduce((acc, item) => acc.concat(item), customCollection);',
				'items.reduce((acc, item) => Math.max(acc, ...item.values), 0);',
				'items.map(acc => Object.assign({}, acc));',
				'items.map(acc => [...acc]);',
				'function copy(acc) { return Object.assign({}, acc); }',
				'items.reduce((acc, item) => { const snapshot = () => ({ ...acc }); return acc; }, {});',
				'items.reduce((acc, item) => { { const acc = {}; Object.assign({}, acc); } return acc; }, {});',
				'const Object = custom; items.reduce((acc, item) => Object.assign({}, acc), {});',
				'const Array = custom; items.reduce((acc, item) => Array.from(acc), []);',
				'items.reduce((acc, item) => { let alias = acc; alias = item; return Object.assign({}, alias); }, {});',
			],
			invalid: [
				{ code: 'items.reduce((acc, item) => [...acc, item], []);', errors: [error] },
				{ code: 'items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});', errors: [error] },
				{ code: 'items.reduce((acc, item) => Object.assign({}, acc, { [item.id]: item }), {});', errors: [error] },
				{ code: 'items.reduceRight((acc, item) => Object.assign({}, acc, item), {});', errors: [error] },
				{ code: 'items.reduce(function(acc, item) { return Object.assign({}, item, acc); }, {});', errors: [error] },
				{ code: 'items[\'reduce\']((acc, item) => Object[\'assign\']({}, acc, item), {});', errors: [error] },
				{ code: 'items.reduce((acc = {}, item) => ({ ...acc, item }), {});', errors: [error] },
				{ code: 'items.reduce((acc, item) => { const alias = acc; return [...alias, item]; }, []);', errors: [error] },
				{ code: 'items.reduce((acc, item) => acc.concat([item]), []);', errors: [error] },
				{ code: 'const initial = []; items.reduce((acc, item) => acc.concat(item), initial);', errors: [error] },
				{ code: 'items.reduce((acc, item) => { const next = acc.slice(); next.push(item); return next; }, []);', errors: [error] },
				{ code: 'items.reduce((acc, item) => { const next = Array.from(acc); next.push(item); return next; }, []);', errors: [error] },
				{ code: 'items.reduce((acc, item) => acc.toSpliced(acc.length, 0, item), []);', errors: [error] },
				{ code: 'items.reduce((acc, item) => acc.with(0, item), []);', errors: [error] },
			],
		});
	});

	it('unwraps TypeScript assertions on the accumulator and initial value', () => {
		typescriptRuleTester.run('no-reduce-accumulator-copy', plugin.rules['no-reduce-accumulator-copy'], {
			valid: [],
			invalid: [
				{ code: 'items.reduce((acc, item) => Object.assign({}, acc as State, item), {});', errors: [error] },
				{ code: 'items.reduce((acc, item) => acc.concat([item]), [] as Item[]);', errors: [error] },
			],
		});
	});
});

describe('plugin shape', () => {
	it('exposes metadata and is enabled in the base config', () => {
		expect(plugin.meta.name).toBe('eslint-plugin-nodecraft-antislop');
		expect(plugin.meta.version).toBeTypeOf('string');

		const config = baseConfig.find(entry => entry.plugins?.antislop);
		expect(config.plugins.antislop).toBe(plugin);
		expect(config.rules['antislop/no-multiline-conditional-spread']).toBe('error');
		expect(config.rules['antislop/no-chained-type-assertions']).toBe('error');
		expect(config.rules['antislop/no-object-parameters']).toBe('error');
		expect(config.rules['antislop/no-reduce-accumulator-copy']).toBe('error');

		const testConfig = baseConfig.find(entry => entry.rules?.['antislop/no-chained-type-assertions'] === 'off');
		expect(testConfig.files).toContain('**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}');
		expect(testConfig.rules['antislop/no-object-parameters']).toBe('off');
	});

	it('limits both type rules to non-test files', async () => {
		const eslint = new ESLint({
			overrideConfig: [
				...baseConfig,
				{
					files: ['**/*.ts'],
					languageOptions: { parser: tseslint.parser, sourceType: 'module' },
				},
			],
			overrideConfigFile: true,
		});
		const code = 'const value = input as unknown as User; function save(input: object) {}';
		const [sourceResult] = await eslint.lintText(code, { filePath: 'src/example.ts' });
		const [testResult] = await eslint.lintText(code, { filePath: 'test/example.test.ts' });
		const antislopRules = result => result.messages
			.map(message => message.ruleId)
			.filter(ruleId => ruleId?.startsWith('antislop/'));

		expect(antislopRules(sourceResult)).toStrictEqual([
			'antislop/no-chained-type-assertions',
			'antislop/no-object-parameters',
		]);
		expect(antislopRules(testResult)).toStrictEqual([]);
	});

	// The TypeScript rules key off TS-only node types, so a JS parse never reaches them.
	it('stays quiet on plain JavaScript', async () => {
		const eslint = new ESLint({ overrideConfig: baseConfig, overrideConfigFile: true });
		const [result] = await eslint.lintText('const save = function(value) { return value; };\n', { filePath: 'src/example.js' });
		expect(result.messages.filter(message => message.ruleId?.startsWith('antislop/'))).toStrictEqual([]);
	});
});
