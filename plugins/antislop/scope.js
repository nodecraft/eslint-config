export function findVariable(context, identifier) {
	let scope = context.sourceCode.getScope(identifier);
	while (scope) {
		const variable = scope.set.get(identifier.name);
		if (variable) {
			return variable;
		}
		scope = scope.upper;
	}
	return null;
}
