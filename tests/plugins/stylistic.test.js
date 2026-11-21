import { ESLint, RuleTester } from 'eslint';
import { describe, expect, it } from 'vitest';

import baseConfig from '../../configs/base.js';
import plugin from '../../plugins/stylistic.js';

const rule = plugin.rules['list-style'];

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
});

// A full --fix run, since the wrapper relies on the base rule's next pass to expand the remaining items.
async function fix(code) {
	const eslint = new ESLint({
		overrideConfigFile: true,
		overrideConfig: [...baseConfig, { languageOptions: { sourceType: 'module' } }],
		fix: true,
		ruleFilter: ({ ruleId }) => ruleId.startsWith('@stylistic/') || ruleId.startsWith('nodecraft-stylistic/'),
	});
	const [result] = await eslint.lintText(code, { filePath: 'example.js' });
	return result.output ?? code;
}

describe('list-style', () => {
	it('reports a hanging list once, at the opening bracket', () => {
		ruleTester.run('list-style', rule, {
			valid: [
				'log("a", b, c);',
				'log(\n\t"a",\n\tb,\n\tc,\n);',
				// Breaks inside the last item don't make the list hang
				'save(config, {\n\tdir,\n});',
				'run(a, () => {\n\treturn b;\n});',
			],
			invalid: [{
				code: 'log("a",\n\tb,\n\tc);',
				output: 'log(\n"a",\n\tb,\n\tc);',
				errors: [{ messageId: 'wrapFirstItem', line: 1, column: 5 }],
			}, {
				code: 'const item = { cwd: "/",\n\tname: "loot" };',
				output: 'const item = {\n cwd: "/",\n\tname: "loot" };',
				errors: [{ messageId: 'wrapFirstItem' }],
			}],
		});
	});

	it('expands a hanging call one argument per line', async () => {
		const code = 'logger.info(message,\n\titems.length,\n\telapsed);\n';
		expect(await fix(code)).toBe('logger.info(\n\tmessage,\n\titems.length,\n\telapsed,\n);\n');
	});

	it('expands a hanging object, keeping its nested objects intact', async () => {
		const code = 'save(config, { dir,\n\tparser: format,\n\tduplicates: {\n\t\tmaster: key,\n\t} });\n';
		expect(await fix(code)).toBe('save(config, {\n\tdir,\n\tparser: format,\n\tduplicates: {\n\t\tmaster: key,\n\t},\n});\n');
	});

	it('still collapses a lone item and expands a list that starts on its own line', async () => {
		expect(await fix('if (ready &&\n\tloaded\n) {\n\tstart();\n}\n')).toBe('if (ready &&\n\tloaded) {\n\tstart();\n}\n');
		expect(await fix('const tags = [\n\tfirst, second,\n];\n')).toBe('const tags = [\n\tfirst,\n\tsecond,\n];\n');
	});
});
