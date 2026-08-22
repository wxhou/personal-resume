# Homepage Proof Section

## Purpose

Defines the homepage proof section (`#proof`) — a card grid of real, verifiable achievement data (GitHub repos, blog posts, open-source stars) with links to the corresponding platforms, replacing a photo evidence wall for which no assets exist.

## Requirements

### Requirement: 成果数据卡片展示
首页成果区（#proof）SHALL 以卡片网格展示真实可核验的成果数据，每张卡片包含数据标题、数值/描述与对应平台链接。

#### Scenario: 展示成果卡片
- **WHEN** 用户浏览首页成果区
- **THEN** 看到成果卡片网格（如 GitHub 仓库数、博客园文章数、开源项目 star 数等），每张卡片可点击跳转对应平台

#### Scenario: 数据真实可核验
- **WHEN** 检查成果卡片内容
- **THEN** 所有数据与链接对应真实平台状态，无虚构

### Requirement: 成果区区块标识
成果区 SHALL 带编号与英文小标签（PROOF / 成果），符合单页滚动的区块标识规范。

#### Scenario: 区块标识可见
- **WHEN** 用户浏览成果区标题
- **THEN** 显示编号与英文小标签

### Requirement: 成果数字滚动进场
成果区数据卡片（GitHub 公开仓库数、开源 star 数、博客园文章数）SHALL 在区块首次进入视口时触发一次数字滚动动画：数值部分从 0 滚动到目标值（约 1100ms，easeInOut 缓动），前后缀（+/⭐/篇）保持静态；每个卡片错峰启动（约 90ms）。

#### Scenario: 进入视口触发滚动
- **WHEN** 用户滚动到成果区块（可见约 40%）
- **THEN** 三张卡片的数字同时开始从 0 滚动到各自实时目标值，约 1.1s 完成，仅触发一次

#### Scenario: 后缀保持静态
- **WHEN** 数字滚动进行中
- **THEN** 卡片的后缀符号（+ / ⭐ / 篇）位置与样式不变，仅数值部分变化

#### Scenario: reduced-motion 直接显示
- **WHEN** 用户系统设置 prefers-reduced-motion: reduce
- **THEN** 不播放滚动动画，数字直接以最终值显示
