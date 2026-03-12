import base from './configs/base.js';
import json from './configs/json.js';
import node from './configs/node.js';
import typescript from './configs/typescript.js';

// Vue configs use optional peer dependencies — dynamically import to avoid
// failing when Vue deps aren't installed in non-Vue projects.
let vue3 = [];
let vueA11y = [];
try {
	({ default: vue3 } = await import('./configs/vue3.js'));
	({ default: vueA11y } = await import('./configs/vue-a11y.js'));
} catch {
	// Vue peer dependencies not installed
}

export default {
	configs: {
		base,
		json,
		node,
		vue3,
		vueA11y,
		typescript,
	},
};
