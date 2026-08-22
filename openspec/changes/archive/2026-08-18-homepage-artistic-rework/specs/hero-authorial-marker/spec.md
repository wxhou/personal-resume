## Purpose

首页 Hero 大标题（h1）按光标邻近度驱动字符字重的物理响应——光标进入 h1 区域 200px 半径内时，靠近光标的字符字重过渡到 900（远端保持 700），跟随 mousemove 实时响应；离开后回到全 700。该能力是首页唯一的"作者性"标点，区别于全站 fade-up 的对称入场。

## ADDED Requirements

### Requirement: h1 字重光标响应
首页 Hero 大标题 SHALL 按光标位置驱动字符字重：静态（光标离开 h1 200px 半径外）时全文字重 700；光标进入 200px 半径内时，靠近光标的字符字重过渡到 900，过渡为平滑插值；光标离开后回到全 700。过渡 SHALL 仅影响 `font-weight` 与 `color`（不改 layout），保持 60fps。

#### Scenario: 静态状态
- **WHEN** 页面加载完成且光标不在 h1 附近
- **THEN** h1 全文字重显示为 700

#### Scenario: 光标进入响应区
- **WHEN** 光标移动到 h1 字符 200px 半径内
- **THEN** 离光标最近的字符字重过渡到 900，距离越远字重越接近 700

#### Scenario: 光标离开衰减
- **WHEN** 光标移出 h1 200px 半径
- **THEN** h1 全部字符字重回到 700

#### Scenario: reduced-motion 退化
- **WHEN** 用户偏好设置 `prefers-reduced-motion: reduce`
- **THEN** 字符字重保持静态全 700，不响应光标

### Requirement: 字符字重 CSS 变量
首页 SHALL 通过 CSS 自定义属性（`--marker-weight-base` 与 `--marker-weight-active`）驱动每个字符的字重，每个字符按 JavaScript 注入的 `--char-weight` 局部变量独立过渡。

#### Scenario: 字重 token 引用
- **WHEN** JavaScript 通过 mousemove 计算每个字符的目标字重
- **THEN** 每个 `<span class="`split-char`">` 的 `style` 属性更新 `--char-weight` 变量，CSS 内部 `font-weight: var(--char-weight)`