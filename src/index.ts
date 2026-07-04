/**
 * AI Code Reviewer — Entry module
 *
 * Exports all public APIs
 */

// Collectors
export { collectCommitDiff, collectDiff } from './collectors/diff-collector'

export { detectProject } from './collectors/project-detector'
// Errors
export { ConfigError, GitCommandError, ParseError } from './errors'

// Types
export type {
	CommitReviewOptions,
	DiffHunk,
	FileReviewOptions,
	ParsedDiff,
	ProjectInfo,
	ReviewDimension,
	ReviewerConfig,
	ReviewFinding,
	ReviewOptions,
	ReviewResult,
	SeverityLevel,
} from './types'
export { VERSION } from './types'

export { getDefaultConfig, loadConfigFile, mergeConfig } from './utils/config'
// Utils
export {
	formatDiffSummary,
	formatDuration,
	formatFinding,
	formatReviewReport,
	formatSummary,
} from './utils/format'
