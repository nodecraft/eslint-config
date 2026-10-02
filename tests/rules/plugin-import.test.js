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

	// A self-reference only gets its own internal group, apart from `globals`, when the resolver actually finds it.
	it('classifies a resolvable self-reference as internal', () => {
		expect(lint(`
			import globals from 'globals';

			import nodecraft from '@nodecraft/eslint-config/configs/base.js';

			import rules from './rules.js';

			export default [globals, nodecraft, rules];
		`)).toEqual([]);

		const [message] = lint(`
			import rules from './rules.js';

			import nodecraft from '@nodecraft/eslint-config/configs/base.js';

			export default [rules, nodecraft];
		`);
		expect(message?.ruleId).toBe('import-x/order');
	});

	// The mapping often only resolves through a bundler, so `#` has to classify these without the resolver.
	it('groups unresolvable subpath imports between external and relative imports', () => {
		expect(lint(`
			import globals from 'globals';

			import { helpers } from '#/libs/helpers';
			import { config } from '#config';

			import rules from './rules.js';

			export default [globals, helpers, config, rules];
		`)).toEqual([]);

		const messages = lint(`
			import globals from 'globals';

			import rules from './rules.js';

			import { helpers } from '#/libs/helpers';

			export default [globals, helpers, rules];
		`);
		expect(messages.map(message => message.ruleId)).toContain('import-x/order');
	});
});
