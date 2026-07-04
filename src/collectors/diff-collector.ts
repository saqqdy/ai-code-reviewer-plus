/**
 * Git diff collector — parses `git diff` output into structured data
 */

import type { DiffHunk, ParsedDiff } from '../types'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { GitCommandError } from '../errors'

const exec = promisify(execFile)

/**
 * Collect diff between branches or commits
 */
export async function collectDiff(options: {
	root: string
	targetBranch?: string
	commitHash?: string
}): Promise<ParsedDiff[]> {
	const { root, targetBranch = 'main', commitHash } = options

	const args = ['diff', '--no-color']

	if (commitHash) {
		args.push(commitHash)
	} else {
		args.push(targetBranch, 'HEAD')
	}

	try {
		const { stdout } = await exec('git', args, { cwd: root, maxBuffer: 50 * 1024 * 1024 })
		return parseDiffOutput(stdout)
	} catch (err) {
		throw new GitCommandError({
			command: 'diff',
			args,
			cwd: root,
			message: 'Failed to collect git diff',
			cause: err instanceof Error ? err : undefined,
		})
	}
}

/**
 * Collect diff for a single commit
 */
export async function collectCommitDiff(options: {
	root: string
	hash: string
}): Promise<ParsedDiff[]> {
	const { root, hash } = options

	const args = ['diff', '--no-color', hash]

	try {
		const { stdout } = await exec('git', args, { cwd: root })
		return parseDiffOutput(stdout)
	} catch (err) {
		throw new GitCommandError({
			command: 'diff',
			args,
			cwd: root,
			message: `Failed to collect diff for commit ${hash}`,
			cause: err instanceof Error ? err : undefined,
		})
	}
}

// ─── Parser ────────────────────────────────────────────────────────

function parseDiffOutput(stdout: string): ParsedDiff[] {
	if (!stdout.trim()) return []

	const diffs: ParsedDiff[] = []
	const fileSections = stdout.split(/^diff --git /m).filter(s => s.trim())

	for (const section of fileSections) {
		const diff = parseFileSection(section)
		if (diff) diffs.push(diff)
	}

	return diffs
}

function parseFileSection(section: string): ParsedDiff | null {
	const lines = section.split('\n')

	// Parse file path from first line: "a/file b/file"
	const headerLine = lines[0]
	const pathMatch = headerLine?.match(/^a\/(.+) b\/(.+)/)
	if (!pathMatch) return null

	const file = pathMatch[2]!
	const from = pathMatch[1]!

	// Detect file status and parse hunks
	let status: 'added' | 'deleted' | 'modified' | 'renamed' = 'modified',
		currentHunk: DiffHunk | null = null,
		additions = 0,
		deletions = 0

	// Check for new file marker
	if (lines.some(l => l.startsWith('new file mode'))) {
		status = 'added'
	}
	// Check for deleted file marker
	else if (lines.some(l => l.startsWith('deleted file mode'))) {
		status = 'deleted'
	}
	// Check for rename
	else if (lines.some(l => l.startsWith('rename from '))) {
		status = 'renamed'
	}

	// Parse hunks
	const hunks: DiffHunk[] = []

	for (const line of lines) {
		// Hunk header: @@ -oldStart,oldCount +newStart,newCount @@ context
		const hunkMatch = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/)
		if (hunkMatch) {
			if (currentHunk) hunks.push(currentHunk)
			currentHunk = {
				header: line,
				oldStart: Number(hunkMatch[1]!),
				oldCount: Number(hunkMatch[2] ?? 1),
				newStart: Number(hunkMatch[3]!),
				newCount: Number(hunkMatch[4] ?? 1),
				lines: [],
			}
			continue
		}

		// Count additions/deletions
		if (line.startsWith('+') && currentHunk) {
			additions++
			currentHunk.lines.push(line)
		} else if (line.startsWith('-') && currentHunk && !line.startsWith('---')) {
			deletions++
			currentHunk.lines.push(line)
		} else if (line.startsWith(' ') && currentHunk) {
			currentHunk.lines.push(line)
		}
	}

	if (currentHunk) hunks.push(currentHunk)

	return {
		file,
		from: status === 'renamed' || status === 'deleted' ? from : undefined,
		status,
		additions,
		deletions,
		hunks,
	}
}
