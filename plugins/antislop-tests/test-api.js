export function memberName(node) {
	if (node?.type !== 'MemberExpression') {
		return null;
	}
	if (!node.computed && node.property.type === 'Identifier') {
		return node.property.name;
	}
	if (node.computed && node.property.type === 'Literal' && typeof node.property.value === 'string') {
		return node.property.value;
	}
	return null;
}

export function isMember(node, object, property) {
	return node?.type === 'MemberExpression'
		&& node.object.type === 'Identifier'
		&& node.object.name === object
		&& memberName(node) === property;
}

const CHAIN_TYPES = new Set(['CallExpression', 'MemberExpression', 'TaggedTemplateExpression']);

// `test.each([...])('name', fn)` and `it.concurrent.skip(...)` still root at the test function.
export function calleeRoot(node) {
	let current = node;
	while (CHAIN_TYPES.has(current.type)) {
		if (current.type === 'CallExpression') {
			current = current.callee;
		} else if (current.type === 'MemberExpression') {
			current = current.object;
		} else {
			current = current.tag;
		}
	}
	return current.type === 'Identifier' ? current.name : null;
}

export function propertyKey(property) {
	if (property.type !== 'Property' || property.computed) {
		return null;
	}
	if (property.key.type === 'Identifier') {
		return property.key.name;
	}
	return property.key.type === 'Literal' ? String(property.key.value) : null;
}
