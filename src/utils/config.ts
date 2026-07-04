/**
 * Configuration management for AI Code Reviewer
 */

import type { ReviewerConfig } from '../types'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ConfigError } from '../errors'

/** Default configuration */
const DEFAULT_CONFIG: ReviewerConfig = {
	rules: {
		enabled: ['COR-001', 'SEC-001', 'SEC-002', 'PER-001', 'MAIN-001'],
		disabled: [],
		severityOverrides: {},
	},
	excludePaths: ['node_modules/', 'dist/', 'coverage/', 'vendor/', '.git/'],
	maxFindingsPerFile: 20,
	outputFormat: 'markdown',
	targetBranch: 'main',
}

/**
 * Deep merge user config with defaults
 */
export function mergeConfig(user: Partial<ReviewerConfig>): ReviewerConfig {
	return {
		...DEFAULT_CONFIG,
		...user,
		rules: {
			...DEFAULT_CONFIG.rules,
			...user.rules,
			enabled: user.rules?.enabled ?? DEFAULT_CONFIG.rules.enabled,
			disabled: user.rules?.disabled ?? DEFAULT_CONFIG.rules.disabled,
			severityOverrides:
				user.rules?.severityOverrides ?? DEFAULT_CONFIG.rules.severityOverrides,
		},
		excludePaths: user.excludePaths ?? DEFAULT_CONFIG.excludePaths,
		maxFindingsPerFile: user.maxFindingsPerFile ?? DEFAULT_CONFIG.maxFindingsPerFile,
		outputFormat: user.outputFormat ?? DEFAULT_CONFIG.outputFormat,
	}
}

/**
 * Get default configuration (fresh copy)
 */
export function getDefaultConfig(): ReviewerConfig {
	return structuredClone(DEFAULT_CONFIG)
}

/**
 * Load configuration from YAML file (simplified YAML parsing)
 */
export function loadConfigFile(
	root: string,
	fileName = '.ai-code-reviewer-plus.yml'
): Partial<ReviewerConfig> {
	const filePath = join(root, fileName)

	if (!existsSync(filePath)) {
		return {}
	}

	try {
		const content = readFileSync(filePath, 'utf-8')
		return parseSimpleYAML(content)
	} catch (err) {
		throw new ConfigError({
			filePath,
			message: `Failed to load config file: ${err instanceof Error ? err.message : 'Unknown error'}`,
		})
	}
}

/**
 * Simple YAML parser for basic config structure
 */
function parseSimpleYAML(content: string): Partial<ReviewerConfig> {
	const config: Partial<ReviewerConfig> = {
		rules: {
			enabled: [],
			disabled: [],
			severityOverrides: {},
		},
		excludePaths: [],
	}

	const lines = content.split('\n')
	let currentSection = ''

	for (const line of lines) {
		const trimmed = line.trim()

		// Skip comments and empty lines
		if (trimmed.startsWith('#') || !trimmed) continue

		// Section headers
		if (trimmed.startsWith('rules:')) {
			currentSection = 'rules'
		} else if (trimmed.startsWith('excludePaths:')) {
			currentSection = 'excludePaths'
		} else if (trimmed.startsWith('maxFindingsPerFile:')) {
			const value = trimmed.split(':')[1]?.trim()
			if (value) config.maxFindingsPerFile = Number(value)
		} else if (trimmed.startsWith('outputFormat:')) {
			const value = trimmed.split(':')[1]?.trim()
			if (value && (value === 'markdown' || value === 'json')) {
				config.outputFormat = value
			}
		}

		// List items
		else if (trimmed.startsWith('- ') && currentSection) {
			const value = trimmed.slice(2)

			if (currentSection === 'rules') {
				const ruleId = value.split(' ')[0]
				if (ruleId) {
					config.rules!.enabled.push(ruleId)
				}
			} else if (currentSection === 'excludePaths') {
				config.excludePaths!.push(value)
			}
		}
	}

	return config
}
