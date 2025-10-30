# Yeah!

"Yeah!" is a minimal "framework" intended to make writing web applications for 3DS/Wii U titles (Miiverse, TVii, etc.) feel a bit more modern. The framework acts essentially as just a wrapper for Express routes with some enforced project structure conventions and a couple extra features sprinkled on top, still giving you access to the underlying Express data if you should need it to manage a request in effectively the same way you would a normal Express application. The goal is not to be a powerful web app framework like Nuxt/Next. The main goals are:

- Feel modern
- Automatic JSX SSR. Every route (both `pages` and `server`) run *on the server*, so you can do things like querying Mongo in a `pages` route or do SSE in a `server` route.
- HTMX/[NWFX](https://github.com/PretendoNetwork/NWFX) supported out of the box via partials.
- [SSE](https://en.wikipedia.org/wiki/Server-sent_events) supported out of the box.
- Nuxt/NextJS style file routing. HTTP methods can be defined in the file name, as can path parameters.

All pages are rendered on the server. There is no client-side/reactivity framework provided at this time.

A typical project structure is:

```
project
├── src
│   ├── components
│   ├── layouts
│   ├── middleware
│   ├── pages
│   ├── public
│   ├── server
│   └── App.tsx
└── yeah.config.ts
```

# Usage

See the `examples` folder for example usages.

# Features

## `yeah.config.ts`

Exports a single object as its default export. This object lets you set the config for the app, including full Express configuration. This can be used to effectively bootstrap the entire application. For example:

```ts
import type { Express } from 'express';

export default {
	port: 3333, // * Listen port
	configureServer(app: Express) {
		// * Configure the Express app like you would any other. This can
		// * effectively be used to replace files like
		// * https://github.com/PretendoNetwork/juxtaposition/blob/1cd5297b86a25e62941f60d2a97f5fcb99ea89a3/apps/juxtaposition-ui/src/server.js
		// * by doing all this setup in this file and callback function
	}
};
```

## `src/App.tsx`

The main entry point for pages. The JSX from the `Page` functions of files in the `src/pages` directory are used as children here. This is not required if no pages use this layout. For example:

```tsx
export default function App({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<title>My App</title>
				<script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.js" integrity="sha384-ezjq8118wdwdRMj+nX4bevEi+cDLTbhLAeFF688VK8tPDGeLUe0WoY2MZtSla72F" crossOrigin="anonymous"></script>
			</head>
			<body>
				<nav>
					<a href="/">Home</a>
					<a href="/about">About</a>
				</nav>
				<main>{children}</main>
			</body>
		</html>
	);
}
```

## `src/pages`

Routes that are intended to be rendered by the browser to the user. Uses path based routing. File names determine things like the HTTP method and query parameters. If no HTTP method is in the file name (such as `src/pages/index.tsx`) then the `app.all` Express handler is used.

Each page MUST export a `Page` function, which returns JSX to be used as a child of the selected layout. Can only export a `Partial` function which is used when the page is requested with HTMX/NWFX (both are supported). A `config` object can also be exported to configure parts of the route handler.

For example:

```tsx
// * src/pages/users/[pid].get.tsx
import authMiddleware from '@/middleware/auth';
import type { PageContext } from '@pretendonetwork/yeah/context';

export const config = {
	middleware: [ authMiddleware ], // * Runs before either function here is called
	// * layout: 'nested/deeply/test' // This will load the layout from "src/layouts/nested/deeply/test.tsx" instead of "src/App.tsx"
};

export async function Partial(ctx: PageContext) {
	return (
		<div>From partial</div>
	);
}

export async function Page(ctx: PageContext) {
	return (
		<button hx-get={`/users/${ctx.request.params.pid}`}>
			HTMX Test
		</button>
	);
}
```

## `src/server`

Routes that are ***NOT*** intended to be rendered by the browser to the user (though they CAN be used to render pages), such as API endpoints. Uses path based routing. File names determine things like the HTTP method and query parameters. Name is taken from Nuxt, so this might change to be less confusing (it seems to imply `pages` routes are not run on the server).

Each file MUST export one of the following:

-  A `Route` function
- At least one of `Get`, `Post`, `Put`, or `Delete` (all 4 may be used however)

If no HTTP method is in the file name (such as `src/server/api/new_post.ts`), and `Route` is exported, then `app.all` is used an no other functions can be exported. If no HTTP method is in the file name, and `Route` is NOT exported, then one (or more) of the 4 HTTP method functions MUST be exported and a separate `app.METHOD` handler is created for each HTTP method handler.

If an HTTP method is in the file name (such as `src/server/api/new_post.post.ts`), then ***ONLY*** `Route` is used and the `app.METHOD` is created using the HTTP method from the file name.

A `config` object can also be exported to configure parts of the route handler.

For example:

```ts
import authMiddleware from '@/middleware/auth';
import type { Context } from '@pretendonetwork/yeah/context';

export const config = {
	middleware: [ authMiddleware ] // * Runs before either function here is called
};

export async function Get(ctx: Context) {
	console.log('hello from get');
}

export async function Delete(ctx: Context) {
	console.log('hello delete');
}
```

## `src/middleware`

Route middleware. Works for both `src/pages` and `src/server` routes. The location `src/middleware` is not enforced, as they can be imported from anywhere, but it should be used by convention unless theres good reason not to. Each middleware exports a default function that consumes a `ctx` context. Using the `ctx.request`, `ctx.response` and `ctx.next` values these middleware can be used exactly the same as regular Express middleware. For example:

```ts
import type { MiddlewareContext } from '@pretendonetwork/yeah/context';

export default async function authMiddleware(ctx: MiddlewareContext) {
	console.log('middleware called');

	ctx.next(); // * Calls the next middleware in the stack, or lets the route handler get called if this is the last middleware

	// * You can exit a request early in middleware by sending a response. If sending a response,
	// * calling ctx.next() is not required. The return value is also discarded, only done like this for convention
	// return ctx.response.send('error')
}
```

## `src/components`

Resuable JSX components. The location `src/components` is not enforced, as they can be imported from anywhere, but it should be used by convention unless theres good reason not to.

## `src/layouts`

Defines alternative root layouts for pages. The file name becomes the layout name used by pages. If a layout is defined and is then used by a page, then the configured layout is used instead of the `src/App.tsx` layout for that page. For example:

```tsx
export default function CustomLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<title>My App</title>
			</head>
			<body>
				<div>custom layout</div>
				<main>{children}</main>
			</body>
		</html>
	);
}
```

## `src/public`

Static public assets using `express.static`.

## `ctx`

A "context" passed into server/page/middleware handler functions. The `ctx` argument always has 3 fields. Middleware `ctx` arguments have an additional `next` field:

- `request` - Express `Request` object.
- `response` - Express `Response` object.
- `data` - Custom data, typically set by the middleware (for things like middleware to pass data between each other and the route handler).

The following 3 main context types are provided:

- `Context` - Main, generic, context. As the above 3 mentioned fields.
- `MiddlewareContext` - Context to be used in middleware. Has an additional `next()` function.
- `PageContext` - Context to be used with pages. Alias of `Context` under the hood, used for different visual contexts.

All 3 main context types are generics which can optionall take in the following 6 types:

- `Params` - Same as Express. Types `ctx.request.params`.
- `ResBody` - Same as Express. Types the `ctx.response` body.
- `ReqBody` - Same as Express. Types `ctx.request.body`.
- `ReqQuery` - Same as Express. Types `ctx.request.query`.
- `Locals` - Same as Express. Types `ctx.request.locals`.
- `Data` - Same as Express. Types `ctx.data`.

Additionally, each of the 3 main context types has 4 sub-types. These sub-types can be used in contexts which a route only expects one type of field to be typed, reducing noise:

- `TYPEWithParams` (For example, `PageContextWithParams`) - Types `ctx.request.params` ONLY.
- `TYPEWithBody` (For example, `PageContextWithBody`) - Types `ctx.request.body` ONLY.
- `TYPEWithQuery` (For example, `PageContextWithQuery`) - Types `ctx.request.query` ONLY.
- `TYPEWithData` (For example, `PageContextWithData`) - Types `ctx.data` ONLY.

## SSE

[SSE](https://en.wikipedia.org/wiki/Server-sent_events) is supported out of the box as a native feature. To enable SSE create a route in `src/server` and use the `setupSSE` function with a unique ID for the user and the `ctx`. To send events use either `sendEvent` to send an event to a specific user, or `broadcast` to send the event to all users. For example:

```ts
// * src/server/sse.ts
import { setupSSE, sendEvent } from '@pretendonetwork/yeah/sse';
import type { Context } from '@pretendonetwork/yeah/context';

export async function Get(ctx: Context) {
	setupSSE(123, ctx);

	const interval = setInterval(() => {
		sendEvent('timestamp', 123, { timestamp: Date.now() });
	}, 1000);

	ctx.request.on('close', () => {
		clearInterval(interval);
	});
}
```

```tsx
// * src/pages/index.tsx
import type { PageContext } from '@pretendonetwork/yeah/context';

export function Page(ctx: PageContext) {
	return (
		<div>
			<script dangerouslySetInnerHTML={{__html: `
				var eventSource = new EventSource('/sse');

				eventSource.addEventListener('timestamp', function(event) {
					console.log('Timestamp event:', event.data);
				});

				eventSource.onerror = function() {
					console.log('Connection lost');
				};
			`}} />
		</div>
	);
}

```
