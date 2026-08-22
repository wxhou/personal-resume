# Homepage Theme Switching

## Purpose

为首页提供完整的明暗双主题能力：手动切换、首次访问跟随系统偏好、localStorage 持久化，并保证 WebGL 粒子场景、自定义光标等非 DOM 层与 DOM 同步换肤，暗色用户首帧无白闪。

## ADDED Requirements

### Requirement: 主题切换与持久化
首页 SHALL 提供明/暗主题切换：SiteNav 右侧渲染日/月图标按钮，点击在亮色与暗色间切换；用户选择 SHALL 写入 localStorage（key `siteTheme`）并在后续访问恢复。

#### Scenario: 手动切换
- **WHEN** 用户点击导航右侧的主题切换按钮
- **THEN** 首页立即在亮色与暗色之间切换，按钮图标同步切换（Sun↔Moon），无整页刷新

#### Scenario: 选择持久化
- **WHEN** 用户切换到暗色后刷新页面或再次访问
- **THEN** 首页直接以暗色渲染，无需再次切换

### Requirement: 首次访问跟随系统
用户未做过手动选择时，首页主题 SHALL 跟随系统 `prefers-color-scheme`；一旦手动切换即以 localStorage 记忆为准。

#### Scenario: 系统暗色用户首次访问
- **WHEN** 系统为 prefers-color-scheme: dark 的用户首次访问（localStorage 无记录）
- **THEN** 首页直接以暗色渲染

#### Scenario: 手动选择覆盖系统
- **WHEN** 系统暗色的用户手动切回亮色
- **THEN** 后续访问始终亮色，不再跟随系统

### Requirement: 暗色视觉体系
暗色主题 SHALL 以暖深褐底（约 `#211D18`）+ 暖深表面 + 米白文字系 + 提亮赭红 accent 构成，与亮色的暖色设计语言同源；全部颜色经 `.home-page[data-theme="dark"]` 上的 token 重定义实现，不逐元素硬编码。

#### Scenario: 全页换肤
- **WHEN** 切换到暗色
- **THEN** 页面底色、区块表面（marquee/卡片）、文字层级（strong/base/soft）、accent 强调、边框、点阵纹理整体切换为暗色系，无可读性断裂（正文对比度不低于 WCAG AA）

### Requirement: 非 DOM 层联动
WebGL 粒子场景与自定义光标 SHALL 跟随主题切换：HeroSphere 雾色在 `0xFBF7F1 ↔ 0x211D18` 间切换（粒子颜色保持可见），FxCursor 三层光标与拖尾在暗底下保持可辨。

#### Scenario: 粒子场景换肤
- **WHEN** 切换到暗色
- **THEN** HeroSphere 场景雾色即时切换为暖深褐，粒子云融入新背景不突兀；切回亮色同理

#### Scenario: 光标可辨
- **WHEN** 暗色下移动鼠标
- **THEN** dot/ring/拖尾仍清晰可辨（赭红在暖深褐底上对比度足够）

### Requirement: FOUC 防护
站点预渲染 HTML SHALL 在首帧前通过内联脚本确定主题（读 localStorage，无记录则读系统偏好），将 `data-theme` 设置到根容器，避免暗色用户看到亮色闪屏。

#### Scenario: 暗色用户直开无白闪
- **WHEN** 已选暗色的用户直接输入 URL 打开页面
- **THEN** 首帧即为暗色渲染，不出现先白后黑的闪烁
