# Homepage Theme Switching

## Purpose

为首页提供完整的明暗双主题能力：默认暗色（站点身份，不随系统偏好）、手动切换与 localStorage 持久化、暗色星云粒子与氛围光增强，并保证 WebGL 粒子场景、自定义光标等非 DOM 层与 DOM 同步换肤，暗色用户首帧无白闪。

## Requirements

### Requirement: 主题切换与持久化
首页 SHALL 提供明/暗主题切换：SiteNav 右侧渲染日/月图标按钮，点击在亮色与暗色间切换；用户选择 SHALL 写入 localStorage（key `siteTheme`）并在后续访问恢复。

#### Scenario: 手动切换
- **WHEN** 用户点击导航右侧的主题切换按钮
- **THEN** 首页立即在亮色与暗色之间切换，按钮图标同步切换（Sun↔Moon），无整页刷新

#### Scenario: 选择持久化
- **WHEN** 用户切换到暗色后刷新页面或再次访问
- **THEN** 首页直接以暗色渲染，无需再次切换

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

### Requirement: 默认暗色
首次访问且无本地记忆时，首页 SHALL 默认以暗色渲染；用户手动切换后仍以 localStorage 记忆为准。

#### Scenario: 首次访问默认暗色
- **WHEN** 用户首次访问（localStorage 无 siteTheme 记录，无论系统偏好为何）
- **THEN** 首页直接以暗色渲染，首帧即暗无闪烁

#### Scenario: 手动切换仍然有效
- **WHEN** 用户通过导航按钮切换到亮色
- **THEN** 选择写入 localStorage，后续访问保持亮色

### Requirement: 暗色粒子星云
暗色下 HeroSphere 粒子 SHALL 切换为加法混合（AdditiveBlending）并使用提亮色板（sage 约 `#96AC90`、brass 约 `#D48973`），呈现微光星云质感；亮色主题保持普通混合与原色板。

#### Scenario: 暗色下星云质感
- **WHEN** 主题为暗色时浏览 Hero
- **THEN** 粒子以加法混合渲染，重叠处产生微光叠加效果，粒子云呈星云质感而非平面撒点

#### Scenario: 亮色不受影响
- **WHEN** 切换回亮色
- **THEN** 粒子恢复普通混合与原色板（sage/brass），视觉与暗色增强上线前的亮色一致

### Requirement: 暗色氛围光
暗色下首页 Hero 区 SHALL 叠加一处深赭红径向光晕（accent 色、透明度约 0.08、椭圆分布），纯 CSS 实现不增加 DOM、不拦截交互。

#### Scenario: 氛围光可见
- **WHEN** 暗色下浏览 Hero
- **THEN** hero 区域可见微妙的暖赭红光晕提供纵深，文字可读性不受影响

#### Scenario: 亮色无氛围光
- **WHEN** 主题为亮色
- **THEN** 无氛围光层，页面视觉与此前一致

### Requirement: 暗色细节对比度增强
暗色下 SHALL 微调三处细节：点阵纹理透明度提升至约 0.07、`--text-soft` 提亮至对暗底 ≥4.5:1（约 `#8F867A`）、卡片光斑增强（accent 色透明度约 0.12）。

#### Scenario: 细节可感知
- **WHEN** 暗色下浏览页面
- **THEN** 点阵纹理隐约可辨、次要文字（数据行/SCROLL 等 soft 层）清晰可读、卡片光斑比增强前更明显

#### Scenario: 对比度达标
- **WHEN** 检查暗色下 text-soft 文本
- **THEN** 对暗底对比度 ≥4.5:1（WCAG AA）
