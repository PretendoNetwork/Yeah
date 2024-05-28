# Yeah!
Simple JSX->HTML factory for use on the Wii U and 3DS.

# Why?
To give the Wii U and 3DS some form of modern frontend build tools. When mixed with [NWFX](https://github.com/PretendoNetwork/NWFX), Yeah! can provide a modern feeling development experience when working on legacy consoles.

While designed for use with Juxtaposition, Yeah! can be used with any web-based app on the Wii U and 3DS.

# Features
Currently Yeah! is currently only designed as a templating language using JSX. There is *no* reactivity features implemented like those found in React, Vue, etc. Adding reactivity features is a potential future goal, however currently Yeah! is meant only for templating with JSX.

Yeah! features both client side and server side rendering. Server side rendering is provided as an [Express](https://expressjs.com/) view engine.

# Usage

Install:

```bash
npm i @pretendonetwork/yeah
npm i --save-dev @types/react
```

If using server side rendering, also install `react`. This is only required for `react/jsx-runtime`.

## Client side

Import and write your JSX/TSX:

```tsx
import { createElement } from '@pretendonetwork/yeah';

const element = <h1>TSX on Wii U/3DS</h1>;

document.body.appendChild(element as any);
```

Add `jsx` and `jsxFactory` to your `tsconfig.json`:

```json
{
	"compilerOptions": {
		...
		"jsx": "react",
		"jsxFactory": "createElement",
		...
	}
	...
}
```

Compile, bundle, minify. Uses:

- https://npmjs.com/package/browserify
- https://npmjs.com/package/uglify-js

```bash
npx tsc
npx browserify ./compiled.js -o ./bundle.js
npx uglifyjs bundle.js --compress --mangle --source-map --output bundle.min.js
```

## Server side

Import and write your JSX/TSX:

```tsx
import { createElement } from '@pretendonetwork/yeah/server';

// Populates the <head> tag
export function Head() {
	return (
		<link href='https://cdn.jsdelivr.net/npm/reset-css@5.0.2/reset.min.css' rel='stylesheet'></link>
	);
}

// Populates the <body> tag
// Supports taking props from the Express route
export function Body({ username }: { username: string }) {
	return (
		<div>
			<h1>Hello {username}</h1>
			<p>Test page</p>
		</div>
	);
}
```

Add `jsx` and `moduleResolution` to `tsconfig.json`:

```json
{
	"compilerOptions": {
		...
		"jsx": "react-jsx",
		"moduleResolution": "node16",
		...
	}
	...
}
```

`react-jsx` removes the `'React' refers to a UMD global, but the current file is a module. Consider adding an import instead.` errors when not using React.

`node16` is required to make use of the `exports` field in the `package.json`.

Configure Express:

```ts
import path from 'node:path';
import express from 'express';
import { renderFile } from '@pretendonetwork/yeah/server'; // Import the SSR view engine

const app = express();
const PORT = process.env.PORT || 8080;

// TypeScript will turn .tsx and .jsx files into .js files,
// so the engine needs to look for .js instead of .tsx or .jsx
app.engine('js', renderFile);
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'js');

app.get('/', (_, response) => {
	response.render('home', {
		username: 'PN_Jon'
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
```