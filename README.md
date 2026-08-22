# 个人主页（Bigger蓝莓）

个人主页 + 在线简历：`/` 首页（Hero、技能栈、精选项目、博客园聚合、找到我），`/resume` 简历页（4 套主题切换 + 导出 PDF/图片）。

## 技术栈

- React + Vite + vite-react-ssg（构建时静态生成）
- Tailwind CSS
- Framer Motion
- Lucide React

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建流程：`prebuild` 拉取博客园 RSS 生成 `src/data/blog.json` → `vite-react-ssg build` 静态生成 `/` 与 `/resume` → `postbuild` 清理 framer-motion 初始态样式（保证静态 HTML 内容对爬虫可见）。

## 部署

部署到 Vercel（`vercel.json` 配置 SPA fallback）。构建命令 `npm run build`，输出目录 `dist`。

## 数据

- `src/data/resume.js` — 简历数据（首页与简历页共享）
- `src/data/featuredProjects.json` — 首页精选项目（手动维护）
- `src/data/blog.json` — 博客园文章（构建时生成，不入库）
- `scripts/fetch-blog.js` — RSS 拉取脚本
- `scripts/postbuild.js` — 构建后清理脚本
- `scripts/generate-og-image.py` — 生成微信分享图（public/og-image.png）

## 上线后待办

- 绑定自定义域名后，更新 `index.html` 的 JSON-LD、`public/sitemap.xml`、`public/robots.txt` 与首页 OG 标签中的 `wxhou.vercel.app` 占位域名
- 提交站点到 Google Search Console 与百度站长平台
