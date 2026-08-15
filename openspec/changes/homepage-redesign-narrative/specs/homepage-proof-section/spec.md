## ADDED Requirements

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
