# wxhou-resume Cloudflare Worker

反向代理：把 Cloudflare Worker 入口透传到 Vercel 生产部署。

## 工作原理

- 上游：`https://personal-resume-five-orcin.vercel.app`（Vercel 项目 `personal-resume` 的自动部署 URL，可在 Vercel Dashboard 变更）
- 所有 path / query / method / body / headers 透传，仅附加 `x-proxied-by: cloudflare-worker` 调试头

## 部署

```bash
cd worker
npm install
npx wrangler login           # 首次：浏览器授权（需 Workers Scripts:Edit 权限的 token）
npx wrangler deploy          # 拿到 https://wxhou-resume.<account>.workers.dev
```

部署后如要把仓库里的 JSON-LD / og:url / og:image 切到这个域名，搜 `wxhou.vercel.app` 三处替换即可。

## 切换上游

部署 URL 可能随 Vercel 重新部署变化，更新 `wrangler.toml` 不需要——上游 URL 硬编码在 `src/index.js` 的 `UPSTREAM` 常量，修改后 `wrangler deploy` 即可。