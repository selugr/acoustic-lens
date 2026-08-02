import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		alias: {
			'@common': path.resolve(__dirname, '../common'),
		},
	},
	test: {
		environment: 'node',
		include: ['src/**/*.test.ts', '../common/**/*.test.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			include: ['src/**/*.ts'],
			exclude: ['src/**/*.test.ts', 'src/index.ts'],
		},
	},
})
