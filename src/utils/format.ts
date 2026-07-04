/**
 * Formatting utility functions for AI Code Reviewer
 */

import type { ParsedDiff, ReviewFinding, ReviewResult } from '../types'

/**
 * Format a single finding as Markdown
 */
export function formatFinding(finding: ReviewFinding): string {
	const severityEmoji = {
		BLOCKER: '🚫',
		HIGH: '🔴',
		MEDIUM: '🟡',
		LOW: '🟢',
		SUGGESTION: '💡',
	}

	const emoji = severityEmoji[finding.severity]
	const location = finding.line ? `:${finding.line}` : ''

	let output = `- ${emoji} **${finding.id}** [${finding.severity}] \`${finding.file}${location}\`\n`
	output += `  **${finding.title}**\n`
	output += `  ${finding.description}\n`

	if (finding.codeSnippet) {
		output += `  \`\`\`\n  ${finding.codeSnippet}\n  \`\`\`\n`
	}

	if (finding.suggestion) {
		output += `  💡 ${finding.suggestion}\n`
	}

	if (finding.fixExample) {
		output += `  **Fix:**\n  \`\`\`\n  ${finding.fixExample}\n  \`\`\`\n`
	}

	const confidenceEmoji = { high: '🟢', medium: '🟡', low: '🔴' }
	output += `  Confidence: ${confidenceEmoji[finding.confidence]}\n`

	return output
}

/**
 * Format review summary as Markdown
 */
export function formatSummary(result: ReviewResult): string {
	const { summary, duration } = result

	let output = `## 📊 Review Summary\n\n`
	output += `- **Total findings**: ${summary.total}\n`
	output += `- **🚫 Blockers**: ${summary.blockers}\n`
	output += `- **🔴 High**: ${summary.high}\n`
	output += `- **🟡 Medium**: ${summary.medium}\n`
	output += `- **🟢 Low**: ${summary.low}\n`
	output += `- **💡 Suggestions**: ${summary.suggestions}\n`
	output += `- **Files reviewed**: ${result.filesReviewed.length}\n`
	output += `- **Duration**: ${formatDuration(duration)}\n`

	return output
}

/**
 * Format full review result as Markdown report
 */
export function formatReviewReport(result: ReviewResult): string {
	let output = `# 🔍 Code Review Report\n\n`
	output += formatSummary(result)
	output += `\n---\n\n`

	// Group by severity
	const blockers = result.findings.filter(f => f.severity === 'BLOCKER')
	const high = result.findings.filter(f => f.severity === 'HIGH')
	const medium = result.findings.filter(f => f.severity === 'MEDIUM')
	const low = result.findings.filter(f => f.severity === 'LOW')
	const suggestions = result.findings.filter(f => f.severity === 'SUGGESTION')

	if (blockers.length > 0) {
		output += `## 🚫 Blockers (Must Fix)\n\n`
		for (const f of blockers) {
			output += `${formatFinding(f)  }\n`
		}
	}

	if (high.length > 0) {
		output += `## 🔴 High Priority\n\n`
		for (const f of high) {
			output += `${formatFinding(f)  }\n`
		}
	}

	if (medium.length > 0) {
		output += `## 🟡 Medium Priority\n\n`
		for (const f of medium) {
			output += `${formatFinding(f)  }\n`
		}
	}

	if (low.length > 0) {
		output += `## 🟢 Low Priority\n\n`
		for (const f of low) {
			output += `${formatFinding(f)  }\n`
		}
	}

	if (suggestions.length > 0) {
		output += `## 💡 Suggestions\n\n`
		for (const f of suggestions) {
			output += `${formatFinding(f)  }\n`
		}
	}

	return output
}

/**
 * Format parsed diff as short summary
 */
export function formatDiffSummary(diff: ParsedDiff): string {
	const statusEmoji = {
		added: '➕',
		deleted: '❌',
		modified: '📝',
		renamed: '📦',
	}

	const emoji = statusEmoji[diff.status]
	const renameInfo =
		diff.status === 'renamed' && diff.from ? ` (${diff.from} → ${diff.file})` : ''
	return `- ${emoji} \`${diff.file}\` +${diff.additions}/-${diff.deletions}${renameInfo}`
}

/**
 * Format duration in ms to human-readable
 */
export function formatDuration(ms: number): string {
	if (ms < 1000) return `${ms}ms`
	const seconds = Math.round(ms / 1000)
	if (seconds < 60) return `${seconds}s`
	const minutes = Math.floor(seconds / 60)
	const secs = seconds % 60
	return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`
}
