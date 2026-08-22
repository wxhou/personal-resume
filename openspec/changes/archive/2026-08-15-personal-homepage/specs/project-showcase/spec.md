## ADDED Requirements

### Requirement: 精选项目数据
项目数据 SHALL 以 `src/data/featuredProjects.json` 手动维护，包含 4-6 个代表性项目，每个项目含名称（name）、描述（description）、语言（language）、GitHub 链接（url）字段。

#### Scenario: 数据文件存在
- **WHEN** 检查 `src/data/featuredProjects.json`
- **THEN** 文件包含 4-6 个精选项目，每个项目字段完整

### Requirement: 项目卡片展示
首页项目区块 SHALL 以卡片形式展示精选项目，卡片包含项目名称、描述、语言标签与 GitHub 链接。

#### Scenario: 卡片内容完整
- **WHEN** 首页渲染项目卡片
- **THEN** 每张卡片显示项目名称、描述、语言标签，且可点击跳转 GitHub

### Requirement: 项目链接新标签打开
项目卡片链接 SHALL 在新标签页打开，不离开当前站点。

#### Scenario: 点击项目卡片
- **WHEN** 用户点击项目卡片
- **THEN** 浏览器在新标签页打开对应 GitHub 仓库
