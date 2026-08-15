// 构建后清理：移除 SSG 产物中 framer-motion 初始态内联样式（opacity:0）
// 静态 HTML 内容对爬虫/微信可见；客户端 hydration 后动画照常
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

const DIST = new URL('../dist/', import.meta.url).pathname

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(full))
    else if (extname(entry.name) === '.html') files.push(full)
  }
  return files
}

// framer-motion 初始态：style="opacity:0..." 或追加在已有内联样式后的 ;opacity:0;transform:...
const INITIAL_STYLE_RE = / style="opacity:0[^"]*"|;opacity:0(?:;transform:translateY\(16px\))?/g

const files = await walk(DIST)
let cleaned = 0
for (const file of files) {
  const html = await readFile(file, 'utf8')
  const next = html.replace(INITIAL_STYLE_RE, '')
  if (next !== html) {
    await writeFile(file, next, 'utf8')
    cleaned++
  }
}
console.log(`[postbuild] 已清理 ${cleaned} 个 HTML 中的初始态样式`)
