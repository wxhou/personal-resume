// 构建时拉取 GitHub 公开数据（star / public_repos）与 npm 月下载量，生成 src/data/github-stats.json
// 失败时不阻塞构建：以上次成功写入的 json 为兜底（首次无文件才用 INITIAL）；
// 兜底值会随每次成功构建自动保鲜，不会出现过期硬编码
//
// API 来源（均为公开端点，无需认证）:
//   GET https://api.github.com/repos/{owner}/{repo}  → stargazers_count
//   GET https://api.github.com/users/{owner}         → public_repos
//   https://docs.github.com/en/rest/repos/repos
//   https://docs.github.com/en/rest/users/users
//   GET https://api.npmjs.org/downloads/point/last-month/{pkg} → downloads
//   npm downloads API: https://github.com/npm/registry/blob/main/docs/downloads/downloads.md
import { writeFile, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = 'wxhou/openspec-playwright'
const USER = 'wxhou'
const NPM_PKG = 'openspec-playwright'
// 首次兜底（无历史 json 时）：2026-10-11 GitHub API 实际返回
const INITIAL = { stars: 10, repos: 104, downloads: 3701 }
const OUT_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/github-stats.json')

async function getJson(url, headers = {}) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`)
  return res.json()
}

// 读上次成功的 json 作为兜底；不存在/损坏时退回 INITIAL 起点值
async function loadPrevious() {
  try {
    const prev = JSON.parse(await readFile(OUT_PATH, 'utf-8'))
    const n = (v) => (Number.isFinite(v) ? v : null)
    const stats = { stars: n(prev.stars), repos: n(prev.repos), downloads: n(prev.downloads) }
    if (stats.stars == null && stats.repos == null && stats.downloads == null) throw new Error('no numeric fields')
    return stats
  } catch {
    return null
  }
}

async function main() {
  const headers = process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}
  const previous = await loadPrevious()
  const fallback = previous ?? INITIAL
  if (!previous) console.warn('[fetch-github-stats] 无历史 json，退回 INITIAL 起点值')
  let stats = fallback
  const [gh, npm] = await Promise.allSettled([
    (async () => {
      const [repo, user] = await Promise.all([
        getJson(`https://api.github.com/repos/${REPO}`, headers),
        getJson(`https://api.github.com/users/${USER}`, headers),
      ])
      return { stars: repo.stargazers_count, repos: user.public_repos }
    })(),
    getJson(`https://api.npmjs.org/downloads/point/last-month/${NPM_PKG}`),
  ])
  if (gh.status === 'fulfilled') {
    stats = { ...stats, ...gh.value }
    console.log(`[fetch-github-stats] stars=${stats.stars} repos=${stats.repos}`)
  } else {
    console.warn(`[fetch-github-stats] GitHub 拉取失败: ${gh.reason?.message}（沿用上次构建值）`)
  }
  if (npm.status === 'fulfilled' && Number.isFinite(npm.value?.downloads)) {
    stats = { ...stats, downloads: npm.value.downloads }
    console.log(`[fetch-github-stats] npm 月下载=${stats.downloads}`)
  } else {
    console.warn(`[fetch-github-stats] npm 拉取失败: ${npm.reason?.message ?? 'downloads 字段异常'}（沿用上次构建值）`)
  }
  await writeFile(OUT_PATH, JSON.stringify(stats, null, 2))
}

main()
