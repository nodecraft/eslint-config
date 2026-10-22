import path from 'node:path';

import { RuleTester } from 'eslint';
import { describe, expect, it } from 'vitest';

import plugin, { collectCodes } from '../../plugins/spawnpoint-codes.js';

const rule = plugin.rules['no-unknown-code'];

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
});

// Inject codes via `additionalCodes` so matching tests never touch the filesystem.
const KNOWN = ['user.not_found', 'user.email_inuse', 'express.status_200', 'billing.webhook.fail'];
const knownOptions = [{ additionalCodes: KNOWN, codePaths: [], packages: [] }];

// ── Known vs unknown codes ──────────────────────────────────────────────────

describe('no-unknown-code', () => {
	it('accepts known codes and flags unknown ones', () => {
		ruleTester.run('no-unknown-code', rule, {
			valid: [
				{ code: 'app.failCode(\'user.not_found\');', options: knownOptions },
				{ code: 'app.errorCode(\'user.email_inuse\');', options: knownOptions },
				{ code: 'app.code(\'billing.webhook.fail\');', options: knownOptions },
				{ code: 'res.success(\'express.status_200\');', options: knownOptions },
				{ code: 'res.fail(\'user.not_found\');', options: knownOptions },
			],
			invalid: [
				{
					code: 'app.failCode(\'user.not_fond\');',
					options: knownOptions,
					errors: [{ messageId: 'unknownCode', data: { code: 'user.not_fond' } }],
				},
				{
					code: 'res.success(\'express.status_999\');',
					options: knownOptions,
					errors: [{ messageId: 'unknownCode', data: { code: 'express.status_999' } }],
				},
			],
		});
	});

	// ── Dynamic / non-literal arguments are skipped ─────────────────────────────

	it('skips non-literal code arguments', () => {
		ruleTester.run('no-unknown-code', rule, {
			valid: [
				// Error object forwarded to res.fail — not a code
				{ code: 'res.fail(err);', options: knownOptions },
				// Variable holding a code
				{ code: 'app.failCode(someCode);', options: knownOptions },
				// Member expression (e.g. error.code)
				{ code: 'app.code(error.code);', options: knownOptions },
				// Template literal with an expression (the ${...} is part of the code under test)
				// eslint-disable-next-line no-template-curly-in-string -- literal source string, not a JS template
				{ code: 'app.code(`user.${name}`);', options: knownOptions },
			],
			invalid: [],
		});
	});

	// ── Receivers / methods that must not match ─────────────────────────────────

	it('ignores non-matching receivers and methods', () => {
		ruleTester.run('no-unknown-code', rule, {
			valid: [
				// `error` is a logger, not a code method
				{ code: 'app.error(\'some free-form message that is not a code\');', options: knownOptions },
				{ code: 'app.warn(\'another message\');', options: knownOptions },
				// console is not a tracked receiver
				{ code: 'console.error(\'boom\');', options: knownOptions },
				// Unknown receiver name
				{ code: 'thing.failCode(\'whatever.code\');', options: knownOptions },
				// Computed member access is not matched
				{ code: 'app[\'failCode\'](\'whatever.code\');', options: knownOptions },
			],
			invalid: [],
		});
	});

	// ── Configurable receivers / methods ────────────────────────────────────────

	it('honors custom receivers and methods', () => {
		ruleTester.run('no-unknown-code', rule, {
			valid: [
				{
					code: 'server.respond(\'user.not_found\');',
					options: [{ additionalCodes: KNOWN, codePaths: [], packages: [], receivers: ['server'], methods: ['respond'] }],
				},
			],
			invalid: [
				{
					code: 'server.respond(\'user.unknown\');',
					options: [{ additionalCodes: KNOWN, codePaths: [], packages: [], receivers: ['server'], methods: ['respond'] }],
					errors: [{ messageId: 'unknownCode', data: { code: 'user.unknown' } }],
				},
			],
		});
	});

	// ── No-op when no codes are discovered ──────────────────────────────────────

	it('stays silent when no codes are discovered', () => {
		ruleTester.run('no-unknown-code', rule, {
			valid: [
				{ code: 'app.failCode(\'definitely.not.a.real.code\');', options: [{ additionalCodes: [], codePaths: [], packages: [] }] },
			],
			invalid: [],
		});
	});
});

// ── Filesystem discovery ─────────────────────────────────────────────────────

describe('collectCodes', () => {
	const fixtureCwd = path.join(import.meta.dirname, '../fixtures/spawnpoint-codes');

	it('collects and merges code keys from config/codes', () => {
		const codes = collectCodes(fixtureCwd, { packages: [] });

		expect(codes.has('user.not_found')).toBe(true);
		expect(codes.has('user.email_inuse')).toBe(true);
		expect(codes.has('user.username_inuse')).toBe(true);
		// Nested directories are walked too
		expect(codes.has('billing.webhook.fail')).toBe(true);
		expect(codes.has('billing.invoice.created')).toBe(true);
		expect(codes.has('not.a.real.code')).toBe(false);
	});

	it('merges additionalCodes into the discovered set', () => {
		const codes = collectCodes(fixtureCwd, { packages: [], additionalCodes: ['custom.code'] });

		expect(codes.has('custom.code')).toBe(true);
		expect(codes.has('user.not_found')).toBe(true);
	});
});
