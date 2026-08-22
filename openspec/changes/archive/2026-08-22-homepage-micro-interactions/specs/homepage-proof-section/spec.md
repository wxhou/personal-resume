# Homepage Proof Section

## ADDED Requirements

### Requirement: 成果数字滚动进场
成果区数据卡片（GitHub 公开仓库 27+、开源 star ⭐8、博客园文章 20 篇）SHALL 在区块首次进入视口时触发一次数字滚动动画：数值部分从 0 滚动到目标值（约 1100ms，easeInOut 缓动），前后缀（+/⭐/篇）保持静态；每个卡片错峰启动（约 90ms）。

#### Scenario: 进入视口触发滚动
- **WHEN** 用户滚动到成果区块（可见约 40%）
- **THEN** 三张卡片的数字同时开始从 0 滚动到各自目标值（27、8、20），约 1.1s 完成，仅触发一次

#### Scenario: 后缀保持静态
- **WHEN** 数字滚动进行中
- **THEN** 卡片的后缀符号（+ / ⭐ / 篇）位置与样式不变，仅数值部分变化

#### Scenario: reduced-motion 直接显示
- **WHEN** 用户系统设置 prefers-reduced-motion: reduce
- **THEN** 不播放滚动动画，数字直接以最终值显示
