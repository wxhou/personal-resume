## Context

当前站点是单页简历（React 18 + Vite 5 + Tailwind + framer-motion），数据全部硬编码在 `src/App.jsx`（519 行单文件），部署在 GitHub Pages（`/personal-resume/` 子路径）。已完成的简历视觉系统（4 套主题：原始/精密/杂志/几何，CSS 变量驱动 + 主题切换器 + 导出 PDF/图片）是重要资产，必须原样保留。

用户目标：让网站成为「互联网上的名片」——有人能通过它看到自己、发现自己的价值。这意味着：首页门面、内容聚合（博客园文章）、自己的项目展示、SEO 基础（爬虫/AI/微信分享可见）、干净的 URL。

## Goals / Non-Goals

**Goals:**
- 多页面个人主页：`/` 首页 + `/resume` 简历页
- 首页四区块：Hero、精选项目（自己的 GitHub 项目）、最新博客（博客园聚合）、找到我
- 简历页整体平移，4 套主题 + 导出功能零损失
- 构建时预渲染静态 HTML，解决 SPA 的 SEO/微信分享问题
- 部署迁移到 Vercel，根路径 URL
- 简历数据抽离为可复用模块

**Non-Goals:**
- 不自建博客系统（不引入 Markdown 内容层、无博客详情页）——博客就是「聚合 + 跳转博客园」
- 不做项目详情页（/projects/:name）——首页卡片先行，以后按需加
- 不迁移博客园历史文章到自站
- 不引入后端服务/数据库

## Decisions

### D1: 路由 — react-router-dom + BrowserRouter
- **选择**：`react-router-dom` v6，BrowserRouter（history 模式）
- **理由**：Vercel 支持 SPA fallback（rewrites 到 index.html），history 模式 URL 干净（`/resume` 而非 `/#/resume`），预渲染时路由可正常生成静态页面
- **备选**：HashRouter（URL 丑，SEO 差，弃）；自写状态路由（不成熟，弃）

### D2: 静态生成 — vite-react-ssg
- **选择**：`vite-react-ssg`（基于 react-dom/server 的静态站点生成，构建时渲染路由 → 输出静态 HTML）
- **理由**：无 puppeteer/Chromium 依赖，Vercel 构建环境稳定、产物更小；仍是 React + Vite 技术栈，符合用户约束；维护活跃
- **framer-motion 处理**：SSR 时 framer-motion 会渲染 `initial` 态（`opacity:0`），导致静态 HTML 内容不可见。方案：App 根部包 `<MotionConfig reducedMotion="user">`，SSG 渲染时模拟 `prefers-reduced-motion: reduce`（vite-react-ssg 支持在渲染时注入 media 模拟），使静态 HTML 直接输出最终可见态；运行时用户动画照常
- **备选**：vite-plugin-prerender（puppeteer 依赖，Vercel 构建环境下载 Chromium 有失败风险，插件维护不活跃，弃）；react-snap（React 18 兼容性差，弃）

### D3: 博客聚合 — 构建时 Node 脚本拉 RSS 生成 JSON
- **选择**：构建脚本（`scripts/fetch-blog.js`）在 `vite build` 前运行，fetch 博客园 RSS（`https://www.cnblogs.com/wxhou/rss`）→ 解析 → 写 `src/data/blog.json`
- **理由**：预渲染时内容已就位，爬虫直接看到文章列表；无运行时跨域问题；构建失败不阻塞（容错为空数组）
- **备选**：Vercel Serverless Function 代理（运行时拉取，爬虫看不到，弃）；手动维护 JSON（每次发文章手动更新，易忘，弃）

### D4: 项目数据 — 手动维护精选 JSON
- **选择**：`src/data/featuredProjects.json` 手动维护 4-6 个代表性项目（名称、描述、语言、GitHub 链接）
- **理由**：可控、稳定、有质感——只展示想展示的，写自己的描述；不依赖 GitHub API 限流
- **命名**：与简历数据 `resume.js` 中的工作项目（`workProjects`）区分，避免两套「projects」混淆
- **备选**：构建时拉 GitHub API（限流风险、全量列表无筛选，弃）

### D5: 部署 — Vercel + vercel.json
- **选择**：Vercel 部署，`vercel.json` 配置 `rewrites: [{ source: "/(.*)", destination: "/index.html" }]`（SPA fallback）+ 构建命令
- **理由**：Vercel 对 Vite 开箱即用；百度收录优于 github.io；根路径 URL；以后可绑自定义域名
- **备选**：GitHub Pages（百度收录差、子路径，弃）

### D6: 数据抽离 — src/data/ 模块
- **选择**：简历数据（personalInfo、skills、experience、workProjects、evaluations、personalLinks）从 App.jsx 抽到 `src/data/resume.js`，首页复用姓名/职位/技能/链接
- **命名**：工作项目命名为 `workProjects`（简历页用），与首页 `featuredProjects.json`（自有项目）语义区分
- **理由**：首页与简历页共享数据；为将来换框架/换内容源留余地

### D7: 简历页保留 — 整体平移
- **选择**：简历页组件（含主题切换器、导出按钮、A4 布局）从 App.jsx 平移为 `src/pages/ResumePage.jsx`，CSS 变量系统与主题逻辑不动
- **理由**：视觉系统是已归档 spec（resume-visual-system 等 5 个 capability）的成果，零改动保留

### D8: 首页独立视觉设计
- **选择**：首页使用独立设计语言，不复用简历 4 套主题的 CSS 变量与 class；为首页定义独立样式作用域（如 `home-` 前缀 class 或独立 CSS 文件），避免 index.css 的简历专属全局样式污染首页
- **理由**：首页是「门面」，需要自己的视觉身份；简历主题是 A4 文档排版体系，不适合直接套用
- **边界**：`index.css` 的 `:root` 全局变量（背景色、字体）仍会影响首页，首页样式需显式覆盖或限定作用域

## Risks / Trade-offs

- [framer-motion 动画在 SSG 时渲染 `opacity:0` 初始态，静态 HTML 内容不可见] → `MotionConfig reducedMotion="user"` + SSG 渲染时模拟 `prefers-reduced-motion: reduce`，静态 HTML 输出最终可见态；运行时动画照常。构建后验证产物无 `opacity:0` 内联样式
- [博客园 RSS 拉取失败（网络/格式变化）] → 构建脚本 try/catch，失败时 blog.json 为空数组，首页博客区块自动隐藏，构建不失败
- [SSG 与主题切换冲突] → SSG 仅输出默认主题（original）的 HTML；主题切换是运行时行为，localStorage 持久化不受影响
- [导出 PDF/图片在 /resume 子路径下失效] → 导出逻辑基于 DOM 元素 id（resume-a4），与路径无关；迁移后浏览器实测验证
- [BrowserRouter 直接访问 /resume 404] → Vercel rewrites 兜底；本地开发 Vite 自带 history fallback
- [gh-pages 部署残留] → 移除 gh-pages 依赖与 deploy 脚本，README 更新部署说明
- [首页继承 index.css 全局暗色变量] → 首页独立样式作用域显式覆盖（D8）

## Migration Plan

1. 数据抽离（纯重构，行为不变）→ 浏览器验证简历页正常
2. 引入路由，简历页挂到 /resume，首页占位 → 验证两页可访问
3. 首页四区块实现 + 博客/项目数据 → 验证展示
4. 预渲染配置 → 验证构建产物含静态 HTML
5. vercel.json + Vercel 部署 → 线上验证（含直接访问 /resume）
6. 移除 gh-pages 残留

回滚策略：Vercel 保留 GitHub Pages 部署不动，若线上异常可切回旧部署；代码层面各步骤独立提交，可逐级回退。

## Open Questions

- 自定义域名：先使用 `*.vercel.app` 域名，后续按需绑定（不影响本 change 的路径设计）
- 首页独立视觉的具体风格方向：实现时确认（不套简历主题，但可参考其配色气质）
