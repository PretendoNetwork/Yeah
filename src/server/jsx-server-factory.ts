export function createElement(tag: string, props: Record<string, any> | null, ...children: any[]): any {
	return { type: tag, props: { ...props, children } };
}

export function renderElement(element: any): string {
	if (typeof element === 'string' || typeof element === 'number') {
		return element.toString();
	}

	if (Array.isArray(element)) {
		return element.map(renderElement).join('');
	}

	if (element && typeof element.type === 'string') {
		const props = element.props || {};
		const children = element.children || props.children || [];
		const innerHTML = renderElement(children);

		if (props.className) {
			props.class = props.className;
			delete props.className;
		}

		const attrs = Object.keys(props)
			.filter(attr => attr !== 'children')
			.map(attr => `${attr}="${props[attr]}"`)
			.join(' ');

		return `<${element.type}${attrs ? ' ' + attrs : ''}>${innerHTML}</${element.type}>`;
	}

	return '';
}

export function renderPage(head: any, body: any): string {
	return `
	<html>
		<head>
			${renderElement(head)}
		</head>
		<body>
			${renderElement(body)}
		</body>
	</html>`;
}