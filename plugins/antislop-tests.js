import pkg from '../package.json' with { type: 'json' };
import noFetchStub from './antislop-tests/no-fetch-stub.js';
import noFixedSleep from './antislop-tests/no-fixed-sleep.js';
import noRetry from './antislop-tests/no-retry.js';
import noUnsignaledPoll from './antislop-tests/no-unsignaled-poll.js';
import strictMsw from './antislop-tests/strict-msw.js';

export default {
	meta: {
		name: 'eslint-plugin-nodecraft-antislop-tests',
		version: pkg.version,
	},
	rules: {
		'no-fetch-stub': noFetchStub,
		'no-fixed-sleep': noFixedSleep,
		'no-retry': noRetry,
		'no-unsignaled-poll': noUnsignaledPoll,
		'strict-msw': strictMsw,
	},
};
