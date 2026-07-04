/**
 * Project type detector — identifies project framework and language
 */

import type { ProjectInfo } from '../types'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Detect project type from filesystem markers
 */
export async function detectProject(root: string): Promise<ProjectInfo> {
	const markers = [
		{ type: 'node', file: 'package.json' },
		{ type: 'go', file: 'go.mod' },
		{ type: 'python', file: 'requirements.txt' },
		{ type: 'rust', file: 'Cargo.toml' },
	]

	for (const marker of markers) {
		const filePath = join(root, marker.file)
		if (existsSync(filePath)) {
			if (marker.type === 'node') {
				return detectNodeProject(root, filePath)
			}
			if (marker.type === 'go') {
				return {
					type: 'go',
					language: 'go',
					packageManager: 'go mod',
					root,
				}
			}
			if (marker.type === 'python') {
				return {
					type: 'python',
					language: 'python',
					packageManager: 'pip',
					root,
				}
			}
		}
	}

	return {
		type: 'unknown',
		language: 'unknown',
		root,
	}
}

/**
 * Detect Node.js project details (Vue/React/etc.)
 */
function detectNodeProject(root: string, packageJsonPath: string): ProjectInfo {
	try {
		const content = readFileSync(packageJsonPath, 'utf-8')
		const pkg = JSON.parse(content) as {
			dependencies?: Record<string, string>
			devDependencies?: Record<string, string>
		}

		const deps = { ...pkg.dependencies, ...pkg.devDependencies }

		// Vue detection
		if (deps.vue || deps.Vue) {
			const version = deps.vue || deps.Vue || ''
			const isVue3 = version.startsWith('^3') || version.startsWith('3')
			return {
				type: 'vue',
				framework: isVue3 ? 'vue3' : 'vue2',
				language: 'typescript',
				packageManager: detectPackageManager(root),
				root,
			}
		}

		// React detection
		if (deps.react || deps.React) {
			const version = deps.react || deps.React || ''
			const isReact18 = version.startsWith('^18') || version.startsWith('18')
			return {
				type: 'react',
				framework: isReact18 ? 'react18' : 'react',
				language: 'typescript',
				packageManager: detectPackageManager(root),
				root,
			}
		}

		// Generic Node.js project
		return {
			type: 'node',
			language: 'javascript',
			packageManager: detectPackageManager(root),
			root,
		}
	} catch {
		return {
			type: 'node',
			language: 'javascript',
			packageManager: 'npm',
			root,
		}
	}
}

/**
 * Detect package manager from lock files
 */
function detectPackageManager(root: string): string {
	if (existsSync(join(root, 'pnpm-lock.yaml'))) return 'pnpm'
	if (existsSync(join(root, 'yarn.lock'))) return 'yarn'
	if (existsSync(join(root, 'package-lock.json'))) return 'npm'
	return 'npm'
}
