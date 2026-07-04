# 🚀 AI Code Reviewer

> AI 智能代码审查 — 多维度语义分析，五级严重性分类，给出可执行的修复建议

[![npm version](https://img.shields.io/npm/v/ai-code-reviewer.svg)](https://www.npmjs.com/package/ai-code-reviewer)

[英文文档](README.md) | [完整文档](https://ai-code-reviewer.vercel.app)

---

## 🎯 解决的问题

传统 linter 只能发现语法错误，但无法理解**语义问题**：

```typescript
// Linter: ✅ 无语法错误
function processUser(input: any) {
  return input.name.trim()  // 运行时: 💥 如果 input 为 null
}
```

传统 linter 无法回答：
- 业务逻辑是否正确？
- 是否存在安全漏洞？
- 是否有性能问题？
- 代码是否可维护？

| 场景 | 传统 Linter | AI Code Reviewer |
|------|------------|------------------|
| "这段代码安全吗？" | 模式匹配，无法理解上下文 | AI 理解业务语义 |
| "怎么修复？" | 只报告错误 | 提供可执行的修复代码片段 |
| "严重吗？" | 二元通过/失败 | 五级分类：BLOCKER → SUGGESTION |

---

## ✨ 解决方案

AI Code Reviewer 通过**语义理解**在五个维度分析代码：

| 维度 | 关注点 | 规则示例 |
|------|--------|----------|
| **正确性** | 逻辑错误、空指针 | COR-001: 缺少空指针检查 |
| **安全性** | XSS、SQL注入、数据泄露 | SEC-001: 用户输入未消毒 |
| **性能** | N+1查询、内存泄漏 | PER-001: 循环嵌套循环 |
| **可维护性** | 重复代码、复杂度 | MAIN-001: 逻辑重复 |
| **最佳实践** | 框架规范 | BP-001: Vue响应式规则 |

## 📊 五级严重性分类

不同问题影响不同，AI Code Reviewer 按影响分级：

| 级别 | 图标 | 含义 | 行动 |
|------|------|------|------|
| **BLOCKER** | 🚫 | 必须修复，阻塞合并 | 立即修复 |
| **HIGH** | 🔴 | 严重，影响功能 | 本次迭代修复 |
| **MEDIUM** | 🟡 | 重要，影响质量 | 计划修复 |
| **LOW** | 🟢 | 次要，优化级别 | 延后修复 |
| **SUGGESTION** | 💡 | 建议性改进 | 可选 |

---

## ✨ 核心特性

### 🔍 多维度分析

- **正确性** — 逻辑错误、空指针、边界条件
- **安全性** — XSS、SQL注入、敏感数据泄露
- **性能** — N+1查询、内存泄漏、不必要的重渲染
- **可维护性** — 重复代码、复杂度过高、命名不规范
- **最佳实践** — 框架规范、代码风格

### 📊 五级严重性分类

🚫 **BLOCKER** → 必须修复，阻塞合并
🔴 **HIGH** → 高优先级，本次迭代修复
🟡 **MEDIUM** → 中等优先级，计划修复
🟢 **LOW** → 低优先级，延后修复
💡 **SUGGESTION** → 建议性改进，可选

---

## 🚀 快速开始

### 方式 1: Claude Code 插件（推荐）

```bash
/plugin marketplace add saqqdy/ai-code-reviewer
/plugin install ai-code-reviewer
```

### 方式 2: CLI（零安装）

无需安装即可体验：

```bash
npx ai-code-reviewer review --branch main
npx ai-code-reviewer review-file src/index.ts
npx ai-code-reviewer review-commit abc1234
npx ai-code-reviewer help
```

### 方式 3: NPM 包

```bash
pnpm add ai-code-reviewer
```

```typescript
import { collectDiff, detectProject } from 'ai-code-reviewer'

const diffs = await collectDiff({ root: process.cwd(), targetBranch: 'main' })
const project = await detectProject(process.cwd())
console.log(`框架: ${project.framework}`)
```

---

## 🚀 快速体验

不知道从哪开始？按这个路径走：

| 步骤 | 方式 | 时间 | 体验内容 |
|------|------|------|----------|
| 1 | CLI | 1 分钟 | Diff 采集 + 项目检测 |
| 2 | API 示例 | 3 分钟 | 编程接口 + 格式化输出 |
| 3 | Skill | 5 分钟 | **完整审查**（规则引擎 + AI 分析） |

**最快路径**：安装 Skill，运行 `/review main` — 一条命令体验全部。

```bash
# 步骤 1：即时体验 CLI（在任意 git 仓库中）
npx ai-code-reviewer review --branch main

# 步骤 2：运行 API 示例
git clone https://github.com/saqqdy/ai-code-reviewer.git
cd ai-code-reviewer && pnpm install
npx tsx examples/basic-usage.ts

# 步骤 3：完整 AI 审查（在 Claude Code 中）
/plugin install ai-code-reviewer
/review main
```

---

## ⚙️ 配置

创建 `.ai-code-reviewer.yml` 自定义规则：

```yaml
rules:
  enabled:
    - COR-001  # 空指针检查
    - SEC-001  # XSS 防护
    - SEC-002  # SQL 注入
  severityOverrides:
    SEC-001: BLOCKER  # XSS 必须立即修复

excludePaths:
  - node_modules/
  - dist/

maxFindingsPerFile: 20
```

---

## 🛠️ 开发

```bash
pnpm install          # 安装依赖
pnpm run build        # 构建
pnpm run docs:dev     # 启动文档服务器
```

---

## 📄 许可证

[MIT](./LICENSE)