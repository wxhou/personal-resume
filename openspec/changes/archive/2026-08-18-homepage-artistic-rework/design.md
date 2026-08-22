## Context

起点：commit `22ee88f`（design token 化基线）—— 首页已有完整字号/行高/动效 token、tabular-nums、focus-visible、弹簧动画。Hero 当前结构包含：SVG 大椭圆装饰、控制台面板（github/repos/stack/focus 4 行）、状态徽章（OPEN SOURCE · AI · WXHOU）、h1 字符（Noto Serif SC 衬线 7 字）、单一 GitHub 主 CTA、tagline 24 字。约束：见 proposal.md。

## Goals / Non-Goals

**Goals:**
- 删除首页 Hero 中三类"AI 风"指纹元素（控制台 / 状态徽章 / 大椭圆），让 hero 焦点收窄到 h1 + tagline + CTA
- h1 切到 sans-serif 粗体（Noto Sans SC 700）以贴近 Linear/Vercel 编辑感
- 落地一处作者性标点：光标邻近度驱动 h1 字重（唯一一处"物理响应"），区别于全站对称 fade-up

**Non-Goals:**
- 不重构 `home.css` 的 token 系统
- 不改 `HeroDust.jsx` 粒子算法
- 不动 Featured / More / Proof / Skills / About / Blog / Contact / Footer 区块结构
- 不动 /resume 子页
- 不引入新依赖

## Decisions

### D1. 删除 vs 保留控制台面板 —— **删除**
参考站 jingjinglearns.cc 完全无控制台读数；控制台读作"AI 模板化 hero 装饰"。GitHub 信息密度应由下方 6 + 6 = 12 张项目卡片承担，而非装饰面板。
**备选 A**：保留控制台但缩小到左下角角落作为 micro-readout → 仍读作"装饰面板"，失败。
**备选 B**：把控制台内容合并到控制台区块（如替换 .home-hero__console 为 .home-proof） → 跨区块结构变化，超出本 change 范围。

### D2. 椭圆装饰重做 —— **改为顶部 1px 水平细弧线**
当前 `.home-hero__ellipse` (rx 680/ry 170, opacity 0.35) 跨整个 hero 宽度，视觉权重过大。改为 `cy=0, ry=80, opacity=0.18` 的细弧线，只占 hero 顶部 ~15% 高度；保留参考站 signature 元素的精神。
**备选 A**：完全删除椭圆，无装饰元素 → hero 顶部空白过多，节奏失衡。
**备选 B**：保留原大椭圆但降低 opacity 到 0.1 → 仍跨整宽，视觉权重未实质降低。

### D3. h1 字体切换 —— **Noto Serif SC → Noto Sans SC 700**
调研结论：Linear/Vercel/Stripe 共用 sans-serif 粗体路线（Inter / Geist / Söhne）。Noto Serif SC 偏"传统/中文化"，与"高级感编辑感"不匹配。Noto Sans SC 700 是已有字族，不增加字体加载。
**备选 A**：保留 Serif 但降到 500 weight → 仍偏"传统"。
**备选 B**：引入新字族（如 Geist Sans / Inter）→ 增加字体加载（违反 Non-Goal），且与中文混排复杂。

### D4. 作者性标点 —— **光标邻近度驱动字重（候选 B）**
matvoyce.tv 风格的逐字符 timeline 入场（候选 A）虽有冲击力，但属于"入场动画增强"——属于"动效装饰"而非"持续物理响应"。光标邻近度驱动字重（候选 B）是持续物理响应——访客每移动一次光标都有反馈，且与 h1 这一最核心元素耦合，更克制、更"高级感"。
**备选 A**：逐字符 timeline 入场（matvoyce.tv 风格）→ 一次性入场后无持续反馈，"作者性"只读一次。
**备选 B**：光标邻近度驱动字重（本次选）→ 持续物理响应，hover/move 都有反馈，与 h1 耦合。

### D5. 字重实现机制 —— **CSS 变量 + JavaScript mousemove 注入**
每个 `<span class="split-char">` 持有局部 `--char-weight` 变量；JS 在 h1 容器监听 mousemove，计算每个字符中心到光标的距离，映射到 `[700, 900]` 区间，写入该字符的 `--char-weight`。CSS 内部 `font-weight: var(--char-weight); transition: font-weight 80ms var(--ease-out)`。
**备选 A**：每个字符 `<motion.span>` 用 framer-motion 接管 → 字符已有 motion 实例，再叠一层会冲突。
**备选 B**：直接给字符 `style={{ fontWeight }}` 写数值 → 不能 transition（数值变更不动画），失败。

### D6. 椭圆细弧线 CSS 实现 —— **保留 SVG 改 viewBox + 样式**
不改用 CSS `border-radius: 50%`（无法画"半椭圆弧线"）。保留 `<svg viewBox=... preserveAspectRatio="none">`，但把 `ry` 从 170 降到 80，`cy` 从 210 改到 0，`stroke-opacity` 从 0.35 降到 0.18。
**备选 A**：CSS `border-radius` → 只能画完整椭圆边，不能画顶部弧线，失败。
**备选 B**：完全删 SVG → 失去 signature 元素，违反 D2。

## Risks / Trade-offs

- **R1: 光标字重响应在低端机卡顿** → 字符数 ≤ 9 + 每字符仅更新 1 个 CSS 变量 + rAF 合并 mousemove 事件 → 60fps 概率高；如出现掉帧则降级为 transition 时长 0ms（瞬时切换）。
- **R2: reduced-motion 用户看不到作者性** → 退化到全 700 静态，符合 §7 "prefers-reduced-motion 真的去掉位移" 调研结论。
- **R3: 删除控制台后访客看不到"GitHub 用户名"** → 这是有意的：让 GitHub 信息密度来自 12 张项目卡片 + GitHub 主页本身；hero 只承担定位语 + CTA。
- **R4: h1 切到 sans-serif 后中文阅读感减弱** → 通过 letter-spacing -0.03em + 字重 700（粗体补偿）保持视觉重量；tagline 仍用衬线风格的 Noto Serif SC（如果保留）或 Noto Sans SC Regular 维持中文舒适度——本次保留 tagline sans-serif（与 h1 一致）。
- **R5: 细弧线在 ≤ 1024px 视口位置异常** → 当前 `.home-hero__ellipse` 已有 `@media (max-width: 1024px)` 与 `@media (max-width: 640px)` 适配（width 130% / 160% / 200%），新细弧线复用同一 responsive 规则，仅调整 width 百分比。

## Migration Plan

1. **Phase 1 — 准备**：本地 dev server 5179 验证现状 → 截图基线
2. **Phase 2 — 删除**：从 HomePage.jsx 移除 `.home-hero__console` JSX 块（30 行）+ `.home-hero__status` JSX 行 + ghost CTA `<a href="#projects">`
3. **Phase 3 — CSS 清理**：从 home.css 删除 `.home-hero__console` CSS 块（约 50 行）+ `.home-hero__status` CSS（约 13 行）；调整 `.home-hero__ellipse` 的 viewBox / cy / ry / stroke-opacity；调整 `.home-hero__name` font-family / letter-spacing
4. **Phase 4 — 作者性标点**：新建 `src/components/HeroMarker.jsx`，封装光标响应；接入 h1（替换 `<SplitChars>` 行为或包装 SplitChars 输出的字符 `<span>`）
5. **Phase 5 — 验证**：`npm run build` 通过；Playwright 截 Hero 区 + 模拟 mousemove 验证字重变化；与基线对比
6. **回退**：`git revert` 或 `openspec archive --skip-specs` 回退到 `22ee88f`

## Open Questions

（无 — D1-D6 已收敛；任何新的字体/装饰决策会改变 spec，本 change 不再追加）