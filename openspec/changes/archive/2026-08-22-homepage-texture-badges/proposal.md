## Why

调研国内六位头部个人开发者主页（antfu.me / pseudoyu.com / diygod.cc / innei.in / timqian.com / weijunext.com）后确认：我们的动效层（粒子 morph / 光斑 / 视差）已不输标杆，差距在「质感层」——纯色米底缺少纸的肌理、GitHub 项目缺少 antfu 式「身份徽章」表达、hero 缺一行克制的实时数据。本次补齐三项，全部与现有米色+赭红设计语言同源，且复用上周建好的 GitHub 实时数据能力。

## What Changes

- **① 点阵纸纹背景**：`.home-page` 加 `radial-gradient` 1px 暖深色低透明度点阵（~22px 间距平铺），参考 antfu/pseudoyu 的 dotted grid——米底获得「印刷纸」肌理，纯 CSS 零性能成本
- **② 身份徽章行**：hero 内新增 `Creator of [chips]` 行（antfu/pseudoyu 同款模式），展示 6 个精选项目为可点击 chip（monogram 方块 + 项目名），点击跳转对应 GitHub 仓库；数据来自现有 `featuredProjects.json`
- **③ hero 实时数据行**：hero 底部（SCROLL 提示上方）新增一行等宽小字 `104 仓库 · ⭐10 · 20 篇`，复用现有 `useGitHubStats` 实时数据与 `blogPosts.length`
- 不做：暗色模式、霞鹜文楷换字体、真人照片（调研结论为缓/需用户素材，见探索记录）

## Capabilities

### New Capabilities
<!-- 无 -->

### Modified Capabilities
- `homepage-visual-alignment`: 新增三个 requirement——「点阵纸纹背景」「身份徽章行」「Hero 实时数据行」（视觉语言扩展到国内标杆对齐）

## Impact

- **代码**：`src/pages/home.css`（点阵背景 + 徽章 chip 样式 + 数据行样式）、`src/pages/HomePage.jsx`（徽章行 JSX + 数据行 JSX，数据复用 `featuredData` / `useGitHubStats` / `blogPosts`）
- **依赖**：零新包；徽章 monogram 纯 CSS 生成，不依赖外部 favicon 服务（GitHub 无稳定的按仓库图标 URL，不编造外链）
- **不受影响**：HeroSphere、FxCursor、微交互、`/resume`、数据层结构
- **风险面小**：纯展示层，可精确回撤
