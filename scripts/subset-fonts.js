// 构建期字体子集化：按页面实际字符集裁剪 Noto 字体，替代 fontsource 全子集
// 来源: openspec/changes/perf-font-subset-idle-render/design.md D2（实证修订版）
// 工具: subset-font（harfbuzzjs）——cn-font-split 的 subsets 不裁字形（实测否决，见 design）
// 字符集扫描范围: src/**/*.{jsx,js,css} + index.html + src/data/*.json
//   （含 CountUp 数字、GitHub 实时数据等动态文本的字符空间）
// 输出: src/assets/fonts/<sans|serif>-<weight>.woff2 单文件/字重 + index.css（4 条 @font-face）
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import subsetFont from 'subset-font'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// ── 字重清单（与 design D1 裁剪结论一致）────────────────────
const FONTS = [
  { family: 'Noto Sans SC', weight: 400, file: 'NotoSansSC-Regular.otf', out: 'sans-400.woff2' },
  { family: 'Noto Serif SC', weight: 400, file: 'NotoSerifSC-Regular.otf', out: 'serif-400.woff2' },
  { family: 'Noto Serif SC', weight: 600, file: 'NotoSerifSC-SemiBold.otf', out: 'serif-600.woff2' },
  { family: 'Noto Serif SC', weight: 700, file: 'NotoSerifSC-Bold.otf', out: 'serif-700.woff2' },
]

// ── 1. 字符集扫描 ────────────────────────────────────────────
// 只扫首页 Noto 渲染域文件；简历侧（ResumePage/index.css/app.css）使用
// Inter 等独立字体族且 /resume 路由已重定向，其文本不进 Noto 字符集
const SCAN_FILES = [
  'src/pages/HomePage.jsx',
  'src/pages/home.css',
  'src/app-nav.css',
  'src/main.jsx',
  'src/App.jsx',
  'index.html',
  ...readdirSync('src/data').filter(f => f.endsWith('.json')).map(f => `src/data/${f}`),
]

function stripComments(t) {
  t = t.replace(/\/\*[\s\S]*?\*\//g, '')   // 块注释（CSS/JS/JSX）
  return t.replace(/(^|[^:])\/\/[^"'\n]*/g, '$1') // 行注释（保守：不碰字符串内 //）
}

function extractText() {
  let text = ''
  for (const f of SCAN_FILES) {
    if (!existsSync(f)) continue
    text += stripComments(readFileSync(f, 'utf-8'))
  }
  // 去空白字符；补齐 ASCII 全区（英文项目名/数字/标点的动态组合空间）
  const chars = new Set(text.replace(/\s/g, ''))
  for (let c = 0x20; c <= 0x7e; c++) chars.add(String.fromCodePoint(c))
  return [...chars].join('')
}

// ── 0. 构建期断言：Noto 字体的 font-weight 配对必须与子集清单一致 ──
// font-family: 'Noto Sans SC' 的规则只允许 400；'Noto Serif SC' 只允许 400/600/700
// （出现未导入字重时浏览器会静默匹配到其它面，此断言防止未来悄悄引入新字重）
function assertWeightPairing() {
  const ALLOWED = { "'Noto Sans SC'": new Set([400]), "'Noto Serif SC'": new Set([400, 600, 700]) }
  const files = ['src/pages/home.css', 'src/app-nav.css']
  for (const f of files) {
    if (!existsSync(f)) continue
    const css = readFileSync(f, 'utf-8')
    for (const m of css.matchAll(/[^{}]*\{[^}]*\}/g)) {
      const body = m[0]
      const fam = body.match(/font-family:\s*('Noto (?:Sans|Serif) SC')/)
      const w = body.match(/font-weight:\s*(\d+)/)
      if (fam && w && !ALLOWED[fam[1]]?.has(Number(w[1]))) {
        throw new Error(`[subset-fonts] 断言失败: ${f} 中 ${fam[1]} 声明了未子集化的 font-weight ${w[1]}\n请同步 FONTS 清单与源字体`)
      }
    }
  }
  console.log('[subset-fonts] font-weight 配对断言通过')
}

// ── 2. 子集化 ────────────────────────────────────────────────
async function main() {
  assertWeightPairing()
  const charset = extractText()
  console.log(`[subset-fonts] charset: ${charset.length} 字符`)

  const faces = []
  for (const { family, weight, file, out } of FONTS) {
    const src = join(ROOT, 'src/assets/fonts/source', file)
    if (!existsSync(src)) throw new Error(`源字体缺失: ${src}`)
    const input = readFileSync(src)
    const woff2 = await subsetFont(input, charset, { targetFormat: 'woff2' })
    writeFileSync(join(ROOT, 'src/assets/fonts', out), woff2)
    const kb = Math.round(woff2.length / 1024)
    console.log(`[subset-fonts] ${family} ${weight} → ${out} ${kb}KB`)
    faces.push({ family, weight, out })
  }

  const css = faces.map(f => `@font-face {
  font-family: '${f.family}';
  font-style: normal;
  font-weight: ${f.weight};
  font-display: swap;
  src: url('./${f.out}') format('woff2');
}`).join('\n') + '\n'
  writeFileSync(join(ROOT, 'src/assets/fonts/index.css'), css)
  console.log(`[subset-fonts] 完成：charset ${charset.length} 字符 × ${FONTS.length} 字重`)
}

main().catch(err => {
  console.error('[subset-fonts] 失败:', err)
  process.exit(1)
})