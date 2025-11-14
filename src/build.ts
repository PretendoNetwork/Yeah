import path from 'node:path';
import fs from 'fs-extra';
import { glob } from 'glob';
import tsup from 'tsup';
import colors from 'colors';
import type { Options } from 'tsup';

type RouteDefinition = {
	importName: string;
	importPath: string;
	route: string;
	method: string;
	hasMiddleware: boolean;
};

type PageRouteDefinition = RouteDefinition & {
	customLayout?: string;
	hasClientScript: boolean;
};

type ServerRouteDefinition = RouteDefinition & {
	routeFunctionName: string;
};

type LayoutDefinition = {
	name: string;
	importName: string;
	importPath: string;
};

colors.enable();

const VALID_ERROR_FILES = [
	'error',

	'400', '401', '402', '403', '404', '405', '406', '407', '408',
	'409', '410', '411', '412', '413', '414', '415', '416', '417',
	'418', '421', '422', '423', '424', '425', '426', '428', '429',

	'431', '451',
	'500', '501', '502', '503', '504', '505', '506', '507', '508',
	'510', '511'
];

// TODO - This can probably be improved I kinda suck at tsup configs
const tsupCommonConfig: Options = {
	bundle: true, // * Needed to make tsup automatically update local imports to use mjs
	splitting: true,
	sourcemap: true,
	platform: 'node',
	format: ['esm'],
	silent: true,
	clean: false
};

async function transpile(appRoot: string): Promise<void> {
	const distPath = path.join(appRoot, 'dist');
	if (fs.existsSync(distPath)) {
		fs.rmSync(distPath, { recursive: true });
	}

	const pagesEntry = await glob(path.join(appRoot, 'src/pages/**/*.{tsx,ts}'));
	const serverRoutesEntry = await glob(path.join(appRoot, 'src/server/**/*.{tsx,ts}'));
	const middlewareEntry = await glob(path.join(appRoot, 'src/middleware/**/*.{tsx,ts}'));
	const remainingEntry = await glob(path.join(appRoot, 'src/**/*.{tsx,ts}'), {
		ignore: [
			'**/pages/**',
			'**/server/**',
			'**/middleware/**'
		]
	});

	if (pagesEntry.length) {
		await tsup.build({
			entry: pagesEntry,
			...tsupCommonConfig,
			outDir: path.join(appRoot, 'dist/pages'),
			esbuildOptions(options) {
				// * Needed for some reason to preserve folder structure for remaining files
				options.outbase = path.join(appRoot, 'src/pages');
			}
		});
	}

	if (serverRoutesEntry.length) {
		await tsup.build({
			entry: serverRoutesEntry,
			...tsupCommonConfig,
			outDir: path.join(appRoot, 'dist/server'),
			esbuildOptions(options) {
				// * Needed for some reason to preserve folder structure for remaining files
				options.outbase = path.join(appRoot, 'src/server');
			}
		});
	}

	if (middlewareEntry.length) {
		await tsup.build({
			entry: middlewareEntry,
			...tsupCommonConfig,
			outDir: path.join(appRoot, 'dist/middleware'),
			esbuildOptions(options) {
				// * Needed for some reason to preserve folder structure for remaining files
				options.outbase = path.join(appRoot, 'src/middleware');
			}
		});
	}

	if (remainingEntry.length) {
		await tsup.build({
			entry: remainingEntry,
			...tsupCommonConfig,
			outDir: path.join(appRoot, 'dist'),
			esbuildOptions(options) {
				// * Needed for some reason to preserve folder structure for remaining files
				options.outbase = path.join(appRoot, 'src');
			}
		});
	}

	await tsup.build({
		entry: [path.join(appRoot, 'yeah.config.ts')],
		...tsupCommonConfig,
		bundle: false,
		outDir: path.join(appRoot, 'dist')
	});
}

export async function build(appRoot: string): Promise<void> {
	// * The bulk of the "building" is just tsup. All we really do after that
	// * is generate a basic Express app
	await transpile(appRoot);

	const pagesPath = path.join(appRoot, 'src', 'pages');
	const serverRoutesPath = path.join(appRoot, 'src', 'server');
	const layoutsPath = path.join(appRoot, 'src', 'layouts');
	const publicPath = path.join(appRoot, 'src', 'public');

	const pages = await glob(path.join(pagesPath, '**/*.tsx'));
	const serverRoutes = await glob(path.join(serverRoutesPath, '**/*.ts'));
	const layouts = await glob(path.join(layoutsPath, '**/*.tsx'));

	const pageRouteDefinitions = await createPageRouteDefinitions(appRoot, pages);
	const serverRouteDefinitions = await createServerRouteDefinitions(appRoot, serverRoutes);
	const layoutDefinitions = await createLayoutDefinitions(appRoot, layouts);
	const allRouteDefinitions = [...pageRouteDefinitions, ...serverRouteDefinitions];

	for (const pageRouteDefinition of pageRouteDefinitions) {
		for (const serverRouteDefinition of serverRouteDefinitions) {
			if (pageRouteDefinition.route === serverRouteDefinition.route && pageRouteDefinition.method === serverRouteDefinition.method) {
				console.log('[Error]'.red, `Route ${pageRouteDefinition.method.toUpperCase()} ${pageRouteDefinition.route} is defined by both a page and server route.`.yellow);
				process.exit();
			}
		}

		if (pageRouteDefinition.customLayout) {
			const layout = layoutDefinitions.find(layoutDefinition => layoutDefinition.name === pageRouteDefinition.customLayout);
			if (!layout) {
				console.log('[Error]'.red, `Page ${pageRouteDefinition.method.toUpperCase()} ${pageRouteDefinition.route} uses missing layout '${pageRouteDefinition.customLayout}'.`.yellow);
				process.exit();
			}
		}
	}

	const seenRoutes = new Set();
	let defaultLayoutRequired = false;

	for (const routeDefinition of allRouteDefinitions) {
		if ('customLayout' in routeDefinition && !routeDefinition.customLayout) {
			defaultLayoutRequired = true;
		}

		let isDuplicate = false;

		if (
			routeDefinition.method === 'all' &&
			(
				seenRoutes.has(`get_${routeDefinition.route}`) ||
				seenRoutes.has(`post_${routeDefinition.route}`) ||
				seenRoutes.has(`put_${routeDefinition.route}`) ||
				seenRoutes.has(`delete_${routeDefinition.route}`)
			)
		) {
			isDuplicate = true;
		} else if (seenRoutes.has(`${routeDefinition.method}_${routeDefinition.route}`)) {
			isDuplicate = true;
		}

		if (isDuplicate) {
			console.log('[Error]'.red, `Found duplicate '${routeDefinition.method}' handler for route '${routeDefinition.route}'.`.yellow);
			process.exit();
		}

		if (routeDefinition.method === 'all') {
			seenRoutes.add(`get_${routeDefinition.route}`);
			seenRoutes.add(`post_${routeDefinition.route}`);
			seenRoutes.add(`put_${routeDefinition.route}`);
			seenRoutes.add(`delete_${routeDefinition.route}`);
		} else {
			seenRoutes.add(`${routeDefinition.method}_${routeDefinition.route}`);
		}
	}

	if (defaultLayoutRequired) {
		const defaultLayoutPath = path.join(appRoot, 'src', 'App.tsx');
		if (!fs.pathExistsSync(defaultLayoutPath)) {
			console.log('[Error]'.red, 'Some pages require the default \'src/App.tsx\' layout, but one was not provided.'.yellow);
			process.exit();
		}

		const defaultLayoutModule = await import(defaultLayoutPath);
		if (typeof defaultLayoutModule.default !== 'function') {
			console.log('[Error]'.red, 'Some pages require the default \'src/App.tsx\' layout, it does not have a default export.'.yellow);
			process.exit();
		}
	}

	const errorPages: string[] = [];

	for (const fileName of VALID_ERROR_FILES) {
		const pagePath = path.join(appRoot, `src/pages/_${fileName}.tsx`);

		if (fs.existsSync(pagePath)) {
			errorPages.push(fileName);
		}
	}

	let server = 'import url from \'node:url\';\n';
	server += 'import path from \'node:path\';\n';
	server += 'import express from \'express\';\n';
	server += 'import React from \'react\';\n';
	server += 'import { renderToString } from \'react-dom/server\';\n';
	server += 'import yeahConfig from \'./yeah.config.mjs\';\n';

	if (defaultLayoutRequired) {
		server += 'import DefaultLayout from \'./App.mjs\';\n';
	}

	for (const layoutDefinition of layoutDefinitions) {
		server += `import ${layoutDefinition.importName} from './${layoutDefinition.importPath}';\n`;
	}

	for (const routeDefinition of pageRouteDefinitions) {
		server += `import * as ${routeDefinition.importName} from './${routeDefinition.importPath}';\n`;
	}

	// * Server route files can export multiple handlers for different
	// * HTTP methods, so ensure they only get imported once
	const seenImports = new Set();
	for (const routeDefinition of serverRouteDefinitions) {
		if (seenImports.has(routeDefinition.importPath)) {
			continue;
		}

		server += `import * as ${routeDefinition.importName} from './${routeDefinition.importPath}';\n`;
		seenImports.add(routeDefinition.importPath);
	}

	for (const fileName of errorPages) {
		server += `import error_${fileName}Handler from './pages/_${fileName}.mjs';\n`;
		server += `globalThis.error_${fileName}Handler = error_${fileName}Handler;\n`;
	}

	server += '\n';
	server += 'const __filename = url.fileURLToPath(import.meta.url);\n';
	server += 'const __dirname = path.dirname(__filename);\n';
	server += '\n';

	server += 'async function runMiddleware(middlewares, ctx) {\n';
	server += '\tfor (const middleware of middlewares) {\n';
	server += '\t\tlet shouldContinue = true;\n';
	server += '\t\tlet nextCalled = false;\n';
	server += '\t\tctx.next = () => {\n';
	server += '\t\t\tnextCalled = true;\n';
	server += '\t\t};\n';
	server += '\t\tawait middleware(ctx);\n';
	server += '\t\tif (!nextCalled && !ctx.response.headersSent) {\n';
	server += '\t\t\tshouldContinue = false;\n';
	server += '\t\t}\n';
	server += '\t\tif (ctx.response.headersSent || !shouldContinue) {\n';
	server += '\t\t\treturn false;\n';
	server += '\t\t}\n';
	server += '\t}\n';
	server += '\treturn true;\n';
	server += '}\n';

	server += '\n';
	server += 'const app = express();\n';

	for (const routeDefinition of pageRouteDefinitions) {
		server += `app.${routeDefinition.method}('${routeDefinition.route}', async (request, response) => {\n`;
		server += '\tconst ctx = { request, response, data: {} };\n';
		server += '\ttry {\n';

		if (routeDefinition.hasMiddleware) {
			server += `\t\tconst shouldContinue = await runMiddleware(${routeDefinition.importName}.config.middleware, ctx);\n`;
			server += '\t\tif (!shouldContinue) {\n';
			server += '\t\t\treturn;\n';
			server += '\t\t}\n';
		}

		server += '\t\tconst isPartial = request.headers[\'hx-request\'] === \'true\' || request.headers[\'nwfx-request\'] === \'true\';\n';
		server += `\t\tlet jsx = isPartial ? await ${routeDefinition.importName}.Partial(ctx) : await ${routeDefinition.importName}.Page(ctx);\n`;

		if (routeDefinition.hasClientScript) {
			server += `\t\tconst scriptContent = ${routeDefinition.importName}.ClientScript.toString();\n`;
			server += '\t\tconst scriptTag = React.createElement(\'script\', { dangerouslySetInnerHTML: { __html: `(${scriptContent})()` } });\n';
			server += '\t\tjsx = React.createElement(React.Fragment, null, jsx, scriptTag);\n';
		}

		server += '\t\tlet html = \'\';\n';
		server += '\t\tif (isPartial) {\n';
		server += `\t\t\thtml = renderToString(jsx);\n`;
		server += '\t\t} else {\n';

		if (routeDefinition.customLayout) {
			const layout = layoutDefinitions.find(layoutDefinition => layoutDefinition.name === routeDefinition.customLayout)!;
			server += `\t\t\thtml = renderToString(${layout.importName}({ children: jsx }));\n`;
		} else {
			server += '\t\t\thtml = renderToString(DefaultLayout({ children: jsx }));\n';
		}

		server += '\t\t}\n';
		server += '\t\tif (!ctx.response.headersSent) {\n';
		server += '\t\t\tresponse.send(html);\n';
		server += '\t\t}\n';

		server += '\t} catch (e) {\n';
		server += '\t\tif (ctx.response.headersSent) {\n';
		server += '\t\t\treturn;\n';
		server += '\t\t}\n';
		server += '\t\tlet html = \'\';\n';
		server += '\t\tif (e.statusCode && globalThis[`error_${e.statusCode}Handler`]) {\n';
		server += '\t\t\thtml = renderToString(globalThis[`error_${e.statusCode}Handler`]({ children: e.jsx ? e.jsx : e.message }));\n';
		server += '\t\t} else if (globalThis[\'error_errorHandler\']) {\n';
		server += '\t\t\thtml = renderToString(globalThis[\'error_errorHandler\']({ children: e.jsx ? e.jsx : e.message }));\n';
		server += '\t\t} else {\n';
		server += '\t\t\thtml = e.jsx ? renderToString(e.jsx) : e.message;\n';
		server += '\t\t}\n';
		server += '\t\tresponse.status(e.statusCode || 500).send(html);\n';
		server += '\t}\n';
		server += '});\n';
	}

	server += '\n';

	for (const routeDefinition of serverRouteDefinitions) {
		server += `app.${routeDefinition.method}('${routeDefinition.route}', async (request, response) => {\n`;
		server += '\tconst ctx = { request, response, data: {} };\n';

		if (routeDefinition.hasMiddleware) {
			server += `\tconst shouldContinue = await runMiddleware(${routeDefinition.importName}.config.middleware, ctx);\n`;
			server += '\tif (!shouldContinue) {\n';
			server += '\t\treturn;\n';
			server += '\t}\n';
		}

		server += `\tawait ${routeDefinition.importName}.${routeDefinition.routeFunctionName}(ctx);\n`;
		server += '});\n';
	}

	if (fs.pathExistsSync(publicPath)) {
		fs.cpSync(publicPath, path.join(appRoot, 'dist', 'public'), { recursive: true });
		server += 'app.use(express.static(path.join(__dirname, \'public\')));\n';
	}

	server += 'app.use(async (request, response, next) => {\n';
	server += '\tlet html = \'\';\n';
	server += '\tif (globalThis[\'error_404Handler\']) {\n';
	server += '\t\thtml = renderToString(globalThis[\'error_404Handler\']({ children: \'Page not found\' }));\n';
	server += '\t} else {\n';
	server += '\t\thtml = \'Not Found\';\n';
	server += '\t}\n';
	server += '\tresponse.status(404).send(html);\n';
	server += '});\n';

	server += '\n';
	server += 'if (yeahConfig.configureServer) {\n';
	server += '\tawait yeahConfig.configureServer(app);\n';
	server += '}\n';
	server += 'app.listen(yeahConfig.port || 3000);\n';

	fs.writeFileSync(path.join(appRoot, 'dist', 'server.mjs'), server);
}

function pathToRoute(prefix: string, filePath: string): string {
	const relativePath = path.relative(prefix, filePath);
	const parsedPath = path.parse(relativePath);
	const withoutExtension = path.join(parsedPath.dir, parsedPath.name);
	let route = withoutExtension.replace(/\[(\w+)\]/g, ':$1');

	if (route.endsWith('/index')) {
		route = route.slice(0, -6);
	} else if (route.endsWith('.all')) {
		route = route.slice(0, -4);
	} else if (route.endsWith('.get')) {
		route = route.slice(0, -4);
	} else if (route.endsWith('.post')) {
		route = route.slice(0, -5);
	} else if (route.endsWith('.put')) {
		route = route.slice(0, -5);
	} else if (route.endsWith('.delete')) {
		route = route.slice(0, -7);
	}

	return `/${route}`;
}

function fileNameToHTTPMethod(fileName: string): string {
	const matches = fileName.match(/\.(all|get|post|put|delete)\.(?:ts|tsx)$/);
	if (matches) {
		return matches[1];
	}

	return 'all';
}

async function createPageRouteDefinitions(appRoot: string, pages: string[]): Promise<PageRouteDefinition[]> {
	const pagesRoot = path.join(appRoot, 'src');
	const definitions: PageRouteDefinition[] = [];

	generate_page: for (const fullPath of pages) {
		for (const errorFileName of VALID_ERROR_FILES) {
			if (fullPath.endsWith(`/_${errorFileName}.tsx`)) {
				continue generate_page;
			}
		}

		const routeModule = await import(fullPath);

		if (typeof routeModule.Page !== 'function') {
			console.log('[Error]'.red, `Page ${fullPath} does not have the required 'Page' JSX component exported.`.yellow);
			process.exit();
		}

		if (typeof routeModule.Partial !== 'function') {
			console.log(`[Warning] Page ${fullPath} does not have the optional 'Partial' JSX component exported.`.yellow);
		}

		const relativePath = path.relative(pagesRoot, fullPath);
		const parsedPath = path.parse(relativePath);
		const importName = `page_${parsedPath.dir.replace(/\//g, '_')}_${parsedPath.name}`.replace(/[^a-zA-Z0-9_$]/g, '_');
		const importPath = path.format({
			dir: parsedPath.dir,
			name: parsedPath.name,
			ext: '.mjs'
		});
		const route = pathToRoute('pages', relativePath);
		const method = fileNameToHTTPMethod(relativePath);

		definitions.push({
			importName,
			importPath,
			route,
			method,
			hasMiddleware: !!routeModule?.config?.middleware?.length,
			customLayout: routeModule?.config?.layout,
			hasClientScript: typeof routeModule.ClientScript === 'function'
		});
	}

	return definitions;
}

async function createServerRouteDefinitions(appRoot: string, serverRoutes: string[]): Promise<ServerRouteDefinition[]> {
	const serverRoutesRoot = path.join(appRoot, 'src');
	const definitions: ServerRouteDefinition[] = [];

	for (const fullPath of serverRoutes) {
		const routeModule = await import(fullPath);
		const tempDefinitions: ServerRouteDefinition[] = [];

		const relativePath = path.relative(serverRoutesRoot, fullPath);
		const parsedPath = path.parse(relativePath);
		const importName = `server_${parsedPath.dir.replace(/\//g, '_')}_${parsedPath.name}`.replace(/[^a-zA-Z0-9_$]/g, '_');
		const importPath = path.format({
			dir: parsedPath.dir,
			name: parsedPath.name,
			ext: '.mjs'
		});
		const route = pathToRoute('server', relativePath);
		const method = fileNameToHTTPMethod(relativePath);
		const hasMiddleware = !!routeModule?.config?.middleware?.length;

		if (typeof routeModule.Get === 'function') {
			tempDefinitions.push({
				importName,
				importPath,
				route,
				method: 'get',
				routeFunctionName: 'Get',
				hasMiddleware
			});
		}

		if (typeof routeModule.Post === 'function') {
			tempDefinitions.push({
				importName,
				importPath,
				route,
				method: 'post',
				routeFunctionName: 'Post',
				hasMiddleware
			});
		}

		if (typeof routeModule.Put === 'function') {
			tempDefinitions.push({
				importName,
				importPath,
				route,
				method: 'put',
				routeFunctionName: 'Put',
				hasMiddleware
			});
		}

		if (typeof routeModule.Delete === 'function') {
			tempDefinitions.push({
				importName,
				importPath,
				route,
				method: 'delete',
				routeFunctionName: 'Delete',
				hasMiddleware
			});
		}

		if ((tempDefinitions.length !== 0 || method === 'all') && typeof routeModule.Route === 'function') {
			tempDefinitions.push({
				importName,
				importPath,
				route,
				method: 'all',
				routeFunctionName: 'Route',
				hasMiddleware
			});
		} else if (typeof routeModule.Route === 'function') {
			tempDefinitions.push({
				importName,
				importPath,
				route,
				method,
				routeFunctionName: 'Route',
				hasMiddleware
			});
		}

		if (tempDefinitions.length === 0) {
			console.log('[Error]'.red, `Server route '${route}' has not valid route handler.`.yellow);
			process.exit();
		}

		definitions.push(...tempDefinitions);
	}

	return definitions;
}

async function createLayoutDefinitions(appRoot: string, layouts: string[]): Promise<LayoutDefinition[]> {
	const layoutsRoot = path.join(appRoot, 'src');
	const definitions: LayoutDefinition[] = [];

	for (const fullPath of layouts) {
		const layoutModule = await import(fullPath);

		if (typeof layoutModule.default !== 'function') {
			console.log('[Error]'.red, `Layout ${fullPath} does not have the required default exported.`.yellow);
			process.exit();
		}

		const relativePath = path.relative(layoutsRoot, fullPath);
		const parsedPath = path.parse(relativePath);
		const importName = `layout_${parsedPath.dir.replace(/\//g, '_')}_${parsedPath.name}`.replace(/[^a-zA-Z0-9_$]/g, '_');
		const importPath = path.format({
			dir: parsedPath.dir,
			name: parsedPath.name,
			ext: '.mjs'
		});

		definitions.push({
			name: path.relative('layouts', `${parsedPath.dir}/${parsedPath.name}`),
			importName,
			importPath
		});
	}

	return definitions;
}

// TODO - Make this into a CLI app

if (import.meta.main) {
	build(process.cwd());
}
