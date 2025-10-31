import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/**/*.{ts,tsx}'],
	splitting: false,
	sourcemap: true,
	platform: 'node',
	clean: true,
	dts: true,
	format: ['cjs', 'esm']
});
