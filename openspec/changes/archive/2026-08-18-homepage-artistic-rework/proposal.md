## Why

首页当前虽然已 token 化（commit 22ee88f），但仍残留"AI 风"指纹：控制台面板读作"信息冗余的装饰"，状态徽章是"求职痕迹"的隐性回归，h1 用 Noto Serif 衬线偏"传统感"而非参考站 Linear/Vercel 那种 sans-serif 编辑感，椭圆 SVG 装饰过厚。调研结论：高级感来自"决策密度"而非风格——参考站每个元素背后都有可见的决策，而当前首页有些元素没有"为什么"。本 change 把首页改造到与参考站同级别的工艺水平，同时落地一处"作者性"标点（光标邻近度驱动 h1 字重）。

## What Changes

- **删除** 首页 Hero 的右侧 `.home-hero__console` 控制台面板（4 行 GitHub 读数）——参考站无此元素，"信息密度"应来自 GitHub 项目卡片而非装饰面板
- **删除** Hero 状态徽章 `.home-hero__status`（"OPEN SOURCE · AI · WXHOU"）——读作装饰冗余
- **简化** Hero CTA：删除 ghost "查看项目"锚点按钮，**仅保留单一主按钮** "GitHub @wxhou" 外链（与首页焦点收窄一致）
- **删除** SVG 椭圆装饰 `.home-hero__ellipse`（cx 700/cy 210/ry 170）——装饰性过强；改为**顶部 1px 水平细弧线**（更克制，占 hero 顶部 ≤ 15% 高度），保持参考站 signature 元素的精神
- **改字体** Hero h1：`Noto Serif SC` 衬线 → `Noto Sans SC 700 weight`（与 Linear/Vercel/Stripe 同款 sans-serif 粗体路线），letter-spacing -0.03em
- **新增** 作者性标点：`hero-authorial-marker`——h1 字符按光标邻近度（200px 半径）动态调整字重，700↔900 渐变；静态时是粗 sans-serif，移动光标时有物理响应（仿 Stripe 的"decision density"）

## Capabilities

### New Capabilities

- `hero-authorial-marker`: h1 字符按光标邻近度驱动字重的能力。鼠标静止时 h1 全字重 700；光标进入 h1 区域 200px 内时，靠近光标的字符字重过渡到 900（远端保持 700），跟随 mousemove 实时响应，离开后回到全 700。reduced-motion 时退化为静态全 700。本能力是首页的"作者性"标点（仅一处），区别于全站 fade-up 的"AI 指纹"。

### Modified Capabilities

- `homepage`: Hero 区块 REQUIREMENT 修改——从"双 CTA + 状态条 + 控制台读数"改为"单一主 CTA + 无控制台 + 无状态条"；Hero 不展示任何"求职"或"GitHub 读数面板"类装饰内容，所有 GitHub 项目宣传来自下方 Featured Projects / More Work 区块。
- `homepage-visual-alignment`: h1 REQUIREMENT 修改——从"Noto Serif SC 衬线、字号约 108px"改为"Noto Sans SC 700 weight、letter-spacing -0.03em"；椭圆装饰 REQUIREMENT 从"hero 顶部大椭圆描边"改为"hero 顶部 1px 水平细弧线"。

## Impact

**修改文件（src/）：**
- `src/pages/HomePage.jsx`：删除 `.home-hero__console` JSX 块（约 30 行）、删除 `.home-hero__status` JSX 单行、删除 ghost CTA `<a href="#projects">`，移除 `HomePage.jsx` 中 HeroDust 上方的 SVG ellipse
- `src/pages/home.css`：删除 `.home-hero__console` 与 `.home-hero__status` 相关 CSS（约 70 行）；新增 `.home-hero__arc`（顶部细弧线）；h1 字体切换 + letter-spacing；新增 `--marker-weight-base: 700` 与 `--marker-weight-active: 900` token
- 新增 `src/components/HeroMarker.jsx`：封装 h1 字重光标响应逻辑（mousemove 监听 + CSS variable 注入 + reduced-motion 退化）

**不影响（明确排除）：**
- `src/components/HeroDust.jsx`（粒子已定型）
- `src/data/facts.js` / `src/data/achievements.js`（内容已是 GitHub 主题）
- `src/data/featuredProjects.json`（项目 URL 不变）
- `src/app-nav.css` / `src/components/SiteNav.jsx`（导航不变）
- `/resume` 子页
- footer、Proof 三卡、Skills、Featured Projects / More Work 卡片结构

**回撤保障：** 本 change 起点 = HEAD (22ee88f)，OpenSpec change 失败可 `git revert` 精确回到 token 化基线。

**验证：** `npm run build` 通过；Playwright 截 Hero 区，确认：①无控制台 ②无状态徽章 ③h1 改 sans-serif ④移动光标时 h1 字重变化 ⑤顶部细弧线可见