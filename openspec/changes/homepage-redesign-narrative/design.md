## Context

上一 change（personal-homepage，已归档）完成了个人主页基础版：多页路由 + 五区块首页 + SSG + Vercel 部署。用户浏览 jingjinglearns.cc 后明确要求「参考照搬」该网站设计——其核心是单页滚动叙事 + 作品集式展示 + 有记忆点的文案。

与 jingjinglearns.cc 的素材差异：该站站长是独立开发者（获奖证书、上线产品、互动实验内容）；侯伟轩是求职中的 AI 应用工程师（真实资产：⭐8 开源项目、博客园 20 篇文章、8 年转型经历、微信求职渠道）。照搬结构、替换素材。

参考站结构（照搬范围）：导航 + Hero + 成就滚动条 + 精选项目（编号卡片）+ 补充项目 + 成果区 + About 三事实 + 联系区 + Footer。跳过：证据墙（无素材）、实验室（无内容）。

## Goals / Non-Goals

**Goals:**
- 首页改单页长滚动 + 锚点导航，六个 section（Hero/成就条/项目/成果/About/联系+博客）
- 照搬参考站的视觉手法：编号卡片、滚动条、FACT 式 About、区块编号（01/02…）
- 所有展示数据真实可核验（GitHub/博客园真实数据）
- 保持现有技术栈与部署不变（React + vite-react-ssg + Vercel）
- `/resume` 简历页零改动

**Non-Goals:**
- 不做深浅色切换（简历页已有 4 主题，首页保持浅色独立设计）
- 不做证据墙、实验室（无素材）
- 不做动效重的实现（参考站是纯 CSS 滚动，无 framer-motion 重动画；首页保留轻量淡入）
- 不改路由、构建、部署

## Decisions

### D1: 单页滚动 + 锚点导航
- **选择**：首页内部用 `<section id="...">` + 导航锚点链接（`#projects` 等），CSS `scroll-behavior: smooth` 或原生锚点跳转
- **理由**：照搬参考站结构；单页叙事比区块堆叠更有记忆点；无路由开销
- **边界**：SiteNav 在首页显示锚点链接（项目/成果/博客/关于/联系 + 简历路由链接），在简历页保持现状（首页/简历）

### D2: Hero 定位语候选（待用户选定）
基于真实经历起草三个方向，实现时用户提供选择或改写：
1. **「用 AI 解决真实问题」**——务实工程派，呼应地铁运维/室内定位/数字人的业务落地经历
2. **「从测试开发到 AI 应用工程师」**——转型叙事，突出 8 年成长弧线（测试 → 项目经理 → AI 应用）
3. **「把 AI 用到真实业务里」**——落地派，强调业务价值而非炫技
- 副标题：一句话介绍（AI 应用工程师 · 西安 · LangChain/RAG/Dify/Agent 落地）
- 状态条：求职中 · AI 应用工程师 · 西安（参照参考站的「全职独立开发 · 开放合作」格式）

### D3: 成就滚动条数据（真实可核验）
marquee 内容从真实数据生成（写死在数据文件，人工更新）：
- openspec-playwright GitHub ⭐8
- 博客园 20 篇技术文章持续输出
- 8 年工程经验（测试开发 → 项目经理 → AI 应用工程师）
- 西安地铁智慧运维平台等 4 个落地项目
- AI Agent / RAG / Dify / MCP 技术栈落地
- 实现：CSS animation 无限滚动（内容复制两份实现无缝循环），无 JS 依赖，SSG 输出直接可见

### D4: 项目卡片分层
- **精选层（SELECTED WORK）**：6 个现有 featuredProjects，卡片升级为：编号 01-06 + 标签（开源工具/实验项目/AI 应用）+ 技术栈 chips + 描述
- **补充层（MORE WORK）**：其余 GitHub 项目（yanjie-app、freellm-gather、minifly、code-review-tool 等）紧凑列表（名称 + 一句话），数据并入 featuredProjects.json 扩展字段或新建文件
- **理由**：照搬参考站分层；补充层展示广度但不稀释精选

### D5: 成果区用真实数据卡片
- **选择**：卡片网格展示可核验数据——GitHub（wxhou，15+ 仓库）、博客园（20 篇文章）、openspec-playwright（⭐8）、AI 应用工程师（在职）等，每张卡片带对应平台链接
- **理由**：用户选择「用真实数据替代」证据墙；数据可核验即信任感
- **数据维护**：卡片内容人工维护（写死数据文件），避免运行时 API

### D6: About 三事实（基于真实经历起草）
- FACT 01：测试开发起步——自动化测试框架（pytest/Selenium/Locust）打磨工程基本功
- FACT 02：项目经理四年——西安地铁智慧运维平台等 ToB 项目全流程交付
- FACT 03：AI 应用工程师——LangChain/RAG/Dify/Agent 落地地铁运维、室内定位场景
- **理由**：三段式 = 8 年成长弧线，比罗列技能有记忆点；实现时用户可改写

### D7: 联系区布局
- 微信二维码：占位框（TODO(user) 标注，用户提供二维码图片后替换 public/wechat-qr.png）
- 其余链接：GitHub / Gitee / 博客园 / 邮箱（现有数据）
- **理由**：求职场景微信是主渠道；占位先行不阻塞上线

## Risks / Trade-offs

- [锚点导航与 SSG 兼容] → 纯 `<a href="#id">` 锚点，无 JS 路由依赖，SSG 直接输出
- [marquee 动画在 prefers-reduced-motion 下应停止] → CSS `@media (prefers-reduced-motion: reduce) { animation: none }`
- [补充项目数据时效性] → 人工维护 JSON，README 注明更新方式
- [首页改版影响 SEO] → SSG 后关键内容（姓名/职位/项目名）仍在静态 HTML；postbuild 清理逻辑不变
- [SiteNav 双态（首页锚点/简历页路由）复杂度] → 用 useLocation 判断当前页面渲染不同链接，逻辑集中一处

## Migration Plan

1. 数据扩展（achievements、项目分层）→ 构建通过
2. HomePage 重写（单页滚动 + 六 section）→ 浏览器实测锚点导航/滚动
3. SiteNav 双态改造 → 两页导航验证
4. SSG 构建验证（无 opacity:0、内容可见）→ 线上部署 → 回归

回滚：单 commit 改版，异常时 revert 即恢复现版首页。

## Open Questions

- Hero 定位语三选一（D2 候选），实现时用户选定
- 微信二维码图片，用户提供后替换占位
