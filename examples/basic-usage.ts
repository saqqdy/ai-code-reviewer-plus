/**
 * Basic usage examples for AI Code Reviewer
 */

import { collectDiff, detectProject, formatDiffSummary } from '../src/index'

const ROOT = process.cwd()

async function main() {
	console.log('🔍 AI Code Reviewer — Basic Usage Examples\n')

	// Example 1: Detect Project
	console.log('📁 Example 1: Project Detection')
	console.log('─'.repeat(40))

	const project = await detectProject(ROOT)
	console.log(`Type: ${project.type}`)
	console.log(`Framework: ${project.framework || 'N/A'}`)
	console.log(`Language: ${project.language}`)
	console.log(`Package Manager: ${project.packageManager || 'N/A'}\n`)

	// Example 2: Collect Diff
	console.log('📝 Example 2: Collect Diff')
	console.log('─'.repeat(40))

	const diffs = await collectDiff({ root: ROOT, targetBranch: 'main' })

	if (diffs.length === 0) {
		console.log('No changes detected.\n')
	} else {
		console.log(`Files changed: ${diffs.length}\n`)
		for (const diff of diffs.slice(0, 5)) {
			console.log(formatDiffSummary(diff))
		}
	}

	console.log('\n✅ Examples completed!')
}

main().catch(console.error)
