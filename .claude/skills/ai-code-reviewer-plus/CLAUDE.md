# AI Code Reviewer Plus — Claude Code Guide

## Project Overview

AI Code Reviewer 是一个 Claude Code Skill 插件，用 AI 语义理解替代传统 linter。

## Architecture

```
.claude/skills/ai-code-reviewer-plus/  ← Skill 定义
src/                               ← TypeScript 源码
internal/                          ← 内部规划文档
```

## Development Commands

```bash
pnpm install          # 安装依赖
pnpm run build        # 构建
pnpm run test         # 测试
pnpm run lint         # Lint
```

## Key Principles

1. **语义级理解** — AI 理解代码意图
2. **五级严重性** — BLOCKER > HIGH > MEDIUM > LOW > SUGGESTION
3. **可执行建议** — 给出最小修复代码
4. **多维度覆盖** — 正确性/安全性/性能/可维护性/最佳实践

## Code Style

- TypeScript 5.9+，strict mode
- 文件命名：kebab-case
- 导出：named exports
- 测试：vitest