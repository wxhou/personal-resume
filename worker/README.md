# wxhou-resume Cloudflare Worker（静态资产托管）

站点直接托管在 Cloudflare Workers 静态资产上，**无 Vercel、无代理层**。

**生产 URL：** https://wxhou-resume.wxhou.workers.dev

## 部署

```bash
# 仓库根目录一条命令：build + deploy
npm run deploy:cf
```

（等价于 `npm run build && cd worker && npx wrangler deploy`）

首次部署前需 `npx wrangler login`（OAuth）。注意：若 shell 里有
`CLOUDFLARE_API_TOKEN` 环境变量，其权限不足时会覆盖 OAuth 凭据，
临时 `env -u CLOUDFLARE_API_TOKEN npx wrangler deploy` 可绕开。

## 想恢复 git push 自动部署？

在 Cloudflare Dashboard → Workers & Pages →wxhou-resume → Settings
连上 GitHub 仓库即可（Workers Builds CI，构建命令 `npm run build`，
输出目录 `dist`）。

## 历史

- 2026-08-24 起脱离 Vercel：本 Worker 曾是反代 Vercel 的透传层
  （`src/index.js` 已删），现 dist 直接挂为静态资产，URL 不变。