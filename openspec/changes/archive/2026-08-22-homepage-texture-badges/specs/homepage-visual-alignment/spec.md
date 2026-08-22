# Homepage Visual Alignment

## ADDED Requirements

### Requirement: 点阵纸纹背景
首页 SHALL 在米色底上叠加低对比度的点阵纹理（1px 暖深色圆点、约 22px 网格间距、透明度约 0.06），参考 antfu.me / pseudoyu.com 的 dotted grid，为纯色底提供「印刷纸」肌理。

#### Scenario: 点阵纹理可见
- **WHEN** 用户访问首页
- **THEN** 米色底上可见均匀分布的细小点阵，对比度低不干扰内容阅读；粒子 canvas 与卡片表面不受影响（点阵位于其下）

#### Scenario: 零布局影响
- **WHEN** 页面在任意断点渲染
- **THEN** 点阵为背景平铺实现，不产生额外 DOM、不引起布局偏移或滚动溢出

### Requirement: 身份徽章行
首页 Hero SHALL 展示「Creator of」身份徽章行：6 个精选项目以可点击 chip 形式排列（antfu.me / pseudoyu.com 同款模式），每个 chip 包含 monogram 字母方块（CSS 生成、色板轮换）与项目名，点击在新标签页打开对应 GitHub 仓库；数据来自现有 featuredProjects 数据。

#### Scenario: 徽章行展示与跳转
- **WHEN** 用户浏览 Hero
- **THEN** 可见「CREATOR OF」标签与 6 个项目 chip，点击任意 chip 在新标签页打开该项目的 GitHub 仓库

#### Scenario: chip 视觉与 hover
- **WHEN** 用户悬停项目 chip
- **THEN** chip 呈现与全站一致的 hover 反馈（边框/文字转赭红），monogram 方块按色板轮换区分项目

#### Scenario: 无外部图标依赖
- **WHEN** 页面离线或外部图片服务不可用
- **THEN** 徽章行完整展示（monogram 为 CSS 生成），无图片加载失败占位

### Requirement: Hero 实时数据行
首页 Hero 底部（SCROLL 提示上方）SHALL 展示一行等宽字体小字数据：GitHub 公开仓库数、openspec-playwright star 数、博客文章数，格式如 `104 仓库 · ⭐10 · 20 篇`；仓库数与 star 数复用现有 GitHub 实时数据（构建值打底 + 客户端刷新），文章数来自构建时博客数据。

#### Scenario: 数据行展示实时值
- **WHEN** 用户浏览 Hero
- **THEN** 数据行显示当前 GitHub 实时数据（与成果区卡片同源），等宽字体、低对比度、不喧宾夺主

#### Scenario: 降级一致
- **WHEN** GitHub API 不可用或被限流
- **THEN** 数据行显示构建时兜底值，与成果区卡片行为一致，无空白或报错
