## MODIFIED Requirements

### Requirement: Hero 大标题字体与字号
首页 Hero 大标题 SHALL 使用 Noto Sans SC、字重 700、letter-spacing -0.03em；字号按响应式 clamp 收敛到 1.333 完美四度比例（顶部 ≤ 76px），行高约 1.06。不使用衬线字体。

#### Scenario: 桌面端大标题
- **WHEN** 用户在 1440px 宽度访问首页
- **THEN** 大标题使用 sans-serif 粗体（Noto Sans SC 700），letter-spacing -0.03em

#### Scenario: 窄屏自适应
- **WHEN** 用户在 375px 宽度访问首页
- **THEN** 大标题随 clamp 缩小，无横向溢出

### Requirement: Hero 简介正文排版
首页 Hero 简介正文 SHALL 使用正文 token 字号（var(--fs-body-lg)）、行高遵循 body 行高分层（var(--lh-body)）、文字色遵循正文色 token。

#### Scenario: 简介正文样式
- **WHEN** 用户浏览 Hero 简介
- **THEN** 简介字号、行高、文字色均由 token 控制，不硬编码 px 值

### Requirement: Hero 顶部装饰
首页 Hero 顶部 SHALL 展示一条 1px 水平的细弧线作为签名装饰元素，仅占 hero 顶部 ≤ 15% 高度，半透明赭红色（accent + alpha 衰减）。不展示大椭圆 SVG。

#### Scenario: 顶部装饰可见
- **WHEN** 用户访问首页
- **THEN** Hero 顶部可见一条细弧线装饰，不出现完整大椭圆

### Requirement: SCROLL 滚动提示
首页 Hero 底部 SHALL 展示 `SCROLL` 滚动提示（含下箭头），提示用户向下浏览。

#### Scenario: 展示滚动提示
- **WHEN** 用户访问首页 Hero
- **THEN** Hero 底部显示 `SCROLL` 提示与下箭头