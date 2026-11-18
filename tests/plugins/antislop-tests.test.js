import { ESLint, RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';

import baseConfig from '../../configs/base.js';
import plugin from '../../plugins/antislop-tests.js';

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

describe('strict-msw', () => {
	it('requires an error on unhandled requests from either MSW major', () => {
		const server = 'import { setupServer } from \'msw/node\';\nconst server = setupServer();\n';
		ruleTester.run('strict-msw', plugin.rules['strict-msw'], {
			valid: [
				`${server}server.listen({ onUnhandledFrame: 'error' });`,
				`${server}server.listen({ onUnhandledRequest: 'error' });`,
				`${server}server.listen({ onUnhandledFrame: (frame, print) => print.error() });`,
				'import { setupWorker } from \'msw/browser\';\nsetupWorker().start({ onUnhandledFrame: \'error\' });',
				// Options built elsewhere can't be checked, so they get the benefit of the doubt.
				`${server}server.listen(options);`,
				`${server}server.listen({ ...strictOptions });`,
				// A Node HTTP server shares the method name and isn't MSW.
				'import { createServer } from \'node:http\';\nconst server = createServer();\nserver.listen(0);',
				'const server = setupServer();\nserver.listen();',
			],
			invalid: [
				{ code: `${server}server.listen();`, errors: [{ messageId: 'lenient' }] },
				{ code: `${server}server.listen({ onUnhandledFrame: 'bypass' });`, errors: [{ messageId: 'lenient' }] },
				{ code: `${server}server.listen({ quiet: true });`, errors: [{ messageId: 'lenient' }] },
				{
					code: 'import { setupServer as createMockServer } from \'msw/node\';\nlet server;\nserver = createMockServer();\nserver.listen();',
					errors: [{ messageId: 'lenient' }],
				},
				{ code: 'import { setupWorker } from \'msw/browser\';\nsetupWorker().start();', errors: [{ messageId: 'lenient' }] },
			],
		});
	});
});

describe('no-retry', () => {
	it('reports retries in test options, setConfig and Vitest configs', () => {
		ruleTester.run('no-retry', plugin.rules['no-retry'], {
			valid: [
				'it(\'loads\', { timeout: 5000 }, () => {});',
				'export default defineConfig({ test: { retry: 0 } });',
				'test.extend({ retry: 2 });',
				'request({ retry: 3 });',
			],
			invalid: [
				{ code: 'describe(\'checkout\', { retry: 2 }, () => {});', errors: [{ messageId: 'retry' }] },
				{ code: 'it.concurrent(\'loads\', { retry: 1 }, async () => {});', errors: [{ messageId: 'retry' }] },
				{ code: 'test.each([1])(\'loads %i\', () => {}, { retry: 1 });', errors: [{ messageId: 'retry' }] },
				{ code: 'vi.setConfig({ retry: 2 });', errors: [{ messageId: 'retry' }] },
				{
					code: 'export default defineConfig({ test: { projects: [{ test: { retry: process.env.CI ? 2 : 0 } }] } });',
					errors: [{ messageId: 'retry' }],
				},
			],
		});
	});

	it('reaches Vitest config files through the shipped config', async () => {
		const eslint = new ESLint({ overrideConfig: baseConfig, overrideConfigFile: true });
		const [result] = await eslint.lintText(
			'module.exports = { test: { retry: 2 } };\n',
			{ filePath: 'vitest.config.cjs' },
		);
		expect(result.messages.map(message => message.ruleId)).toContain('antislop-tests/no-retry');
	});
});

describe('no-fixed-sleep', () => {
	it('reports timed waits in tests and hooks, including same-file helpers', () => {
		ruleTester.run('no-fixed-sleep', plugin.rules['no-fixed-sleep'], {
			valid: [
				// A zero delay yields to queued work rather than guessing how long it takes.
				'it(\'renders\', async () => { await new Promise(resolve => { setTimeout(resolve, 0); }); });',
				'import { setTimeout as sleep } from \'node:timers/promises\';\nit(\'renders\', async () => { await sleep(); });',
				'const flush = () => new Promise(resolve => setTimeout(resolve, 0));\nit(\'renders\', async () => { await flush(); });',
				// Outside a test or hook body the wait isn't the test's timing.
				'async function poll() { await new Promise(resolve => setTimeout(resolve, 100)); }',
				'it(\'retries\', async () => { await withBackoff(async () => { await new Promise(resolve => setTimeout(resolve, 50)); }); });',
				'vi.useFakeTimers();\nit(\'expires\', async () => { await new Promise(resolve => setTimeout(resolve, 1000)); });',
				'const sleep = ms => fetchWithDelay(ms);\nit(\'loads\', async () => { await sleep(10); });',
			],
			invalid: [
				{
					code: 'it(\'saves\', async () => { await new Promise(resolve => setTimeout(resolve, 100)); });',
					errors: [{ messageId: 'sleep' }],
				},
				{
					code: 'beforeEach(async () => { await new Promise(resolve => { setTimeout(() => resolve(), 20); }); });',
					errors: [{ messageId: 'sleep' }],
				},
				{
					code: 'import { setTimeout as sleep } from \'node:timers/promises\';\nit(\'saves\', async () => { await sleep(1200); });',
					errors: [{ messageId: 'sleep' }],
				},
				{
					code: 'const wait = ms => new Promise(resolve => { setTimeout(resolve, ms); });\nit(\'saves\', async () => { await wait(50); });',
					errors: [{ messageId: 'sleep' }],
				},
				{
					code: 'it(\'saves\', async () => { await settle(); });\nfunction settle() { return new Promise(resolve => setTimeout(resolve, 5)); }',
					errors: [{ messageId: 'sleep' }],
				},
				{
					code: 'test.each([1, 2])(\'saves %i\', async () => { await scheduler.wait(10); });',
					errors: [{ messageId: 'sleep' }],
				},
			],
		});
	});
});

describe('no-unsignaled-poll', () => {
	it('reports polls that only re-read spy or recorder state', () => {
		ruleTester.run('no-unsignaled-poll', plugin.rules['no-unsignaled-poll'], {
			valid: [
				'await vi.waitFor(() => expect(document.querySelector(\'.toast\')).not.toBeNull());',
				'await vi.waitFor(() => expect(status.value).toBe(\'ready\'));',
				'await vi.waitFor(() => expect(ref.current).toHaveBeenCalled());',
				'await expect.poll(() => document.body.textContent).toContain(\'Saved\');',
				'await expect.poll(() => rows()).toHaveLength(2);',
				'await vi.waitFor(() => { render(); expect(onSave).toHaveBeenCalled(); });',
			],
			invalid: [
				{ code: 'await vi.waitFor(() => expect(onSave).toHaveBeenCalledOnce());', errors: [{ messageId: 'poll' }] },
				{ code: 'await vi.waitFor(() => { expect(uploads.calls).toHaveLength(1); });', errors: [{ messageId: 'poll' }] },
				{ code: 'await vi.waitFor(() => expect(client.fetch).not.toHaveBeenCalledWith(\'/items\'));', errors: [{ messageId: 'poll' }] },
				{ code: 'await expect.poll(() => onSave.mock.calls).toHaveLength(1);', errors: [{ messageId: 'poll' }] },
				{ code: 'await expect.poll(() => uploads.calls).toHaveLength(2);', errors: [{ messageId: 'poll' }] },
				{ code: 'await expect.poll(() => queue.size).toBe(0);', errors: [{ messageId: 'poll' }] },
				{ code: 'await vi.waitFor(() => expect(store.items.length).toBeGreaterThan(0));', errors: [{ messageId: 'poll' }] },
			],
		});
	});
});

describe('no-fetch-stub', () => {
	it('reports replacing fetch and leaves observing spies alone', () => {
		typescriptRuleTester.run('no-fetch-stub', plugin.rules['no-fetch-stub'], {
			valid: [
				'const spy = vi.spyOn(globalThis, \'fetch\');',
				'vi.stubGlobal(\'matchMedia\', matchMedia);',
				'const original = globalThis.fetch;\nglobalThis.fetch = original;',
				'const client = { fetch: vi.fn() };\nclient.fetch.mockResolvedValue(response);',
				'vi.spyOn(api, \'fetch\').mockResolvedValue(response);',
			],
			invalid: [
				{ code: 'vi.stubGlobal(\'fetch\', fetchMock);', errors: [{ messageId: 'stub' }] },
				{ code: 'globalThis.fetch = (async () => Response.json([])) as typeof fetch;', errors: [{ messageId: 'stub' }] },
				{ code: 'window[\'fetch\'] = vi.fn();', errors: [{ messageId: 'stub' }] },
				{ code: 'vi.spyOn(globalThis, \'fetch\').mockRejectedValue(new Error(\'offline\'));', errors: [{ messageId: 'stub' }] },
				{
					code: 'const spy = vi.spyOn(window, \'fetch\');\nspy.mockResolvedValueOnce(response);',
					errors: [{ messageId: 'stub' }],
				},
				{
					// Restoring from something other than the saved original is another replacement.
					code: 'let original = globalThis.fetch;\nglobalThis.fetch = original;',
					errors: [{ messageId: 'stub' }],
				},
			],
		});
	});

	it('only runs in test files through the shipped config', async () => {
		const eslint = new ESLint({ overrideConfig: baseConfig, overrideConfigFile: true });
		const code = 'globalThis.fetch = instrumentedFetch;\n';
		const [sourceResult] = await eslint.lintText(code, { filePath: 'src/telemetry.js' });
		const [testResult] = await eslint.lintText(code, { filePath: 'test/telemetry.test.js' });
		const ruleIds = result => result.messages.map(message => message.ruleId);

		expect(ruleIds(sourceResult)).not.toContain('antislop-tests/no-fetch-stub');
		expect(ruleIds(testResult)).toContain('antislop-tests/no-fetch-stub');
	});
});

describe('plugin shape', () => {
	it('exposes metadata and is enabled in the base config', () => {
		expect(plugin.meta.name).toBe('eslint-plugin-nodecraft-antislop-tests');
		expect(plugin.meta.version).toBeTypeOf('string');

		const config = baseConfig.find(entry => entry.plugins?.['antislop-tests']);
		expect(config.plugins['antislop-tests']).toBe(plugin);
		expect(config.rules['antislop-tests/no-fixed-sleep']).toBe('error');
		expect(config.rules['antislop-tests/no-retry']).toBe('error');
		expect(config.rules['antislop-tests/no-unsignaled-poll']).toBe('error');
		expect(config.rules['antislop-tests/strict-msw']).toBe('error');
	});
});
