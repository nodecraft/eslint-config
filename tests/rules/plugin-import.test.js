import path from 'node:path';

import { Linter } from 'eslint';
import { describe, expect, it } from 'vitest';

import base from '../../configs/base.js';

const linter = new Linter();
const config = [...base, { languageOptions: { sourceType: 'module' } }];
// A real path inside this package, so imports resolve against its package.json and node_modules.
const filename = path.join(import.meta.dirname, 'fixture.js');

const lint = code => linter.verify(code, config, { filename })
	.filter(message => message.ruleId === 'import-x/order' || message.message.startsWith('Resolve error'));

describe('import-x resolver', () => {
	it('accepts builtin, external, then relative imports', () => {
		expect(lint(`
			import fs from 'node:fs';

			import globals from 'globals';

			import rules from './rules.js';

			export default [fs, globals, rules];
		`)).toEqual([]);
	});

	// A self-reference only counts as internal (sorted after relative imports) when the resolver actually finds it.
	it('classifies a resolvable self-reference as internal', () => {
		expect(lint(`
			import rules from './rules.js';

			import nodecraft from '@nodecraft/eslint-config/configs/base.js';

			export default [rules, nodecraft];
		`)).toEqual([]);

		const [message] = lint(`
			import nodecraft from '@nodecraft/eslint-config/configs/base.js';

			import rules from './rules.js';

			export default [rules, nodecraft];
		`);
		expect(message?.ruleId).toBe('import-x/order');
	});
});
