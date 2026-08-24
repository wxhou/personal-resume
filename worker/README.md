# wxhou-resume Cloudflare Worker

反向代理：把 Cloudflare Worker 入口透传到 Vercel 生产部署。

**生产 URL：** https://wxhou-resume.wxhou.workers.dev

## 工作原理

- 上游：`https://personal-resume-five-orcin.vercel.app`（Vercel 项目 `personal-resume` 的自动部署 URL，可在 Vercel Dashboard 变更）
- 所有 path / query / method / body / headers 透传，仅附加 `x-proxied-by: cloudflare-worker` 调试头

## 部署命令

```bash
cd worker
npm install
npx wrangler deploy --autoconfig=false --name=wxhou-resume worker/src/index.js
```

> 注：本项目父目录是 Vite 工程，wrangler v4 会自动检测并报 Vite 版本不兼容——必须显式关闭 autoconfig 并指定入口文件。`--autoconfig=false` 跳过框架检测，CLI 参数强制覆盖项目名。首次部署前需 `wrangler login`（OAuth），或设置 `CLOUDFLARE_API_TOKEN`（需 Workers Scripts:Edit 权限）。

部署完成 → workers.dev URL 已落地为仓库 `JSON-LD.url` + `og:url` + `og:image` + `sitemap.xml` + `robots.txt` 的唯一权威域名（`wxhou.vercel.app` 占位已彻底替换）。

## 切换上游

Vercel 自动部署 URL 可能随重新部署变化，修改 `src/index.js` 里的 `UPSTREAM` 常量后重跑部署命令即可，无需重命名 Worker。