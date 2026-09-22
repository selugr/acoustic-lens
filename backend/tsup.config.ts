import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/server.ts'],
	outDir: 'dist',
	format: ['cjs'],
	target: 'node20',
	clean: true,
	splitting: false,
	sourcemap: true,
	tsconfig: './tsconfig.json',
})
