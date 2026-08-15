// 构建时拉取博客园 RSS（Atom feed），生成 src/data/blog.json
// 失败时输出空数组，不阻塞构建
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const RSS_URL = 'https://feed.cnblogs.com/blog/u/542611/rss/'
const OUT_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/blog.json')

function stripHtml(text) {
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function parseAtom(xml) {
  const items = []
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g
  let match
  while ((match = entryRe.exec(xml)) !== null) {
    const block = match[1]
    const pick = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))
      return m ? m[1].trim() : ''
    }
    const linkMatch = block.match(/<link[^>]*href="([^"]+)"[^>]*>/)
    const title = stripHtml(pick('title'))
    const link = linkMatch ? linkMatch[1] : ''
    const pubDate = pick('updated')
    const summary = stripHtml(pick('summary') || pick('content')).slice(0, 200)
    if (title && link) {
      items.push({ title, link, pubDate, summary })
    }
  }
  return items
}

async function main() {
  let posts = []
  try {
    const res = await fetch(RSS_URL, {
      headers: { 'User-Agent': 'personal-homepage-builder' },
      signal: AbortSignal.timeout(15000)
    })
    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)
    const xml = await res.text()
    posts = parseAtom(xml)
    // 按发布日期倒序（最新在前）
    posts.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
  } catch (err) {
    console.warn(`[fetch-blog] RSS 拉取失败，blog.json 将为空数组: ${err.message}`)
  }
  await mkdir(dirname(OUT_PATH), { recursive: true })
  await writeFile(OUT_PATH, JSON.stringify(posts, null, 2) + '\n', 'utf8')
  console.log(`[fetch-blog] 已生成 blog.json（${posts.length} 篇文章）`)
}

main()
