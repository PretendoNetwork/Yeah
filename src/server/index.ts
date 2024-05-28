import { renderPage } from './jsx-server-factory';
export { createElement } from './jsx-server-factory';

interface ViewOptions {
	[key: string]: any;
}

export async function renderFile(filePath: string, options: ViewOptions, callback: (err: Error | unknown | null, html?: string) => void) {
	try {
		const props = Object.assign({}, options);

		delete props.settings; // * Delete Express config settings

		const { Head, Body } = await import(filePath);
		const html = renderPage(Head(props), Body(props));

		callback(null, html);
	} catch (error: unknown) {
		callback(error);
	}
}
