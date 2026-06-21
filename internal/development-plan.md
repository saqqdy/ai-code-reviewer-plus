# Smart Code Reviewer — 智能代码审查 · 详细开发计划

---

## 一、项目定位

**一句话**：基于 Claude Code 的智能代码审查 Skill，用 AI 语义理解替代人工走形式，让每次 PR Review 都有实质性价值。

**核心差异化**：

| 维度 | 传统 Linter / 规则工具 | Smart Code Reviewer |
|------|------------------------|---------------------|
| 判断力 | 模式匹配，无法区分业务语义 | AI 理解上下文，区分"多余 null check"与"隐含空指针风险" |
| 噪音控制 | 规则不可调节，要么全报要么忽略 | BLOCKER / HIGH / MEDIUM / LOW / SUGGESTION 五级分类 |
| 团队适配 | 通用规则，不区分团队风格 | 可配置规则权重、忽略模式，逐渐学习团队偏好 |
| 修复建议 | 只报错不给修法 | 给出最小修复代码片段，可直接 apply |

---

## 二、技术架构

```
┌─────────────────────────────────────────────────┐
│                  Claude Code Skill               │
│              (smart-code-reviewer.md)            │
├─────────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐  ┌──────────────┐ │
│  │ Diff 读取  │  │ 配置加载  │  │ 上下文分析   │ │
│  │ git diff  │  │ YAML 解析 │  │ 项目感知     │ │
│  └─────┬─────┘  └─────┬─────┘  └──────┬───────┘ │
│        │              │               │          │
│        └──────────────┼───────────────┘          │
│                       ▼                          │
│            ┌─────────────────────┐               │
│            │   多维度审查引擎     │               │
│            │  ┌───────────────┐  │               │
│            │  │ 正确性审查     │  │               │
│            │  │ 安全性审查     │  │               │
│            │  │ 性能审查       │  │               │
│            │  │ 可维护性审查   │  │               │
│            │  │ 最佳实践审查   │  │               │
│            │  └───────────────┘  │               │
│            └─────────┬───────────┘               │
│                      ▼                           │
│            ┌─────────────────────┐               │
│            │   严重级别分类器     │               │
│            │  BLOCKER → SUGGESTION │              │
│            └─────────┬───────────┘               │
│                      ▼                           │
│            ┌─────────────────────┐               │
│            │   结构化输出格式化   │               │
│            │  Markdown / JSON    │               │
│            └─────────────────────┘               │
├─────────────────────────────────────────────────┤
│                   支撑脚本层                      │
│  ┌──────────┐ ┌───────────┐ ┌────────────────┐  │
│  │ git 操作  │ │ GitHub API│ │ 配置文件解析   │  │
│  └──────────┘ └───────────┘ └────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 三、项目结构

```
ai-code-reviewer/
├── CLAUDE.md                          # 项目级 Claude 指令
├── README.md                          # 项目说明
├── .ai-code-reviewer.example.yml      # 配置文件示例
├── skills/
│   └── smart-code-reviewer.md         # 核心 Skill 定义
├── scripts/
│   ├── get-diff.sh                    # 获取 PR/MR diff
│   ├── post-review.sh                 # 发布 Review 到 PR
│   └── detect-project.sh             # 检测项目类型
├── rules/                             # 内置规则库
│   ├── correctness.md                 # 正确性审查规则
│   ├── security.md                    # 安全性审查规则
│   ├── performance.md                 # 性能审查规则
│   ├── maintainability.md             # 可维护性审查规则
│   └── best-practices/                # 按框架分类的最佳实践
│       ├── vue.md
│       ├── react.md
│       ├── node.md
│       ├── go.md
│       └── python.md
├── templates/                         # 输出模板
│   ├── review-body.md                 # Review 评论区模板
│   ├── review-summary.md              # 摘要模板
│   └── review-report.md               # 完整报告模板
├── tests/                             # 测试用例
│   ├── fixtures/                      # 测试用代码样本
│   │   ├── vulnerable.ts
│   │   ├── slow-query.ts
│   │   ├── bad-practice.vue
│   │   └── clean-code.ts
│   └── expected/                      # 期望输出
│       ├── vulnerable.expected.md
│       └── ...
└── internal/                          # 内部文档（不发布）
    ├── claude-code-skill-ideas.md
    ├── claude-code-skill-ideas-project.md
    └── smart-code-reviewer-dev-plan.md   # 本文件
```

---

## 四、审查维度详细定义

### 4.1 正确性 (Correctness)

| 编号 | 规则 | 严重级别 | 说明 |
|------|------|----------|------|
| C-01 | 空指针 / undefined 风险 | HIGH | 区分已校验的安全访问与未校验的隐含风险 |
| C-02 | 竞态条件 | HIGH | 异步操作的竞态、共享状态的并发修改 |
| C-03 | 逻辑错误 | BLOCKER | 条件判断取反、off-by-one、短路求值误用 |
| C-04 | 类型不匹配 | MEDIUM | 隐式类型转换、any 滥用、断言不当 |
| C-05 | 错误处理缺失 | HIGH | 未捕获异常、Promise 未处理 rejection、catch 为空 |

### 4.2 安全性 (Security)

| 编号 | 规则 | 严重级别 | 说明 |
|------|------|----------|------|
| S-01 | 注入风险 | BLOCKER | SQL 注入、XSS、命令注入、模板注入 |
| S-02 | 认证/授权缺陷 | BLOCKER | 缺少鉴权、权限绕过、硬编码凭证 |
| S-03 | 敏感数据泄露 | HIGH | 日志输出敏感信息、错误信息暴露内部细节 |
| S-04 | 不安全的依赖 | MEDIUM | 已知 CVE 依赖、不安全的加密算法 |
| S-05 | SSRF / 路径穿越 | HIGH | 用户输入直接用于 URL 或文件路径 |

### 4.3 性能 (Performance)

| 编号 | 规则 | 严重级别 | 说明 |
|------|------|----------|------|
| P-01 | N+1 查询 | HIGH | 循环内的数据库/API 请求 |
| P-02 | 不必要的重渲染 | MEDIUM | React 缺 memo/Vue 缺 computed、大列表缺虚拟化 |
| P-03 | 内存泄漏 | HIGH | 未清理的定时器/监听器/订阅、全局缓存增长 |
| P-04 | 同步阻塞 | MEDIUM | 主线程大量计算、同步 I/O |
| P-05 | 过度请求 | LOW | 缺少缓存、重复请求、未做 debounce/throttle |

### 4.4 可维护性 (Maintainability)

| 编号 | 规则 | 严重级别 | 说明 |
|------|------|----------|------|
| M-01 | 过度复杂 | MEDIUM | 圈复杂度过高、嵌套过深、函数过长 |
| M-02 | 代码重复 | MEDIUM | 重复逻辑可提取为共用函数/组件 |
| M-03 | 命名不当 | LOW | 缩写、歧义命名、与领域模型不一致 |
| M-04 | 魔术数字/字符串 | LOW | 硬编码常量应提取为命名常量 |
| M-05 | 缺少类型标注 | SUGGESTION | 缺少返回类型、参数类型、JSDoc/TSDoc |

### 4.5 最佳实践 (Best Practices)

| 编号 | 规则 | 严重级别 | 说明 |
|------|------|----------|------|
| B-01 | 框架反模式 | HIGH | 框架推荐做法的违背（如 Vue 的 v-for 缺 key） |
| B-02 | 测试缺失 | MEDIUM | 新增逻辑缺少对应测试 |
| B-03 | 错误的抽象层级 | MEDIUM | UI 层直接操作数据、业务逻辑泄露到视图 |
| B-04 | API 设计不当 | LOW | 端点命名、HTTP 方法、状态码不符合 RESTful |
| B-05 | 目录结构违规 | SUGGESTION | 不符合项目约定的文件放置 |

---

## 五、严重级别分类标准

```
BLOCKER   → 必须修复才能合并。安全漏洞、数据丢失风险、逻辑错误
HIGH      → 强烈建议修复。可能引发线上问题、性能严重退化
MEDIUM    → 建议修复。可维护性问题、潜在性能风险
LOW       → 可选修复。代码风格、最佳实践建议
SUGGESTION→ 纯建议。个人偏好、可选优化
```

**关键原则**：宁可漏报不可误报。LOW 及以下级别的发现必须附带理由，避免"我觉得这样更好"式噪音。

---

## 六、配置文件设计

```yaml
# .ai-code-reviewer.yml
version: 1

# 项目基本信息（可选，支持自动检测）
project:
  type: auto          # auto | vue | react | node | go | python
  framework: auto     # auto | nuxt | next | express | gin | django

# 审查维度开关与权重
dimensions:
  correctness:    { enabled: true,  weight: 5 }
  security:       { enabled: true,  weight: 5 }
  performance:    { enabled: true,  weight: 3 }
  maintainability:{ enabled: true,  weight: 2 }
  best-practices: { enabled: true,  weight: 2 }

# 严重级别阈值（低于此级别不报告）
min_severity: LOW   # BLOCKER | HIGH | MEDIUM | LOW | SUGGESTION

# 文件过滤
include:
  - "src/**"
  - "lib/**"
  - "app/**"
exclude:
  - "**/*.min.js"
  - "**/*.map"
  - "dist/**"
  - "node_modules/**"
  - "**/*.generated.*"
  - "**/*.lock"

# 自定义规则覆盖
rules:
  disable:
    - B-05    # 目录结构违规
  severity:
    C-04: LOW  # 类型不匹配降级为 LOW

# 忽略模式
ignores:
  - files: "test/**"
    rules: [M-05]

# 团队偏好
preferences:
  language: zh-CN
  style: concise           # concise | detailed
  max_findings: 20
  include_suggestions: true
```

---

## 七、输出格式设计

### 7.1 Review 评论区（用于 PR Review Comment）

```markdown
## 🔍 Smart Code Review

**审查范围**：12 文件变更，+342 −89 行
**审查结论**：⚠️ 需要修改（2 HIGH / 3 MEDIUM / 2 LOW）

---

### 🔴 必须关注

#### [S-01] SQL 注入风险 — `src/services/user.ts:42`

```typescript
// ❌ 当前代码
const query = `SELECT * FROM users WHERE id = '${userId}'`

// ✅ 建议修改
const query = `SELECT * FROM users WHERE id = $1`
db.query(query, [userId])
```

**原因**：`userId` 来自请求参数，直接拼接到 SQL 会导致注入攻击。

---

### 🟡 建议关注

#### [P-02] 列表渲染缺少虚拟化 — `src/components/UserList.vue:18`

检测到 `v-for` 渲染超过 100 条数据，建议使用虚拟滚动以避免性能问题。

---

### 📊 维度评分

| 维度 | 评分 | 发现数 |
|------|------|--------|
| 正确性 | ⭐⭐⭐⭐ | 1 |
| 安全性 | ⭐⭐ | 1 |
| 性能 | ⭐⭐⭐ | 2 |
| 可维护性 | ⭐⭐⭐⭐ | 1 |
| 最佳实践 | ⭐⭐⭐⭐⭐ | 0 |

> 🤖 Powered by [Smart Code Reviewer](https://github.com/saqqdy/ai-code-reviewer)
```

### 7.2 结构化 JSON（用于程序消费）

```json
{
  "version": 1,
  "summary": {
    "files_changed": 12,
    "lines_added": 342,
    "lines_removed": 89,
    "conclusion": "needs_changes",
    "total_findings": 7
  },
  "scores": {
    "correctness": 4,
    "security": 2,
    "performance": 3,
    "maintainability": 4,
    "best_practices": 5
  },
  "findings": [
    {
      "id": "S-01",
      "dimension": "security",
      "severity": "BLOCKER",
      "title": "SQL 注入风险",
      "file": "src/services/user.ts",
      "line": 42,
      "current_code": "const query = `SELECT * FROM users WHERE id = '${userId}'`",
      "suggested_code": "const query = `SELECT * FROM users WHERE id = $1`\ndb.query(query, [userId])",
      "reason": "`userId` 来自请求参数，直接拼接到 SQL 会导致注入攻击。"
    }
  ]
}
```

---

## 八、分阶段开发计划

### Phase 1：MVP — 基础审查能力（第 1-2 周）

**目标**：能在本地对 git diff 进行多维度审查，输出结构化结果。

| 任务 | 验收标准 |
|------|---------|
| 定义 Skill 主文件 `skills/smart-code-reviewer.md` | Claude Code 加载后能响应 `/code-review` 命令 |
| 编写 `scripts/get-diff.sh` | 正确获取当前分支与 base 分支的 diff |
| 编写 `scripts/detect-project.sh` | 能识别 Vue/React/Node/Go/Python 项目类型 |
| 编写 5 维度审查规则 `rules/*.md` | 每个维度至少 5 条规则，附带示例代码 |
| 实现基本审查流程 | 对测试 fixtures 运行审查，输出 ≥80% 规则命中 |
| 编写配置文件模板 | `.ai-code-reviewer.example.yml` 可用 |
| 编写测试 fixtures | 至少 5 个含已知问题的代码文件 |

**交付物**：可手动触发的代码审查 Skill，输出 Markdown 格式审查报告。

---

### Phase 2：团队定制化（第 3-4 周）

**目标**：支持团队配置、项目感知、智能降噪。

| 任务 | 验收标准 |
|------|---------|
| 实现配置文件加载逻辑 | 读取 `.ai-code-reviewer.yml`，覆盖默认规则 |
| 实现规则禁用/级别调整 | 配置中 `disable` / `severity` 生效 |
| 实现文件过滤 | `include` / `exclude` glob 匹配正确 |
| 按项目类型加载框架规则 | Vue 项目自动加载 `best-practices/vue.md` |
| 实现严重级别阈值过滤 | `min_severity: HIGH` 时不输出 MEDIUM 及以下 |
| 实现最大发现数限制 | `max_findings: 10` 时只输出前 10 条 |
| 多语言输出支持 | `language: zh-CN` 输出中文，`en` 输出英文 |
| 输出风格切换 | `style: concise` 精简模式，`detailed` 详细模式 |

**交付物**：支持完整配置的审查 Skill，不同团队可定制审查行为。

---

### Phase 3：平台集成（第 5-8 周）

**目标**：与 GitHub/GitLab 深度集成，支持自动触发和行内评论。

| 任务 | 验收标准 |
|------|---------|
| GitHub PR 自动触发 | PR 创建/更新时自动运行审查 |
| GitHub 行内评论 | 审查结果作为 PR inline comment 发布 |
| GitLab MR 自动触发 | MR 创建/更新时自动运行审查 |
| GitLab 行内评论 | 审查结果作为 MR discussion 发布 |
| 编写 `scripts/post-review.sh` | 能调用平台 API 发布审查结果 |
| CI/CD 集成指南 | 提供 GitHub Actions / GitLab CI 配置示例 |
| 审查摘要作为 PR 检查状态 | PR 状态显示 ✅/⚠️/❌ |

**交付物**：完整 CI 集成方案，PR 提交后自动审查并发布结果。

---

### Phase 4：高级 AI 特性（第 9-12 周）

**目标**：利用 AI 深层语义理解，实现超越规则引擎的审查能力。

| 任务 | 验收标准 |
|------|---------|
| 业务上下文感知 | 能理解"这是支付模块，金额计算需要特别小心" |
| 团队风格学习 | 从历史 review 记录提取团队偏好模式 |
| 跨 PR 影响分析 | 发现"这个 PR 改了接口但另一个 PR 还在用旧接口" |
| 一键修复建议 | 对部分发现生成可 git apply 的 patch |
| Review 质量评分 | 对审查结果本身评分，标注置信度 |
| 增量审查 | 只分析本次 diff 影响的范围，避免全量扫描 |
| 审查报告导出 | 支持 HTML / PDF 格式导出 |

**交付物**：企业级智能代码审查工具，具备自学习和上下文理解能力。

---

## 九、核心 Skill Prompt 设计要点

Skill 的核心是一个精心设计的 prompt，需包含：

1. **角色设定**：你是一位资深全栈工程师，精通代码审查
2. **流程定义**：读取 diff → 识别变更类型 → 按维度审查 → 分类定级 → 结构化输出
3. **规则注入**：将 `rules/*.md` 内容作为审查规则
4. **示例驱动**：每个规则配备正反例代码
5. **约束条件**：
   - 每个发现必须引用具体文件和行号
   - BLOCKER/HIGH 必须附带修复代码
   - 不确定的问题标注置信度，降级处理
   - 尊重项目配置中的规则覆盖
6. **输出格式**：严格按模板输出，确保可解析

---

## 十、测试策略

### 10.1 测试 fixtures 设计

| Fixture | 覆盖维度 | 预期发现 |
|---------|----------|----------|
| `vulnerable.ts` | S-01, S-03 | SQL 注入 + 敏感信息日志 |
| `slow-query.ts` | P-01, P-04 | N+1 查询 + 同步数据库调用 |
| `bad-practice.vue` | B-01, P-02 | v-for 缺 key + 缺虚拟滚动 |
| `race-condition.ts` | C-02, P-03 | 异步竞态 + 未清理订阅 |
| `clean-code.ts` | — | 无发现（负例测试） |

### 10.2 回归测试

每次修改 Skill prompt 或规则后，对全部 fixtures 运行审查，验证：
- 预期发现是否仍然被检出
- 是否引入新的误报
- 输出格式是否合规

---

## 十一、成功指标

| 指标 | Phase 1 目标 | Phase 4 目标 |
|------|-------------|-------------|
| 规则命中率 | ≥80% | ≥95% |
| 误报率 | ≤20% | ≤5% |
| 单次审查耗时 | <60s | <30s |
| 用户满意度 | 可用 | 离不开 |
| GitHub Stars | — | 1000+ |

---

## 十二、风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| LLM 输出不稳定 | 格式不规范、遗漏规则 | 严格 prompt 约束 + 输出校验脚本 |
| Token 成本高 | 大 PR 审查成本高 | 增量审查 + 配置文件过滤 + 分层审查 |
| 误报过多 | 用户信任度下降 | 宁可漏报不可误报 + 置信度标注 |
| 框架规则覆盖不全 | 审查深度不足 | 按 Phase 逐步扩展，优先覆盖主流框架 |
| 平台 API 限流 | 自动审查失败 | 退化为本地手动审查 + 重试机制 |

---

## 十三、发布计划

| 版本 | 对应 Phase | 时间 | 里程碑 |
|------|-----------|------|--------|
| v0.1.0 | Phase 1 | 第 2 周 | MVP：本地审查可用 |
| v0.2.0 | Phase 2 | 第 4 周 | 支持团队配置 |
| v0.3.0 | Phase 3 | 第 8 周 | GitHub/GitLab 集成 |
| v1.0.0 | Phase 4 | 第 12 周 | 正式发布，高级 AI 特性 |

---

## 十四、参考资料

- [Claude Code Skills 文档](https://docs.anthropic.com/en/docs/claude-code/skills)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vue.js 风格指南](https://vuejs.org/style-guide/)
- [React 最佳实践](https://react.dev/learn)
- [Google Engineering Practices](https://google.github.io/eng-practices/review/)
