import type { Linter } from 'eslint';

declare const nodecraft: {
	configs: {
		base: Linter.Config[];
		json: Linter.Config[];
		node: Linter.Config[];
		typescript: Linter.Config[];
		// Empty when the optional Vue peer dependencies aren't installed.
		vue3: Linter.Config[];
		vueA11y: Linter.Config[];
	};
};
export default nodecraft;
