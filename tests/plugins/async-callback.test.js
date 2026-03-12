import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';

import plugin from '../../plugins/async-callback.js';

const rule = plugin.rules['no-missing-callback'];

const moduleRuleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
});

const scriptRuleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'script',
	},
});

// ── async.series ────────────────────────────────────────────────────────────

describe('async.series', () => {
	it('valid and invalid cases', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import async from 'async';
						async.series([
							function(callback) { callback(); },
							function(done) { done(null, 1); },
						]);
					`,
				},
				{
					code: `
						import async from 'async';
						async.series([
							(cb) => { cb(); },
							(next) => { next(null, 'result'); },
						]);
					`,
				},
				// Callback passed to another function
				{
					code: `
						import async from 'async';
						async.series([
							function(callback) { doSomething(callback); },
						]);
					`,
				},
			],
			invalid: [
				{
					code: `
						import async from 'async';
						async.series([
							function(callback) { doSomething(); },
						]);
					`,
					errors: [{ messageId: 'missingCallback' }],
				},
				{
					code: `
						import async from 'async';
						async.series([
							(cb) => { doSomething(); },
						]);
					`,
					errors: [{ messageId: 'missingCallback' }],
				},
				// Multiple tasks, one missing callback
				{
					code: `
						import async from 'async';
						async.series([
							function(callback) { callback(); },
							function(done) { doSomething(); },
						]);
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'done', methodName: 'series' } }],
				},
			],
		});
	});
});

// ── async.parallel ──────────────────────────────────────────────────────────

describe('async.parallel', () => {
	it('valid and invalid cases', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import async from 'async';
						async.parallel([
							function(callback) { callback(null, 'one'); },
							function(callback) { callback(null, 'two'); },
						]);
					`,
				},
			],
			invalid: [
				{
					code: `
						import async from 'async';
						async.parallel([
							function(callback) { doSomething(); },
							function(done) { done(); },
						]);
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'callback', methodName: 'parallel' } }],
				},
			],
		});
	});
});

// ── async.waterfall ─────────────────────────────────────────────────────────

describe('async.waterfall', () => {
	it('valid and invalid cases', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import async from 'async';
						async.waterfall([
							function(callback) { callback(null, 'one'); },
							function(arg1, callback) { callback(null, arg1 + ' two'); },
							function(arg1, callback) { callback(null, 'done'); },
						]);
					`,
				},
			],
			invalid: [
				{
					code: `
						import async from 'async';
						async.waterfall([
							function(callback) { callback(null, 'one'); },
							function(arg1, callback) { doSomething(arg1); },
						]);
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'callback', methodName: 'waterfall' } }],
				},
			],
		});
	});
});

// ── async.each / eachSeries / eachLimit ─────────────────────────────────────

describe('async.each variants', () => {
	it('valid and invalid cases', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import async from 'async';
						async.each(items, function(item, callback) { callback(); });
					`,
				},
				{
					code: `
						import async from 'async';
						async.eachSeries(items, (item, done) => { done(); });
					`,
				},
				{
					code: `
						import async from 'async';
						async.eachLimit(items, 5, function(item, callback) { callback(); });
					`,
				},
				{
					code: `
						import async from 'async';
						async.eachOf(obj, function(value, key, callback) { callback(); });
					`,
				},
			],
			invalid: [
				{
					code: `
						import async from 'async';
						async.each(items, function(item, callback) { process(item); });
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'callback', methodName: 'each' } }],
				},
				{
					code: `
						import async from 'async';
						async.eachSeries(items, (item, done) => { process(item); });
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'done', methodName: 'eachSeries' } }],
				},
				{
					code: `
						import async from 'async';
						async.eachLimit(items, 5, function(item, callback) { process(item); });
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'callback', methodName: 'eachLimit' } }],
				},
			],
		});
	});
});

// ── async.map / mapSeries / mapLimit ────────────────────────────────────────

describe('async.map variants', () => {
	it('valid and invalid cases', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import async from 'async';
						async.map(items, function(item, callback) { callback(null, item * 2); });
					`,
				},
				{
					code: `
						import async from 'async';
						async.mapSeries(items, (item, cb) => { cb(null, item); });
					`,
				},
				{
					code: `
						import async from 'async';
						async.mapLimit(items, 3, (item, cb) => { cb(null, item); });
					`,
				},
			],
			invalid: [
				{
					code: `
						import async from 'async';
						async.map(items, function(item, callback) { return item * 2; });
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'callback', methodName: 'map' } }],
				},
				{
					code: `
						import async from 'async';
						async.mapLimit(items, 3, function(item, callback) { return item; });
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'callback', methodName: 'mapLimit' } }],
				},
			],
		});
	});
});

// ── async.filter / detect / some / every / reject / concat / sortBy ─────────

describe('async collection methods', () => {
	it('valid and invalid cases', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import async from 'async';
						async.filter(items, function(item, callback) { callback(null, true); });
					`,
				},
				{
					code: `
						import async from 'async';
						async.detect(items, function(item, callback) { callback(null, item > 3); });
					`,
				},
				{
					code: `
						import async from 'async';
						async.some(items, (item, cb) => { cb(null, item > 0); });
					`,
				},
				{
					code: `
						import async from 'async';
						async.every(items, (item, cb) => { cb(null, item > 0); });
					`,
				},
				{
					code: `
						import async from 'async';
						async.sortBy(items, (item, cb) => { cb(null, item.name); });
					`,
				},
				{
					code: `
						import async from 'async';
						async.groupBy(items, (item, cb) => { cb(null, item.category); });
					`,
				},
			],
			invalid: [
				{
					code: `
						import async from 'async';
						async.filter(items, function(item, callback) { return item > 3; });
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'callback', methodName: 'filter' } }],
				},
				{
					code: `
						import async from 'async';
						async.reject(items, function(item, callback) { return item < 0; });
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'callback', methodName: 'reject' } }],
				},
			],
		});
	});
});

// ── async.reduce ────────────────────────────────────────────────────────────

describe('async.reduce', () => {
	it('valid and invalid cases', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import async from 'async';
						async.reduce(items, 0, function(memo, item, callback) { callback(null, memo + item); });
					`,
				},
			],
			invalid: [
				{
					code: `
						import async from 'async';
						async.reduce(items, 0, function(memo, item, callback) { return memo + item; });
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'callback', methodName: 'reduce' } }],
				},
			],
		});
	});
});

// ── async.auto ──────────────────────────────────────────────────────────────

describe('async.auto', () => {
	it('valid and invalid cases', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				// Simple function tasks
				{
					code: `
						import async from 'async';
						async.auto({
							task1: function(callback) { callback(null, 'one'); },
							task2: function(callback) { callback(null, 'two'); },
						});
					`,
				},
				// Array dependency syntax
				{
					code: `
						import async from 'async';
						async.auto({
							task1: function(callback) { callback(null, 'one'); },
							task2: ['task1', function(results, callback) { callback(null, 'two'); }],
						});
					`,
				},
			],
			invalid: [
				{
					code: `
						import async from 'async';
						async.auto({
							task1: function(callback) { callback(null, 'one'); },
							task2: function(callback) { doSomething(); },
						});
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'callback', methodName: 'auto' } }],
				},
				// Missing callback in array dependency syntax
				{
					code: `
						import async from 'async';
						async.auto({
							task1: function(callback) { callback(null); },
							task2: ['task1', function(results, callback) { doSomething(results); }],
						});
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'callback', methodName: 'auto' } }],
				},
			],
		});
	});
});

// ── async.times / timesSeries / timesLimit ──────────────────────────────────

describe('async.times variants', () => {
	it('valid and invalid cases', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import async from 'async';
						async.times(5, function(n, callback) { callback(null, n); });
					`,
				},
			],
			invalid: [
				{
					code: `
						import async from 'async';
						async.times(5, function(n, callback) { doSomething(n); });
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'callback', methodName: 'times' } }],
				},
			],
		});
	});
});

// ── Control flow: forever, whilst, doWhilst, until, doUntil, retry ──────────

describe('async control flow methods', () => {
	it('valid and invalid cases', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import async from 'async';
						async.forever(function(next) { next(); });
					`,
				},
				{
					code: `
						import async from 'async';
						async.whilst(test, function(callback) { callback(); });
					`,
				},
				{
					code: `
						import async from 'async';
						async.doWhilst(function(callback) { callback(); }, test);
					`,
				},
				{
					code: `
						import async from 'async';
						async.until(test, function(callback) { callback(); });
					`,
				},
				{
					code: `
						import async from 'async';
						async.doUntil(function(callback) { callback(); }, test);
					`,
				},
				{
					code: `
						import async from 'async';
						async.retry(function(callback) { callback(); });
					`,
				},
			],
			invalid: [
				{
					code: `
						import async from 'async';
						async.forever(function(next) { doSomething(); });
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'next', methodName: 'forever' } }],
				},
				{
					code: `
						import async from 'async';
						async.whilst(test, function(callback) { doSomething(); });
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'callback', methodName: 'whilst' } }],
				},
				{
					code: `
						import async from 'async';
						async.doWhilst(function(callback) { doSomething(); }, test);
					`,
					errors: [{ messageId: 'missingCallback', data: { name: 'callback', methodName: 'doWhilst' } }],
				},
			],
		});
	});
});

// ── Import patterns ─────────────────────────────────────────────────────────

describe('import patterns', () => {
	it('default import', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import async from 'async';
						async.each(items, function(item, cb) { cb(); });
					`,
				},
			],
			invalid: [
				{
					code: `
						import async from 'async';
						async.each(items, function(item, cb) { process(item); });
					`,
					errors: [{ messageId: 'missingCallback' }],
				},
			],
		});
	});

	it('renamed default import', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import asyncLib from 'async';
						asyncLib.each(items, function(item, cb) { cb(); });
					`,
				},
			],
			invalid: [
				{
					code: `
						import asyncLib from 'async';
						asyncLib.each(items, function(item, cb) { process(item); });
					`,
					errors: [{ messageId: 'missingCallback' }],
				},
			],
		});
	});

	it('namespace import', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import * as asyncLib from 'async';
						asyncLib.each(items, function(item, cb) { cb(); });
					`,
				},
			],
			invalid: [
				{
					code: `
						import * as asyncLib from 'async';
						asyncLib.each(items, function(item, cb) { process(item); });
					`,
					errors: [{ messageId: 'missingCallback' }],
				},
			],
		});
	});

	it('named imports (destructured)', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import { each, series } from 'async';
						each(items, function(item, cb) { cb(); });
						series([function(callback) { callback(); }]);
					`,
				},
			],
			invalid: [
				{
					code: `
						import { each } from 'async';
						each(items, function(item, cb) { process(item); });
					`,
					errors: [{ messageId: 'missingCallback' }],
				},
				{
					code: `
						import { series } from 'async';
						series([function(callback) { doSomething(); }]);
					`,
					errors: [{ messageId: 'missingCallback' }],
				},
			],
		});
	});

	it('renamed named imports', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import { each as asyncEach } from 'async';
						asyncEach(items, function(item, cb) { cb(); });
					`,
				},
			],
			invalid: [
				{
					code: `
						import { each as asyncEach } from 'async';
						asyncEach(items, function(item, cb) { process(item); });
					`,
					errors: [{ messageId: 'missingCallback' }],
				},
			],
		});
	});
});

// ── Require patterns ────────────────────────────────────────────────────────

describe('require patterns', () => {
	it('default require', () => {
		scriptRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						var async = require('async');
						async.each(items, function(item, cb) { cb(); });
					`,
				},
			],
			invalid: [
				{
					code: `
						var async = require('async');
						async.each(items, function(item, cb) { process(item); });
					`,
					errors: [{ messageId: 'missingCallback' }],
				},
			],
		});
	});

	it('renamed require', () => {
		scriptRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						var asyncLib = require('async');
						asyncLib.each(items, function(item, cb) { cb(); });
					`,
				},
			],
			invalid: [
				{
					code: `
						var asyncLib = require('async');
						asyncLib.each(items, function(item, cb) { process(item); });
					`,
					errors: [{ messageId: 'missingCallback' }],
				},
			],
		});
	});

	it('destructured require', () => {
		scriptRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						var { each, series } = require('async');
						each(items, function(item, cb) { cb(); });
						series([function(callback) { callback(); }]);
					`,
				},
			],
			invalid: [
				{
					code: `
						var { each } = require('async');
						each(items, function(item, cb) { process(item); });
					`,
					errors: [{ messageId: 'missingCallback' }],
				},
			],
		});
	});
});

// ── Bare 'async' identifier (global/untracked) ─────────────────────────────

describe('bare async identifier fallback', () => {
	it('matches calls on identifier literally named async', () => {
		scriptRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						async.each(items, function(item, cb) { cb(); });
					`,
				},
			],
			invalid: [
				{
					code: `
						async.each(items, function(item, cb) { process(item); });
					`,
					errors: [{ messageId: 'missingCallback' }],
				},
			],
		});
	});
});

// ── Edge cases ──────────────────────────────────────────────────────────────

describe('edge cases', () => {
	it('ignores non-async library calls', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				// Not an async library method
				{
					code: `
						import foo from 'foo';
						foo.each(items, function(item, cb) { process(item); });
					`,
				},
				// Unknown method on async
				{
					code: `
						import async from 'async';
						async.unknownMethod(items, function(item, cb) { process(item); });
					`,
				},
			],
			invalid: [],
		});
	});

	it('ignores functions with no params', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				{
					code: `
						import async from 'async';
						async.series([function() { doSomething(); }]);
					`,
				},
			],
			invalid: [],
		});
	});

	it('ignores non-function arguments', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				// Variable reference instead of inline function
				{
					code: `
						import async from 'async';
						async.each(items, processItem);
					`,
				},
				// Non-array argument to series
				{
					code: `
						import async from 'async';
						async.series(taskObject);
					`,
				},
			],
			invalid: [],
		});
	});

	it('handles callback in nested function calls', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				// Callback called inside a nested callback
				{
					code: `
						import async from 'async';
						async.each(items, function(item, done) {
							fs.readFile(item, function(err, data) {
								done(err, data);
							});
						});
					`,
				},
				// Callback used in a conditional
				{
					code: `
						import async from 'async';
						async.each(items, function(item, done) {
							if (item) {
								done(null, item);
							} else {
								done(new Error('missing'));
							}
						});
					`,
				},
				// Callback used with return
				{
					code: `
						import async from 'async';
						async.each(items, function(item, done) {
							if (!item) {
								return done(new Error('bad'));
							}
							process(item);
							return done();
						});
					`,
				},
			],
			invalid: [],
		});
	});

	it('handles rest params and destructuring gracefully', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [
				// Rest params - last param is not a simple identifier, so rule skips it
				{
					code: `
						import async from 'async';
						async.each(items, function(item, ...args) { doSomething(); });
					`,
				},
				// Destructured last param - rule skips it
				{
					code: `
						import async from 'async';
						async.each(items, function(item, { done }) { doSomething(); });
					`,
				},
			],
			invalid: [],
		});
	});

	it('handles mixed valid and invalid in same series call', () => {
		moduleRuleTester.run('no-missing-callback', rule, {
			valid: [],
			invalid: [
				{
					code: `
						import async from 'async';
						async.series([
							function(cb) { cb(); },
							function(cb) { doSomething(); },
							function(cb) { cb(); },
							function(cb) { doSomethingElse(); },
						]);
					`,
					errors: [
						{ messageId: 'missingCallback', data: { name: 'cb', methodName: 'series' } },
						{ messageId: 'missingCallback', data: { name: 'cb', methodName: 'series' } },
					],
				},
			],
		});
	});
});
