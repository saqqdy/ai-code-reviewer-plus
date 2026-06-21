# Smart Code Reviewer — 详细发版计划

---

## 一、版本命名规范

采用 [Semantic Versioning 2.0](https://semver.org/)：

```
v主版本.次版本.修订版本[-预发布标识]

示例：
v0.1.0-alpha.1   → 内部测试版
v0.1.0           → 正式发布
v0.1.1           → 补丁修复
v1.0.0           → 重大版本
```

| 标识 | 含义 | 适用场景 |
|------|------|----------|
| `alpha.N` | 功能不完整，可能有严重缺陷 | 内部验证 |
| `beta.N` | 功能完整，可能有问题 | 小范围公测 |
| `rc.N` | 候选发布版，无已知阻塞问题 | 发布前最后验证 |
| 无标识 | 正式发布 | 生产可用 |

**分支策略**：

```
main            ← 稳定发布分支（只接受 merge）
├── develop     ← 开发集成分支
├── feature/*   ← 功能分支
├── fix/*       ← 修复分支
└── release/*   ← 发布准备分支
```

---

## 二、Sprint 0 — 项目准备期（第 0 周，3天）

> 在正式开发前完成项目基础设施搭建，确保后续 Sprint 可以立即进入开发。

| 日期 | 任务 | 产出 |
|------|------|------|
| D1 上午 | 创建 GitHub 仓库，初始化项目结构 | 仓库 + 目录骨架 |
| D1 下午 | 编写 CLAUDE.md、README.md | 项目文档 |
| D2 上午 | 配置 CI（lint + 文件结构校验） | `.github/workflows/ci.yml` |
| D2 下午 | 编写 `.ai-code-reviewer.example.yml` | 配置模板 |
| D3 上午 | 创建测试 fixtures 骨架（5个文件） | `tests/fixtures/*` |
| D3 下午 | 确认 Sprint 1 任务分配 | Sprint 1 Backlog |

**Sprint 0 完成标准**：

- [ ] 仓库可 clone，结构完整
- [ ] CI 流水线绿灯
- [ ] 测试 fixtures 骨架就位

---

## 三、v0.1.0 — MVP 本地审查

**版本代号**：`ignite` 🚀
**Sprint 周期**：第 1-2 周（2 个 Sprint）

### 功能范围

| 包含 ✅ | 不包含 ❌ |
|---------|-----------|
| 手动触发 `/code-review` 命令 | 自动 PR 触发 |
| 5 维度审查（正确性/安全/性能/可维护/最佳实践） | 团队配置覆盖 |
| BLOCKER ~ SUGGESTION 五级分类 | 多语言输出 |
| Markdown 审查报告输出 | JSON 输出 |
| 项目类型自动检测（Vue/React/Node/Go/Python） | 框架特定规则 |
| 配置文件模板 | 配置文件实际加载 |
| 5 个测试 fixtures | 完整回归测试套件 |

---

### Sprint 1（第 1 周）：核心审查引擎

| 日期 | 任务 | 详细说明 | 产出 |
|------|------|----------|------|
| D1 | 编写 Skill 主文件 `skills/smart-code-reviewer.md` | 角色设定 + 审查流程 + 输出模板 + 约束条件，约 200-300 行 | Skill 主文件 |
| D2 | 编写 `scripts/get-diff.sh` | 支持 `get-diff.sh main`（与 main 分支对比）和 `get-diff.sh HEAD~1`（最近一次提交）；输出 unified diff | Diff 获取脚本 |
| D3 | 编写 `scripts/detect-project.sh` | 检测 package.json / go.mod / requirements.txt / Cargo.toml 等，输出项目类型到 stdout | 项目检测脚本 |
| D4 | 编写审查规则 `rules/correctness.md` + `rules/security.md` | 每个规则含：编号、名称、严重级别、问题描述、正反例代码、判断要点 | 2 个规则文件 |
| D5 | 编写审查规则 `rules/performance.md` + `rules/maintainability.md` + `rules/best-practices.md`（通用） | 同上格式 | 3 个规则文件 |

**Sprint 1 完成标准**：

- [ ] Skill 文件加载无报错
- [ ] `get-diff.sh main` 在有 diff 的分支上输出正确
- [ ] `detect-project.sh` 对 5 种项目类型识别正确
- [ ] 每个规则文件含 ≥5 条规则，每条含正反例

---

### Sprint 2（第 2 周）：端到端流程 + 发布

| 日期 | 任务 | 详细说明 | 产出 |
|------|------|----------|------|
| D1 | 编写输出模板 `templates/review-body.md` | 含标题区、分组发现区（按严重级别）、维度评分表、Footer | Markdown 模板 |
| D2 | 完善测试 fixtures | `vulnerable.ts`(SQL注入+敏感日志)、`slow-query.ts`(N+1+同步IO)、`bad-practice.vue`(v-for缺key+缺虚拟滚动)、`race-condition.ts`(异步竞态+未清订阅)、`clean-code.ts`(纯净代码) | 5 个 fixture 文件 |
| D3 | 端到端集成测试 | 对 5 个 fixtures 运行审查，验证命中率和输出格式 | 测试结果记录 |
| D4 | 修复集成问题 + Prompt 调优 | 根据测试结果调整 Skill prompt，提高命中率至 ≥80% | Prompt 修订版 |
| D5 | **发布 v0.1.0** | 打 tag、写 CHANGELOG、发布 README | GitHub Release |

**v0.1.0 质量门禁**：

| 指标 | 通过标准 |
|------|----------|
| 规则命中率 | ≥ 80%（已知 fixtures） |
| 输出格式合规率 | 100%（必须包含文件+行号） |
| BLOCKER/HIGH 附带修复代码 | ≥ 90% |
| 无咒语/幻觉输出 | 0 例（人工抽检） |
| 单次审查耗时 | < 60s（<500 行 diff） |

**v0.1.0 已知限制**：

- 仅支持 Markdown 输出
- 配置文件模板仅供参考，实际不会加载
- 仅内置通用最佳实践规则，无框架特定规则
- 大 diff（>2000 行）可能超时或截断
- 英文输出

---

### v0.1.0 CHANGELOG 模板

```markdown
## v0.1.0 "ignite" 🚀 — 2026-07-05

### Added
- 🎉 首个发布版本！
- 5 维度审查引擎：正确性 / 安全性 / 性能 / 可维护性 / 最佳实践
- 5 级严重分类：BLOCKER / HIGH / MEDIUM / LOW / SUGGESTION
- 项目类型自动检测：Vue / React / Node / Go / Python
- Markdown 格式审查报告输出
- 25+ 条内置审查规则（含正反例代码）
- 5 个测试 fixtures 供验证

### Known Limitations
- 仅支持手动 `/code-review` 触发
- 不支持配置文件加载
- 仅 Markdown 输出格式
- 英文输出
```

---

## 四、v0.2.0 — 团队定制化

**版本代号**：`tailor` 🧵
**Sprint 周期**：第 3-4 周（2 个 Sprint）

### 功能范围

| 包含 ✅ | 不包含 ❌ |
|---------|-----------|
| 加载 `.ai-code-reviewer.yml` 配置 | GitHub/GitLab 集成 |
| 规则禁用（`rules.disable`） | 自定义规则编写 |
| 规则严重级别调整（`rules.severity`） | 团队风格学习 |
| 文件 include/exclude 过滤 | 增量审查 |
| 严重级别阈值过滤（`min_severity`） | HTML/PDF 报告 |
| 最大发现数限制（`max_findings`） | |
| 框架规则自动加载（`best-practices/vue.md` 等） | |
| 中英文输出切换（`preferences.language`） | |
| 输出风格切换（`concise/detailed`） | |

---

### Sprint 3（第 3 周）：配置系统

| 日期 | 任务 | 详细说明 | 产出 |
|------|------|----------|------|
| D1 | 编写配置文件解析逻辑（内嵌于 Skill prompt） | 在 Skill 中加入读取 `.ai-code-reviewer.yml` 的指令，使用 Claude Code 的文件读取能力 | Skill prompt 更新 |
| D2 | 实现 `rules.disable` + `rules.severity` | 审查时跳过被禁用的规则，使用覆盖后的严重级别 | 功能实现 |
| D3 | 实现 `include` / `exclude` 文件过滤 | 使用 glob 模式匹配，过滤掉 exclude 的文件变更 | 功能实现 |
| D4 | 实现 `min_severity` + `max_findings` | 审查后按阈值过滤，按严重级别排序后截断 | 功能实现 |
| D5 | 端到端测试：配置覆盖 | 创建含自定义配置的测试项目，验证所有覆盖生效 | 测试记录 |

**Sprint 3 完成标准**：

- [ ] `.ai-code-reviewer.yml` 存在时，所有配置项生效
- [ ] 不存在配置文件时，使用默认值，行为与 v0.1.0 一致
- [ ] 无效配置文件给出明确错误提示

---

### Sprint 4（第 4 周）：框架规则 + 多语言 + 发布

| 日期 | 任务 | 详细说明 | 产出 |
|------|------|----------|------|
| D1 | 编写 `rules/best-practices/vue.md` | Vue 3 + Composition API 最佳实践，≥8 条规则 | Vue 规则文件 |
| D2 | 编写 `rules/best-practices/react.md` + `rules/best-practices/node.md` | React Hooks 最佳实践 + Node.js 安全与性能 | React + Node 规则文件 |
| D3 | 实现框架规则自动加载 | `detect-project.sh` 输出类型后，Skill 自动注入对应规则 | 功能实现 |
| D4 | 实现中英文输出 + 输出风格切换 | 在 prompt 中加入语言/风格指令，模板支持 i18n | 功能实现 |
| D5 | **发布 v0.2.0** | 打 tag、更新 CHANGELOG、更新 README | GitHub Release |

**v0.2.0 质量门禁**：

| 指标 | 通过标准 |
|------|----------|
| 配置项全部生效 | 6/6 配置覆盖可验证 |
| v0.1.0 回归 | fixtures 命中率不下降 |
| 框架规则加载 | Vue 项目自动加载 Vue 规则并可触发 |
| 中文输出可用 | 输出内容自然、无机器翻译痕迹 |
| 向后兼容 | 无配置文件时行为与 v0.1.0 完全一致 |

---

## 五、v0.3.0 — 平台集成

**版本代号**：`bridge` 🌉
**Sprint 周期**：第 5-8 周（4 个 Sprint）

### 功能范围

| 包含 ✅ | 不包含 ❌ |
|---------|-----------|
| GitHub PR 自动触发（GitHub Actions） | GitLab 集成（v0.3.1） |
| PR 行内评论发布 | 自动 approve/merge |
| PR 状态检查（✅/⚠️/❌） | 一键修复 |
| JSON 结构化输出 | HTML/PDF 报告 |
| `.github/workflows/code-review.yml` 模板 | |
| GitHub App 安装指南 | |
| 审查结果缓存（同一 commit 不重复审查） | |

---

### Sprint 5（第 5 周）：GitHub API 基础

| 日期 | 任务 | 详细说明 | 产出 |
|------|------|----------|------|
| D1 | 学习 GitHub PR Review API | 研究 `POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews` | API 调研笔记 |
| D2 | 编写 `scripts/post-review.sh` | 接收 JSON 审查结果，调用 GitHub API 创建 Review + 行内评论 | Shell 脚本 |
| D3 | 编写 `scripts/post-review.sh` 续 | 支持批量行内评论（每条 finding 一个 comment） | 脚本完善 |
| D4 | GitHub Token 权限设计 | 最小权限原则：只需 `pull_request: write` | 权限文档 |
| D5 | 本地 API 调用测试 | 使用 `gh` CLI + 测试仓库验证评论发布 | 测试通过 |

---

### Sprint 6（第 6 周）：GitHub Actions 集成

| 日期 | 任务 | 详细说明 | 产出 |
|------|------|----------|------|
| D1 | 编写 GitHub Actions workflow 模板 | `on: pull_request` 触发，checkout + diff + review + post | workflow YAML |
| D2 | Claude Code CI 集成方案 | 解决 API Key 传递、Docker 环境问题 | CI 集成文档 |
| D3 | PR 状态检查实现 | 根据 `conclusion` 字段设置 commit status：pass/needs_changes/fail | 状态检查脚本 |
| D4 | 审查去重（同 commit 缓存） | 检查 PR 的最新 commit 是否已审查过，避免重复 | 去重逻辑 |
| D5 | 端到端 CI 测试 | 在测试仓库提交 PR，验证自动审查完整流程 | 测试通过 |

---

### Sprint 7（第 7 周）：JSON 输出 + GitLab MR 支持

| 日期 | 任务 | 详细说明 | 产出 |
|------|------|----------|------|
| D1 | 实现 JSON 结构化输出 | 按开发计划中定义的 JSON Schema 输出 | JSON 输出功能 |
| D2 | 编写 JSON Schema 校验 | 使用 `ajv` 或 `python-jsonschema` 校验输出合规 | 校验脚本 |
| D3 | GitLab MR API 调研 | 研究 GitLab MR Discussions API | API 调研笔记 |
| D4 | 编写 `scripts/post-review-gitlab.sh` | 调用 GitLab API 发布 MR discussion | GitLab 脚本 |
| D5 | 编写 GitLab CI 模板 | `.gitlab-ci.yml` 模板 | CI 模板 |

---

### Sprint 8（第 8 周）：集成测试 + 文档 + 发布

| 日期 | 任务 | 详细说明 | 产出 |
|------|------|----------|------|
| D1 | GitHub 集成回归测试 | 多场景覆盖：小 PR / 大 PR / 纯文档 PR / 无变更 PR | 测试报告 |
| D2 | GitLab 集成冒烟测试 | 在 GitLab.com 测试仓库验证 | 冒烟测试通过 |
| D3 | 编写集成指南文档 | `docs/github-integration.md` + `docs/gitlab-integration.md` | 用户文档 |
| D4 | 更新 README + FAQ | 安装步骤、配置说明、常见问题 | README 更新 |
| D5 | **发布 v0.3.0** | 打 tag、CHANGELOG、Release Notes | GitHub Release |

**v0.3.0 质量门禁**：

| 指标 | 通过标准 |
|------|----------|
| GitHub PR 自动审查 | 创建 PR 后 120s 内收到审查评论 |
| 行内评论准确率 | ≥85% 行号指向正确位置 |
| 状态检查可靠率 | ≥99% 正确设置 pass/fail |
| v0.2.0 功能回归 | 配置加载、规则覆盖全部正常 |
| GitLab MR 基本可用 | 可发布 MR discussion（不含行内评论也可接受） |
| API 限流处理 | 遇到 429 响应时优雅降级 |

---

## 六、v1.0.0 — 正式发布

**版本代号**：`sentinel` 🛡️
**Sprint 周期**：第 9-12 周（4 个 Sprint）

### 功能范围

| 包含 ✅ | 不包含 ❌ |
|---------|-----------|
| 业务上下文感知（模块注释 → 审查侧重） | 自动学习团队风格（v1.1） |
| 跨 PR 影响分析基础版 | 完整跨仓库分析 |
| 一键修复建议（生成 patch 文件） | 自动创建修复 PR |
| Review 质量评分 + 置信度标注 | 人工 review 对比评分 |
| 增量审查（只分析 diff 涉及的上下文） | 完整项目级分析 |
| HTML 报告导出 | PDF 报告（v1.1） |
| NPM 包发布 | Homebrew / Apt（v1.1） |
| 完整用户文档网站 | API 文档（v1.1） |

---

### Sprint 9（第 9 周）：业务上下文 + 增量审查

| 日期 | 任务 | 详细说明 | 产出 |
|------|------|----------|------|
| D1 | 设计业务上下文注入方案 | 通过 `preferences.context` 配置或 `@review-context` 注释 | 设计文档 |
| D2 | 实现上下文感知审查 | 支付模块强调金额精度、权限模块强调鉴权等 | 功能实现 |
| D3 | 设计增量审查策略 | 只读取 diff 涉及的文件 + 直接 import 的文件（最多 2 跳） | 设计文档 |
| D4 | 实现增量上下文获取 | 从 diff 文件列表出发，收集相关上下文文件 | 功能实现 |
| D5 | 对比测试：全量 vs 增量 | 相同 PR 两种模式的命中率对比 + 耗时对比 | 性能报告 |

**Sprint 9 完成标准**：

- [ ] 含 `@review-context` 注释的文件，审查侧重点明显不同
- [ ] 增量审查命中率 ≥ 全量审查的 85%
- [ ] 增量审查耗时降低 ≥ 40%

---

### Sprint 10（第 10 周）：一键修复 + 质量评分

| 日期 | 任务 | 详细说明 | 产出 |
|------|------|----------|------|
| D1 | 设计 patch 生成格式 | 统一 diff 格式，可 `git apply` | 设计文档 |
| D2 | 实现修复代码生成 | BLOCKER/HIGH 级别自动生成修复 patch | 功能实现 |
| D3 | 编写 `scripts/apply-fix.sh` | 列出可用 patch，交互式选择应用 | 应用脚本 |
| D4 | 设计 Review 质量评分 | 置信度（高/中/低）+ 审查覆盖度（已分析行数/总变更行数） | 设计文档 |
| D5 | 实现置信度标注 | 每条 finding 标注 confidence: high/medium/low | 功能实现 |

---

### Sprint 11（第 11 周）：HTML 报告 + NPM 包 + 跨 PR 分析

| 日期 | 任务 | 详细说明 | 产出 |
|------|------|----------|------|
| D1 | 编写 HTML 报告模板 | 可折叠的发现详情、维度评分雷达图、代码高亮 | HTML 模板 |
| D2 | 实现 Markdown → HTML 转换 | 使用模板引擎生成完整 HTML 报告 | 转换脚本 |
| D3 | NPM 包结构设计 | `package.json` + 入口文件 + CLI 命令 `ai-code-review` | 包骨架 |
| D4 | 跨 PR 影响分析基础版 | 读取同仓库已 open 的 PR 列表，交叉检查接口变更 | 功能实现 |
| D5 | NPM 包本地测试 | `npm link` + 本地项目运行验证 | 测试通过 |

---

### Sprint 12（第 12 周）：正式发布

| 日期 | 任务 | 详细说明 | 产出 |
|------|------|----------|------|
| D1 | 全面回归测试 | 全部 fixtures + 集成测试 + 配置兼容性 | 测试报告 |
| D2 | 文档站点搭建 | 使用 VitePress 搭建文档站 | 文档站点 |
| D3 | NPM 发布准备 | 最终测试、`npm publish --dry-run` | 预发布验证 |
| D4 | **发布 v1.0.0** | NPM publish + GitHub Release + 文档站上线 | 正式发布 |
| D5 | 发布推广 | 掘金/知乎文章、Twitter 宣传、V2EX 帖子 | 营销物料 |

**v1.0.0 质量门禁**：

| 指标 | 通过标准 |
|------|----------|
| 规则命中率 | ≥ 95%（所有 fixtures） |
| 误报率 | ≤ 5%（人工抽检 50 条） |
| 单次审查耗时 | < 30s（<500 行 diff） |
| 修复 patch 可应用率 | ≥ 80%（BLOCKER/HIGH） |
| 置信度标注准确率 | ≥ 85%（高置信度 = 确实是问题） |
| NPM 包安装成功率 | 100%（macOS + Linux） |
| 文档完整性 | 覆盖所有公开功能 |
| v0.3.0 功能回归 | 全部正常 |

---

## 七、质量门禁总览

每个版本发布前必须通过以下全部检查：

### 7.1 自动化检查

| 检查项 | 工具 | 通过标准 |
|--------|------|----------|
| Shell 脚本语法检查 | `shellcheck` | 0 error |
| YAML 配置校验 | `yamllint` | 0 error |
| Markdown 格式检查 | `markdownlint` | 0 error |
| 文件结构完整性 | 自定义脚本 | 所有必需文件存在 |
| Fixtures 回归测试 | 自定义脚本 | 命中率 ≥ 阈值 |

### 7.2 人工检查

| 检查项 | 方法 | 通过标准 |
|--------|------|----------|
| 输出质量抽检 | 随机抽 10 个 diff 运行审查 | 无幻觉、无咒语、格式合规 |
| 误报抽检 | 随机抽 20 条发现人工判断 | 误报率 ≤ 阈值 |
| 文档准确性 | 对照代码验证文档步骤 | 用户可按文档完成操作 |
| 破坏性变更 | 对比上一版本的默认行为 | 向后兼容或有迁移指南 |

### 7.3 各版本阈值

| 门禁指标 | v0.1.0 | v0.2.0 | v0.3.0 | v1.0.0 |
|----------|--------|--------|--------|--------|
| 规则命中率 | ≥80% | ≥85% | ≥90% | ≥95% |
| 误报率 | ≤20% | ≤15% | ≤10% | ≤5% |
| 耗时（<500行） | <60s | <45s | <45s | <30s |
| 修复代码附带率 | ≥90% | ≥90% | ≥85% | ≥80% |

---

## 八、发布流程

```bash
# 1. 创建发布分支
git checkout develop
git checkout -b release/v0.1.0

# 2. 更新版本号
# - package.json（如有）
# - CHANGELOG.md

# 3. 运行质量门禁
./scripts/qa-check.sh

# 4. 合并到 main
git checkout main
git merge release/v0.1.0 --no-ff

# 5. 打 tag
git tag -a v0.1.0 -m "v0.1.0 ignite: MVP local code review"

# 6. 推送
git push origin main --tags

# 7. 创建 GitHub Release
gh release create v0.1.0 \
  --title "v0.1.0 ignite 🚀" \
  --notes-file CHANGELOG-v0.1.0.md

# 8. 合并回 develop
git checkout develop
git merge release/v0.1.0

# 9. 清理
git branch -d release/v0.1.0
```

---

## 九、回滚方案

| 场景 | 回滚方式 | 操作 |
|------|----------|------|
| 版本缺陷但可热修 | Patch release | 从 tag 创建 fix 分支，发布 v0.1.1 |
| 版本严重缺陷 | 版本回退 | `git revert` merge commit，重打 tag |
| CI 集成失败 | 禁用 workflow | 仓库 Settings → Actions → 禁用对应 workflow |
| NPM 包有问题 | NPM 废弃 | `npm deprecate ai-code-reviewer@1.0.0 "reason"` |
| 配置文件格式不兼容 | 版本锁定 | 文档标注受影响版本，提供迁移脚本 |

---

## 十、发布后监控

### 10.1 自动收集指标

| 指标 | 收集方式 | 频率 |
|------|----------|------|
| GitHub Stars | GitHub API | 每日 |
| NPM 周下载量 | NPM API | 每周 |
| Issue 数量/分类 | GitHub API | 每日 |
| CI 运行成功率 | GitHub Actions | 每次 |
| 审查耗时 | 内置计时 | 每次审查 |

### 10.2 用户反馈渠道

| 渠道 | 用途 |
|------|------|
| GitHub Issues | Bug 报告 + 功能请求 |
| Discussions | 问答 + 使用技巧 |
| 掘金/知乎评论区 | 中文用户反馈 |
| Twitter/X | 英文用户反馈 |

### 10.3 紧急响应

| 严重程度 | 响应时间 | 处理方式 |
|----------|----------|----------|
| 安全漏洞 | 24h 内 | 紧急 patch release |
| 阻塞性 Bug | 48h 内 | Hotfix 分支 + patch release |
| 一般 Bug | 下一 Sprint | 正常 fix 分支 |
| 功能请求 | 下一版本评审 | 加入 Backlog |

---

## 十一、后续版本规划（v1.x）

| 版本 | 时间 | 重点 |
|------|------|------|
| v1.1.0 | 第 14-16 周 | 团队风格学习 + PDF 报告 + Homebrew 安装 |
| v1.2.0 | 第 18-20 周 | 自定义规则 DSL + 多仓库分析 |
| v1.3.0 | 第 22-24 周 | VS Code 插件（非 Claude Code 依赖） |
| v2.0.0 | 第 28-32 周 | 多模型支持（GPT/Claude/Gemini）+ 企业版 |

---

## 十二、版本发布时间线总览

```
Week 0      Week 2      Week 4      Week 6      Week 8      Week 10     Week 12
  │           │           │           │           │           │           │
  ▼           ▼           ▼           ▼           ▼           ▼           ▼
┌─────┐   ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐
│ S0  │──▶│ S1  │──▶ │ S3  │──▶ │ S5  │──▶ │ S7  │──▶ │ S9  │──▶ │ S11 │
│准备  │   │ S2  │    │ S4  │    │ S6  │    │ S8  │    │ S10 │    │ S12 │
└─────┘   └──┬──┘    └──┬──┘    └──┬──┘    └──┬──┘    └──┬──┘    └──┬──┘
             │           │           │           │           │           │
          v0.1.0      v0.2.0      ┌───────┐   v0.3.0      ┌───────┐   v1.0.0
          ignite      tailor      │中间版本│   bridge      │中间版本│   sentinel
                                   └───────┘               └───────┘
```

| 里程碑 | 日期 | 版本 | 价值主张 |
|--------|------|------|----------|
| M1 | 2026-07-05 | v0.1.0 | "第一个能用的 AI 代码审查" |
| M2 | 2026-07-19 | v0.2.0 | "适配你的团队，不是你适配它" |
| M3 | 2026-08-16 | v0.3.0 | "提交 PR，审查自动来" |
| M4 | 2026-09-13 | v1.0.0 | "企业级智能代码审查，正式发布" |
