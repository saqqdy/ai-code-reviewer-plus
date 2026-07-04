---
name: ai-code-reviewer-plus
description: AI 智能代码审查 — 多维度语义分析，五级严重性分类，给出可执行的修复建议
version: 0.1.0
triggers:
  - /review
  - /code-review
  - /pr-review
---

# AI Code Reviewer Plus — 智能代码审查

AI Code Reviewer 是一个 Claude Code Skill 插件，用 AI 语义理解替代传统 linter，让每次 PR Review 都有实质性价值。

> **v0.1.0 范围**：数据采集层 + 规则引擎（10 条基础规则）。AI 语义增强分析由 Claude 在执行 Skill 时实时提供，深度规则库将在 v0.2.0 扩展。

## 可用命令

### `/review [branch]` — 审查分支 Diff
### `/review-file <file>` — 审查单个文件
### `/review-commit <hash>` — 审查单个 Commit

## 核心原则

1. **语义理解** — 理解代码意图再做判断
2. **五级分类** — BLOCKER > HIGH > MEDIUM > LOW > SUGGESTION
3. **证据链** — 每个发现关联具体代码位置
4. **可执行** — 给出最小修复代码片段

## 审查维度

- **正确性**: 逻辑错误、空指针、边界条件
- **安全性**: XSS、SQL注入、敏感数据泄露
- **性能**: N+1查询、内存泄漏、不必要的重渲染
- **可维护性**: 重复代码、复杂度过高、命名不规范
- **最佳实践**: 框架规范、代码风格、设计模式

## 执行流程

### Step 1: 数据采集
使用程序化 API:
```typescript
import { collectDiff, detectProject, analyzeDiffs } from 'ai-code-reviewer-plus'
```

### Step 2: 多维度分析
遍历 diff hunks，应用规则库，生成 ReviewFinding

### Step 3: 报告生成
按严重级别分组，Markdown 格式化输出

## 输出格式

```markdown
# 🔍 Code Review Report

## 📊 Review Summary
- Total findings: 12
- 🚫 Blockers: 1
- 🔴 High: 3
...

## 🚫 Blockers (Must Fix)
- 🚫 **SEC-001** [BLOCKER] `src/auth.ts:45`
  **XSS vulnerability in user input**
  💡 Sanitize user input before rendering.
```

## 配置文件

创建 `.ai-code-reviewer-plus.yml`:
```yaml
rules:
  enabled: [COR-001, SEC-001, PER-001]
excludePaths: [node_modules/, dist/]
maxFindingsPerFile: 20
```