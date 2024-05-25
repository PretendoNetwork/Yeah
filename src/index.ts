export function createElement(tag: string, props: Record<string, any> | null, ...children: any[]): Element {
	const element = document.createElement(tag);

	if (props) {
		for (const attr in props) {
			const value = props[attr];

			if (attr === 'className') {
				element.setAttribute('class', value);
			} else if (attr.startsWith('on') && typeof value === 'function') {
				element.addEventListener(attr.substring(2).toLowerCase(), value);
			} else {
				element.setAttribute(attr, value);
			}
		}
	}

	addChildren(element, children);

	return element;
}

function addChildren(parent: Element, children: any[]) {
	children.forEach(child => {
		addChild(parent, child);
	});
}

function addChild(parent: Element, child: any) {
	if (Array.isArray(child)) {
		addChildren(parent, child);
	} else if (child instanceof Element) {
		parent.appendChild(child);
	} else if (isJSX(child)) {
		parent.appendChild(createElement(child.type, child.props, ...child.props.children));
	} else if (child !== null && child !== undefined) {
		parent.appendChild(document.createTextNode(child.toString()));
	}
}

function isJSX(input: any) {
	return typeof input === 'object' && input !== null && 'type' in input && 'props' in input;
}