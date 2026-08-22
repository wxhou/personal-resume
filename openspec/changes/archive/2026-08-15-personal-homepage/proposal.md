## Why

当前站点是一个单页简历（`wxhou.github.io/personal-resume/`），但用户的核心目标是「有人能通过网站看到我、发现我，在互联网上展示自己的价值」。单页简历无法承载这个目标：它没有首页门面、没有内容聚合、没有 SEO 基础，且部署在 GitHub Pages 上（百度收录差、URL 带子路径）。需要将站点升级为个人主页，简历成为其中一个子页面。

## What Changes

- 站点从单页简历升级为多页面个人主页，使用 react-router-dom 路由：
  - `/` — 首页：Hero（姓名 + 定位 + CTA）、技能栈标签、精选项目（自己的 GitHub 项目）、最新博客（博客园文章聚合）、找到我（社交链接）
  - `/resume` — 简历页：现有简历整体平移，4 套主题切换 + 导出 PDF/图片功能原样保留
- 部署从 GitHub Pages 迁移到 **Vercel**，base 路径从 `/personal-resume/` 改为根路径 `/`
- 简历数据从 `src/App.jsx` 抽离到 `src/data/` 模块，供首页与简历页复用
- 博客园文章聚合：构建时拉取博客园 RSS 生成 `blog.json`，首页展示文章卡片，点击跳转博客园
- GitHub 项目展示：手动维护精选项目 JSON（4-6 个代表性项目），首页展示项目卡片
- SEO 基础：构建时静态生成（vite-react-ssg）输出静态 HTML，配 meta 标签、Open Graph 标签与结构化数据
- 新增 `vercel.json` 部署配置（SPA fallback、构建命令）

## Capabilities

### New Capabilities

- `site-routing`: 多页面路由与站点导航（`/` 与 `/resume` 两个页面，导航链接与激活态）
- `homepage`: 首页布局与内容（Hero、技能栈、精选项目、博客聚合、找到我五个区块，独立视觉设计）
- `blog-aggregation`: 博客园 RSS 聚合（构建时生成数据 + 首页文章卡片展示）
- `project-showcase`: GitHub 项目展示（精选项目数据 + 首页项目卡片）
- `resume-page`: 简历页作为子页面挂载，现有主题切换与导出功能保留
- `seo-prerendering`: 构建时静态生成 HTML，页面 meta、Open Graph 标签与结构化数据
- `vercel-deployment`: Vercel 部署配置（SPA fallback、构建与输出配置）

### Modified Capabilities

（无，简历视觉系统 specs 不变——简历页内容与主题功能原样保留，仅挂载路径变化）

## Impact

- `src/App.jsx` — 重构为路由容器，简历内容抽离为独立页面组件
- `src/data/` — 新增数据模块（简历数据、博客数据、项目数据）
- `src/pages/` — 新增首页与简历页组件
- `vite.config.js` — base 路径改为 `/`，新增 vite-react-ssg 配置
- `vercel.json` — 新增部署配置
- `package.json` — 新增依赖：`react-router-dom`、`vite-react-ssg`；新增构建脚本（RSS 拉取）
- 部署目标：GitHub Pages → Vercel（`gh-pages` 依赖可移除）
- 无 API 变更，无后端服务
