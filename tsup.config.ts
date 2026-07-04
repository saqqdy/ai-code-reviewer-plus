import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts', 'src/cli.ts'],
	format: ['esm', 'cjs'],
	dts: false,
	sourcemap: false,
	clean: false,
	platform: 'node',
	target: 'node18',
})