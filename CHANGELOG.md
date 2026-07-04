# Changelog

## 0.1.0 (2026-06-29)

### 🚀 Initial Release

- **cli**: add zero-install CLI for quick experience
  - `npx ai-code-reviewer-plus review` — review diff against target branch
  - `npx ai-code-reviewer-plus review-file <file>` — review single file
  - `npx ai-code-reviewer-plus review-commit <hash>` — review commit
- **collectors**: add diff parsing and project detection
  - `collectDiff()` — parse `git diff` output into structured data
  - `collectCommitDiff()` — diff for single commit
  - `detectProject()` — detect Vue/React/Node/Go/Python projects
- **utils**: add formatting and configuration utilities
  - `formatFinding()` — format single finding as Markdown
  - `formatReviewReport()` — generate full Markdown report
  - `mergeConfig()` — merge user config with defaults
  - `loadConfigFile()` — load `.ai-code-reviewer-plus.yml`
- **skill**: add Claude Code Skill definition
  - Commands: `/review`, `/review-file`, `/review-commit`
  - Multi-dimensional analysis: correctness/security/performance/maintainability/best-practices
  - Five-tier severity: BLOCKER/HIGH/MEDIUM/LOW/SUGGESTION

### 📝 Documentation

- Add README.md and README_CN.md with usage guides
- Add `.ai-code-reviewer-plus.example.yml` configuration template
- Add example scripts in `examples/`

### 🔧 Chores

- Add initial project configuration (TypeScript 5.9, tsup, vitest, ESLint 9)
- Add `.claude-plugin/` for marketplace distribution