// 构建时拉取 GitHub 公开数据（star / public_repos），生成 src/data/github-stats.json
// 失败时写入已知兜底值，不阻塞构建
//
// API 来源（GitHub REST API 公开文档，无需认证，限 60 req/h/IP；GITHUB_TOKEN 存在时 5000/h）:
//   GET https://api.github.com/repos/{owner}/{repo}  → stargazers_count
//   GET https://api.github.com/users/{owner}         → public_repos
//   https://docs.github.com/en/rest/repos/repos
//   https://docs.github.com/en/rest/users/users
import { writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = 'wxhou/openspec-playwright'
const USER = 'wxhou'
// 兜底值：2026-08-22 经 gh api 实测（stars=10, public_repos=104）。
// 仅在 API 全部失败时使用，正常构建会被实时值覆盖。
const FALLBACK = { stars: 10, repos: 104 }
const OUT_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/github-stats.json')

async function getJson(url, headers = {}) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`)
  return res.json()
}

async function main() {
  const headers = process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}
  let stats = FALLBACK
  try {
    const [repo, user] = await Promise.all([
      getJson(`https://api.github.com/repos/${REPO}`, headers),
      getJson(`https://api.github.com/users/${USER}`, headers),
    ])
    stats = { stars: repo.stargazers_count, repos: user.public_repos }
    console.log(`[fetch-github-stats] 已写入 stars=${stats.stars} repos=${stats.repos}`)
  } catch (err) {
    console.warn(`[fetch-github-stats] 拉取失败，使用兜底值: ${err.message}`)
  }
  await writeFile(OUT_PATH, JSON.stringify(stats, null, 2))
}

main()
