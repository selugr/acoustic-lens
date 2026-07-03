import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts'],
	outDir: 'dist',
	format: ['esm'],
	target: 'node20',
	clean: true,
	splitting: false,
	sourcemap: true,
	tsconfig: './tsconfig.json',
})
