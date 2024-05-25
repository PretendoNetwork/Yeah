# Yeah!
Simple JSX->HTML factory for use on the Wii U and 3DS.

# Why?
To give the Wii U and 3DS some form of modern frontend build tools. When mixed with [NWFX](https://github.com/PretendoNetwork/NWFX), Yeah! can provide a modern feeling development experience when working on legacy consoles.

While designed for use with Juxtaposition, Yeah! can be used with any web-based app on the Wii U and 3DS.

# Features
Currently Yeah! is currently only designed as a templating language using JSX. There is *no* reactivity features implemented like those found in React, Vue, etc. Adding reactivity features is a potential future goal, however currently Yeah! is meant only for templating with JSX.

# Usage

Install:

```bash
npm i @pretendonetwork/yeah @types/react
```

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