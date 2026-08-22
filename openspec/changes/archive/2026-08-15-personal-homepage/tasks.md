## 1. 数据抽离

- [x] 1.1 创建 `src/data/resume.js`，将 App.jsx 中的 personalInfo、skills、experience、workProjects（原 projects 改名）、evaluations、personalLinks 数据迁移过去
- [x] 1.2 创建 `src/data/featuredProjects.json`，手动维护 4-6 个精选 GitHub 项目（名称、描述、语言、URL）
- [x] 1.3 创建 `scripts/fetch-blog.js`：拉取博客园 RSS → 解析 → 生成 `src/data/blog.json`（title/link/pubDate/summary，按日期倒序，失败时为空数组）
- [x] 1.4 package.json 增加 `prebuild` 脚本运行 fetch-blog.js；blog.json 加入 .gitignore（构建产物不入库）
- [x] 1.5 验证：`npm run build` 生成 blog.json 且内容正确

## 2. 路由与页面结构

- [x] 2.1 安装 react-router-dom 与 vite-react-ssg，vite.config.js 的 base 改为 `/`，main.jsx 改为 vite-react-ssg 入口
- [x] 2.2 创建 `src/pages/ResumePage.jsx`：将 App.jsx 的简历内容（主题切换器、导出按钮、A4 布局）整体平移，数据改为从 `src/data/resume.js` 导入
- [x] 2.3 创建 `src/pages/HomePage.jsx`：Hero、技能栈、精选项目、最新博客、找到我五个区块（独立视觉设计，不复用简历主题 class）
- [x] 2.4 重构 `src/App.jsx` 为路由容器：`/` → HomePage，`/resume` → ResumePage，未知路径重定向首页；App 根部包 `MotionConfig reducedMotion="user"`
- [x] 2.5 站点导航组件：首页/简历链接 + 激活态；验证导航与简历页固定元素（左侧主题切换器、右上导出按钮）布局共存不遮挡
- [x] 2.6 浏览器实测 /resume 简历页：4 套主题切换、导出 PDF/图片、打印预览正常（早期回归，不等部署后）

## 3. 首页实现

- [x] 3.1 首页独立视觉设计：定义首页样式作用域（独立 CSS 文件或 `home-` 前缀 class），显式覆盖 index.css 全局暗色变量影响
- [x] 3.2 Hero 区块：姓名、职位、一句话定位、CTA 按钮（跳转 /resume）；不展示薪资
- [x] 3.3 技能栈区块：从 resume.js 的 skills 渲染技能标签（Hero 与精选项目之间）
- [x] 3.4 精选项目区块：从 featuredProjects.json 渲染项目卡片（名称/描述/语言/链接，新标签打开）
- [x] 3.5 最新博客区块：从 blog.json 渲染文章卡片（标题/日期/摘要，新标签跳转博客园），数据为空时隐藏区块
- [x] 3.6 找到我区块：GitHub、Gitee、博客园、邮箱链接
- [x] 3.7 响应式：移动端区块纵向堆叠，无横向溢出
- [x] 3.8 验证：浏览器实测首页五区块展示与交互

## 4. SEO 静态生成

- [x] 4.1 配置 vite-react-ssg 静态生成 `/` 与 `/resume` 两个路由；SSG 渲染时模拟 `prefers-reduced-motion: reduce`（配合 MotionConfig reducedMotion，静态 HTML 输出可见内容）
- [x] 4.2 首页与简历页设置独立 title 与 meta description（SSG 按路由注入 head）
- [x] 4.3 首页添加 Open Graph 标签（og:title/description/image/type/url）+ 1200x630 分享图（放 public/）
- [x] 4.4 首页添加 JSON-LD Person 结构化数据（姓名、职位、社交链接）
- [x] 4.5 添加 robots.txt 与 sitemap.xml（含首页与简历页 URL，域名用 Vercel 域名占位）
- [x] 4.6 验证：构建产物 dist/index.html 与 dist/resume/index.html 含**可见**实际内容（无 opacity:0 内联样式）、head 各自含不同 title 与 OG 标签

## 5. Vercel 部署

- [x] 5.1 创建 vercel.json：SPA fallback rewrites + 构建命令配置；确认 /assets/* 不被误 rewrite
- [x] 5.2 移除 gh-pages 依赖与 deploy 脚本，更新 README 部署说明
- [x] 5.3 部署到 Vercel，验证根路径与 /resume 直接访问均正常
- [x] 5.4 验证线上资源无 `/personal-resume/` 前缀残留；核对 favicon（public/vite.svg 存在）
- [x] 5.5 浏览器实测线上简历页：4 套主题切换、导出 PDF/图片、打印预览正常

## 6. 收尾

- [x] 6.1 全量 lint + typecheck 通过（项目无 lint/typecheck 配置，以构建 + 浏览器实测替代验证）
- [x] 6.2 提交所有变更并推送（已提交，推送待用户确认）
