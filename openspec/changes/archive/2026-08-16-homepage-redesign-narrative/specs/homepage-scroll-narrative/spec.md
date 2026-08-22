## ADDED Requirements

### Requirement: 单页滚动结构
首页 SHALL 采用单页长滚动结构，包含锚点定位的 section：`#projects`（项目）、`#proof`（成果）、`#about`（关于）、`#contact`（联系），博客区块可复用 `#about` 前后位置。

#### Scenario: 锚点跳转
- **WHEN** 用户点击导航中的「项目」锚点链接
- **THEN** 页面平滑滚动到项目 section

#### Scenario: 滚动内容完整
- **WHEN** 用户从页首滚动到页尾
- **THEN** 依次经过 Hero、成就滚动条、技能栈、精选项目、补充项目、成果、About、博客、联系各区块

### Requirement: 首页导航锚点态
SiteNav 在首页 SHALL 显示锚点链接（项目/成果/关于/联系）与「简历」路由链接；在简历页 SHALL 保持现状（首页/简历路由链接）。

#### Scenario: 首页导航
- **WHEN** 用户位于首页
- **THEN** 导航显示锚点链接与「简历」路由链接

#### Scenario: 简历页导航不变
- **WHEN** 用户位于 /resume
- **THEN** 导航显示「首页」「简历」路由链接（现状不变）

### Requirement: 区块编号
各主要 section SHALL 带编号标识（如 01/02/03…）与英文小标签（SELECTED WORK / PROOF / ABOUT），呼应杂志式排版。

#### Scenario: 区块编号可见
- **WHEN** 用户浏览项目 section
- **THEN** section 标题区显示编号（如 01）与英文小标签（SELECTED WORK）
