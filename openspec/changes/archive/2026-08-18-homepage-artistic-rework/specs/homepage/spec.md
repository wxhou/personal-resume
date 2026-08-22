## MODIFIED Requirements

### Requirement: Hero 区块
首页顶部 SHALL 展示 Hero 区块，包含大字定位语、副标题（姓名 · GitHub 账号标识）、GitHub 主 CTA 与姓名品牌标识；不展示薪资、不展示求职状态条、不展示装饰性控制台读数面板。

#### Scenario: 首页展示 Hero
- **WHEN** 用户访问首页
- **THEN** 页面顶部显示大字定位语、副标题、姓名品牌标识与单一 GitHub 主 CTA；无状态条、无装饰性控制台面板

#### Scenario: 主 CTA 跳转 GitHub
- **WHEN** 用户点击 Hero 中的 GitHub 主 CTA
- **THEN** 在新标签页打开 `https://github.com/wxhou`

#### Scenario: 锚点定位保留
- **WHEN** 用户从 Hero 之外（如 SectionHeader 索引或导航）触发「项目」锚点
- **THEN** 页面平滑滚动到 `#projects` section