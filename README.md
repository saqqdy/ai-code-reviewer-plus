# 🚀 AI Code Reviewer

> AI-powered intelligent code reviewer — multi-dimensional semantic analysis, five-tier severity classification, actionable fix suggestions via Claude Code Skill.

[![npm version](https://img.shields.io/npm/v/ai-code-reviewer.svg)](https://www.npmjs.com/package/ai-code-reviewer)
[![license](https://img.shields.io/npm/l/ai-code-reviewer.svg)](https://github.com/saqqdy/ai-code-reviewer/blob/master/LICENSE)

[中文文档](README_CN.md) | [完整文档](https://ai-code-reviewer.vercel.app)

---

## 🎯 The Problem It Solves

Traditional linters catch syntax errors, but miss **semantic issues**:

```typescript
// Linter: ✅ No syntax errors
function processUser(input: any) {
  return input.name.trim()  // Runtime: 💥 if input is null
}
```

Questions linters can't answer:
- Is this business logic correct?
- Are there security vulnerabilities?
- Will this cause performance issues?
- Is this maintainable?

| Scenario | Traditional Linter | AI Code Reviewer |
|----------|-------------------|------------------|
| "Is this safe?" | Pattern matching, can't understand context | AI understands business semantics |
| "How to fix?" | Reports error only | Provides executable fix snippets |
| "Is it critical?" | Binary pass/fail | 5-tier severity: BLOCKER → SUGGESTION |

---

## ✨ The Solution

AI Code Reviewer uses **semantic understanding** across five dimensions:

| Dimension | Focus | Example Rules |
|-----------|-------|---------------|
| **Correctness** | Logic errors, null pointers | COR-001: Null check missing |
| **Security** | XSS, SQL injection, data leakage | SEC-001: User input unsanitized |
| **Performance** | N+1 queries, memory leaks | PER-001: Loop inside loop |
| **Maintainability** | Duplicate code, complexity | MAIN-001: Duplicated logic |
| **Best Practices** | Framework conventions | BP-001: Vue reactive rules |

## 📊 Five-Tier Severity

Not all issues are equal. AI Code Reviewer classifies by impact:

| Level | Icon | Meaning | Action |
|-------|------|---------|--------|
| **BLOCKER** | 🚫 | Must fix, blocks merge | Fix immediately |
| **HIGH** | 🔴 | Critical, breaks functionality | Fix this iteration |
| **MEDIUM** | 🟡 | Important, affects quality | Plan to fix |
| **LOW** | 🟢 | Minor, polish level | Fix later |
| **SUGGESTION** | 💡 | Optional improvement | Optional |

---

## ✨ Core Features

### 🔍 Multi-Dimensional Analysis

- **Correctness** — Logic errors, null pointers, boundary conditions
- **Security** — XSS, SQL injection, data leakage
- **Performance** — N+1 queries, memory leaks, unnecessary re-renders
- **Maintainability** — Duplicate code, complexity, naming
- **Best Practices** — Framework conventions, code style

### 📊 Five-Tier Severity Classification

| Level | Meaning | Action |
|-------|---------|--------|
| 🚫 BLOCKER | Must fix, blocks merge | Fix immediately |
| 🔴 HIGH | High priority | Fix this iteration |
| 🟡 MEDIUM | Medium priority | Plan to fix |
| 🟢 LOW | Low priority | Fix later |
| 💡 SUGGESTION | Optional improvement | Optional |

---

## 🚀 Getting Started

### Option 1: Claude Code Plugin (Recommended)

```bash
# In Claude Code, run:
/plugin marketplace add saqqdy/ai-code-reviewer
/plugin install ai-code-reviewer
```

#### Available Commands

| Command | Description |
|---------|-------------|
| `/review [branch]` | Review diff against target branch |
| `/review-file <file>` | Review a single file |
| `/review-commit <hash>` | Review a specific commit |

### Option 2: CLI (Zero-Install)

```bash
npx ai-code-reviewer review --branch main
npx ai-code-reviewer review-file src/index.ts
npx ai-code-reviewer review-commit abc1234
```

### Option 3: Programmatic Usage

```bash
pnpm add ai-code-reviewer
```

```typescript
import { collectDiff, detectProject } from 'ai-code-reviewer'

const diffs = await collectDiff({
  root: process.cwd(),
  targetBranch: 'main'
})

const project = await detectProject(process.cwd())
```

---

## 📋 Example Output

```
/review main

🔍 Reviewing diff against main...

📁 Project: vue3 (typescript)
📝 Files changed: 3

📊 Review Summary:
- Total findings: 12
- 🚫 Blockers: 1
- 🔴 High: 3
- 🟡 Medium: 5
- 🟢 Low: 2
- 💡 Suggestions: 1

🚫 Blockers (Must Fix):

- 🚫 **SEC-001** [BLOCKER] `src/auth.ts:45`
  **XSS vulnerability in user input**
  
  User input is directly rendered without sanitization.
  ```typescript
  element.innerHTML = userInput  // 💥 Dangerous!
  ```
  
  💡 **Fix**: Sanitize user input before rendering.
  ```typescript
  element.textContent = sanitize(userInput)
  ```
  
  Confidence: 🟢 High
```

---

## 🚀 Quick Experience

Not sure where to start? Follow this path:

| Step | Method | Time | What You'll See |
|------|--------|------|-----------------|
| 1 | CLI | 1 min | Diff collection + project detection |
| 2 | API example | 3 min | Programmatic interface + formatting |
| 3 | Skill | 5 min | **Full review** (rules + AI analysis) |

**Fastest path**: Install the Skill, run `/review main` — one command, full experience.

```bash
# Step 1: Try CLI instantly (in any git repo)
npx ai-code-reviewer review --branch main

# Step 2: Run the API example
git clone https://github.com/saqqdy/ai-code-reviewer.git
cd ai-code-reviewer && pnpm install
npx tsx examples/basic-usage.ts

# Step 3: Full AI-powered review (in Claude Code)
/plugin install ai-code-reviewer
/review main
```

---

## ⚙️ Configuration

Create `.ai-code-reviewer.yml` to customize:

```yaml
rules:
  enabled:
    - COR-001  # Null pointer check
    - SEC-001  # XSS prevention
    - SEC-002  # SQL injection
    - PER-001  # N+1 query detection
  disabled:
    - STYLE-001  # Naming conventions
  severityOverrides:
    SEC-001: BLOCKER  # XSS must fix immediately

excludePaths:
  - node_modules/
  - dist/
  - coverage/

maxFindingsPerFile: 20
outputFormat: markdown
```

---

## 🗂️ Project Structure

```
ai-code-reviewer/
├── .claude/skills/ai-code-reviewer/  # Claude Code Skill
├── src/                               # TypeScript source
│   ├── collectors/                    # Git data collectors
│   ├── utils/                         # Utilities
│   └── types.ts                       # Type definitions
├── docs/                              # VitePress docs
└── examples/                          # Usage examples
```

---

## 🛠️ Development

```bash
pnpm install          # Install dependencies
pnpm run lint         # ESLint check
pnpm run typecheck    # TypeScript check
pnpm run test         # Run tests
pnpm run build        # Build (ESM + CJS)
pnpm run docs:dev     # Start docs server
```

---

## 📋 Version Roadmap

| Version | Theme | Status |
|---------|-------|--------|
| v0.1.0 | Core framework + CLI + Skill | ✅ Current |
| v0.2.0 | Rule library + AI analysis engine | 📋 Planned |
| v1.0.0 | Production-ready + Marketplace | 📋 Planned |

---

## 📄 License

[MIT](./LICENSE)