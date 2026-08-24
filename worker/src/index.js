// Cloudflare Worker: 反向代理 personal-resume 的 Vercel 部署
// 上游固定 Vercel 自动域名；路径 + query 透传；method/body/headers 透传
const UPSTREAM = 'https://personal-resume-five-orcin.vercel.app';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const upstreamUrl = UPSTREAM + url.pathname + url.search;

    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? null : request.body,
      redirect: 'follow',
    });

    // 用上游 Response 的 status/headers/body 复刻一个 Response，并打上代理标头便于调试
    const response = new Response(upstream.body, upstream);
    response.headers.set('x-proxied-by', 'cloudflare-worker');
    return response;
  },
};