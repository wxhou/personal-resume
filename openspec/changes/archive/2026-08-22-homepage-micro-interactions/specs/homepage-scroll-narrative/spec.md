# Homepage Scroll Narrative

## ADDED Requirements

### Requirement: 首屏滚动视差
首页 Hero SHALL 具备滚动视差：向下滚动时（rAF 节流）hero 内容容器以 translateY(y*0.18) 下移且透明度按 max(0, 1 - y/(vh*0.85)) 渐隐；粒子背景层以 translateY(y*0.08) 慢速跟随；SCROLL 提示在滚动超过约 60px 后淡出。

#### Scenario: 滚动时内容渐隐下移
- **WHEN** 用户向下滚动首屏（y < vh）
- **THEN** hero 文字内容随滚动下移（速率 0.18）且逐渐透明，粒子层以更慢速率（0.08）跟随，形成前后景层次

#### Scenario: SCROLL 提示淡出
- **WHEN** 用户向下滚动超过约 60px
- **THEN** SCROLL 提示淡出（opacity 0）；回到顶部时重新显示

#### Scenario: 超出首屏后跳过计算
- **WHEN** 滚动距离超过一个视口高度
- **THEN** 不再更新视差 transform（避免离屏无效计算）

#### Scenario: reduced-motion 跳过
- **WHEN** 用户系统设置 prefers-reduced-motion: reduce
- **THEN** 不绑定滚动视差，hero 随页面正常滚动
