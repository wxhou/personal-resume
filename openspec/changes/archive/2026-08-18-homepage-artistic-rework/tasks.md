## 1. Hero 删除（控制台 / 状态 / ghost CTA）

- [x] 1.1 在 `src/pages/HomePage.jsx` 删除 `<div className="home-hero__console">...</div>` JSX 块（约 30 行）
- [x] 1.2 删除 `<p className="home-hero__status">{heroStatement.status}</p>` 单行
- [x] 1.3 删除 ghost CTA `<a href="#projects" className="home-hero__cta home-hero__cta--ghost">查看项目 <ArrowDown/></a>`，保留主 CTA `<a href={personalInfo.github}>` 单一按钮
- [x] 1.4 在 `src/pages/home.css` 删除 `.home-hero__console` 全部 CSS（约 50 行，含 __console-line / __console-prompt / __console-key / __console-val / __console-cursor / 闪烁动画）
- [x] 1.5 删除 `.home-hero__status` CSS（约 13 行）

## 2. 椭圆装饰重做（顶部细弧线）

- [x] 2.1 在 `src/pages/HomePage.jsx` 调整 `.home-hero__ellipse` 的 SVG 属性：`cy` 210 → 0、`ry` 170 → 80、`stroke-opacity` 0.35 → 0.18
- [x] 2.2 在 `src/pages/home.css` 调整 `.home-hero__ellipse`：高度 420px → 96px、`top` -40px → -8px；保留原 `@media` 适配块并按新高度调比例
- [x] 2.3 Playwright 截图验证顶部细弧线可见且不再占满整宽

## 3. h1 字体切换（衬线 → sans-serif）

- [x] 3.1 在 `src/pages/home.css` 修改 `.home-hero__name`：`font-family: 'Noto Serif SC', 'Noto Sans SC', serif` → `'Noto Sans SC', -apple-system, 'PingFang SC', sans-serif`；`letter-spacing: -0.02em` → `-0.03em`
- [x] 3.2 Playwright 截图验证 h1 改用 sans-serif 粗体

## 4. 作者性标点（HeroMarker 组件）

- [x] 4.1 新建 `src/components/HeroMarker.jsx`：封装 h1 字符光标邻近度驱动字重逻辑
  - props: `text`（标题文本）、`className`（用于外层 h1）
  - 内部用 `useRef` + `useEffect` 注册 `mousemove` 监听（rAF 合并）
  - 计算每个字符中心（`<span class="split-char">`）到光标的欧氏距离
  - 距离 ≤ 200px 时字重 700 + (200 - dist)/200 × 200；距离 > 200px 时字重 700
  - 通过 `style={{ '--char-weight': w }}` 注入每个字符
  - reduced-motion 时不挂载监听
- [x] 4.2 在 `src/pages/home.css` 新增 `.home-hero__name .split-char { font-weight: var(--char-weight, 700); transition: font-weight 80ms var(--ease-out); }`
- [x] 4.3 在 `src/pages/HomePage.jsx` 替换 h1 内的 `<SplitChars>` 为 `<HeroMarker text={heroStatement.headline} className="home-hero__name" />`
- [x] 4.4 Playwright 模拟 mousemove 到 h1 字符附近，截图验证字重变化（用 `evaluate` 检查 `getComputedStyle` 的 font-weight）

## 5. 验证（build + 视觉 + 行为）

- [x] 5.1 `npm run build` 通过（≤ 5s）
- [x] 5.2 Playwright 截图三屏（Hero / Projects / Proof+About）确认无控制台、无状态徽章、h1 sans-serif、顶部细弧线
- [x] 5.3 Playwright 模拟 mousemove 进入 h1，断言 `--char-weight` CSS 变量值在 [700, 900] 区间
- [x] 5.4 Console 无 error，无 4xx/5xx 网络请求
- [x] 5.5 `/resume` 子页未受影响（点 nav 跳转后截图确认）

## 6. 回退验证

- [x] 6.1 `git diff 22ee88f HEAD -- src/` 仅包含本次 change 范围内的文件改动
- [x] 6.2 `git revert HEAD` 模拟回退，确认能精确回到 token 化基线 `22ee88f`