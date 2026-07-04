/**
 * AI Code Reviewer CLI — Quick experience without installation
 */

import { parseArgs } from 'node:util'
import { collectDiff, detectProject, VERSION } from './index.js'

const COMMANDS = ['review', 'review-file', 'review-commit', 'help', 'version'] as const
type Command = (typeof COMMANDS)[number]

function printHelp(): void {
	console.log(`
🔍 AI Code Reviewer v${VERSION} — Intelligent Code Review

Usage:
  npx ai-code-reviewer-plus <command> [options]

Commands:
  review [--branch <name>]     Review diff against target branch
  review-file <file>           Review a single file
  review-commit <hash>         Review a specific commit
  help                         Show this help
  version                      Show version

Examples:
  npx ai-code-reviewer-plus review
  npx ai-code-reviewer-plus review --branch develop
`)
}

function printVersion(): void {
	console.log(`ai-code-reviewer-plus v${VERSION}`)
}

async function runReview(args: string[]): Promise<void> {
	const { values } = parseArgs({
		args,
		options: { branch: { type: 'string', short: 'b' } },
		strict: false,
	})

	const root = process.cwd()
	const targetBranch = typeof values.branch === 'string' ? values.branch : 'main'

	console.log(`\n🔍 Reviewing diff against ${targetBranch}...\n`)

	try {
		const project = await detectProject(root)
		console.log(`📁 Project: ${project.framework || project.type} (${project.language})`)

		const diffs = await collectDiff({ root, targetBranch })

		if (diffs.length === 0) {
			console.log('\n✅ No changes detected.\n')
			return
		}

		console.log(`📝 Files changed: ${diffs.length}\n`)

		for (const diff of diffs) {
			const status = diff.status === 'added' ? '➕' : diff.status === 'deleted' ? '❌' : '📝'
			console.log(`  ${status} ${diff.file} (+${diff.additions}/-${diff.deletions})`)
		}

		console.log(
			`\n💡 For AI-powered analysis, use the Claude Code Skill: /review ${targetBranch}\n`
		)
	} catch (err) {
		console.error('Error:', err instanceof Error ? err.message : 'Unknown error')
		process.exit(1)
	}
}

async function runReviewFile(args: string[]): Promise<void> {
	const file = args[0]
	if (!file) {
		console.error('Error: missing file argument')
		console.log('Usage: npx ai-code-reviewer-plus review-file <file>')
		process.exit(1)
	}
	console.log(`\n🔍 Reviewing file: ${file}\n💡 Use Claude Code Skill: /review-file ${file}\n`)
}

async function runReviewCommit(args: string[]): Promise<void> {
	const hash = args[0]
	if (!hash) {
		console.error('Error: missing hash argument')
		console.log('Usage: npx ai-code-reviewer-plus review-commit <hash>')
		process.exit(1)
	}
	console.log(
		`\n🔍 Reviewing commit: ${hash}\n💡 Use Claude Code Skill: /review-commit ${hash}\n`
	)
}

async function main(): Promise<void> {
	const args = process.argv.slice(2)
	const command = args[0] as Command

	if (!command || !COMMANDS.includes(command)) {
		printHelp()
		process.exit(1)
	}

	switch (command) {
		case 'help':
			printHelp()
			break
		case 'version':
			printVersion()
			break
		case 'review':
			await runReview(args.slice(1))
			break
		case 'review-file':
			await runReviewFile(args.slice(1))
			break
		case 'review-commit':
			await runReviewCommit(args.slice(1))
			break
	}
}

main().catch(err => {
	console.error('Error:', err.message)
	process.exit(1)
})
