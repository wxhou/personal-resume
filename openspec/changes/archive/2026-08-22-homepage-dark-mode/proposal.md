## Why

首页当前只有亮色米底一套主题。参考站 jingjinglearns.cc 有完整暗色切换（`dataset.theme` + localStorage + `__heroScene.setTheme(fog 0x211D18)`），weijunext.com 更是纯暗色站。暗色是探索调研中标记的最大缓办项；首页 token 体系（22ee88f 基线）已就位，重定义一套暗色 token 即可覆盖绝大多数表面，剩余硬编码点已盘点清楚（5 处，见 design）。本次为首页补齐明/暗双主题。

## What Changes

- **暗色 token 集**：`.home-page[data-theme="dark"]` 重定义全套颜色 token——暖深褐底 `#211D18`（与参考站 dark fog 同源）、暖深表面 `#2E2924`、米白文字系、提亮赭红 accent `#C97A66`（保证暗底对比度）
- **三态切换**：SiteNav 右侧新增日/月图标按钮（lucide Sun/Moon），循环「亮→暗」两态点击切换；**首次访问跟随系统** `prefers-color-scheme: dark`；选择写入 localStorage（key `siteTheme`）持久化
- **FOUC 防护**：SSG 预渲染 HTML `<head>` 内联一段微型脚本，首帧前读 localStorage / 系统偏好设置 `data-theme`，避免暗色用户看到白闪
- **WebGL 联动**：HeroSphere 新增 `setTheme(dark)`——雾色切换 `0xFBF7F1 ↔ 0x211D18`，粒子 sage/brass 在暗底保持可见（必要时微调）；React 侧通过现有 Dev hook 或新增 prop 桥接
- **硬编码联动清理**：body 背景 useEffect 跟随 theme、SVG 椭圆描边透明度适配、console 面板背景改 token 化 rgba、FxCursor 拖尾色保持赭红（暗底可辨）、点阵纹理在暗色下换浅色点
- **范围严格限定**：仅首页体系（`.home-page` 作用域 + SiteNav/FxCursor/ScrollProgress/HeroSphere）；`/resume` 及其 style-switcher 完全不动

## Capabilities

### New Capabilities
- `homepage-theme-switching`: 首页明暗主题能力——手动 toggle、首次访问跟随系统、localStorage 持久化、全首页组件（含 WebGL 粒子场景）联动换肤、FOUC 防护

### Modified Capabilities
<!-- 无——visual-alignment 的既有 requirement 描述的是亮色基准值，token 换值实现暗色不改变其行为契约 -->

## Impact

- **代码**：`src/pages/home.css`（暗色 token 块 + 硬编码清理）、`src/pages/HomePage.jsx`（theme state + body 联动 + ellipse stroke）、`src/components/SiteNav.jsx`（toggle 按钮，仅首页渲染）、`src/components/HeroSphere.jsx`（setTheme）、`src/components/FxCursor.jsx`（可选拖尾色适配）、入口 HTML/Head（FOUC 内联脚本）
- **依赖**：零新包（lucide-react 已有 Sun/Moon 图标）
- **不受影响**：`/resume` 全部页面与其 style-switcher、数据层、微交互逻辑本身
- **风险面**：涉及 SSG 预渲染 head 注入与 WebGL 运行时状态，需 Playwright 双主题回归验证
