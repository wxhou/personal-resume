## MODIFIED Requirements

### Requirement: Hero 区块
首页顶部 SHALL 展示 Hero 区块，包含大字定位语、副标题（职位 · 城市 · 技术方向）、状态条（求职状态）、姓名品牌标识与双 CTA（查看项目锚点 + 查看简历路由），不展示薪资。

#### Scenario: 首页展示 Hero
- **WHEN** 用户访问首页
- **THEN** 页面顶部显示大字定位语、副标题、状态条与双 CTA 按钮

#### Scenario: CTA 跳转简历
- **WHEN** 用户点击 Hero 中的「查看简历」CTA
- **THEN** 跳转到 `/resume` 页面

#### Scenario: CTA 锚点定位
- **WHEN** 用户点击 Hero 中的「查看项目」CTA
- **THEN** 页面平滑滚动到 `#projects` section

#### Scenario: 状态条展示求职状态
- **WHEN** 用户浏览 Hero
- **THEN** 看到状态条（如「求职中 · AI 应用工程师 · 西安」格式的真实状态）

### Requirement: 精选项目区块
首页 SHALL 展示精选项目区块，以带编号（01/02…）的卡片呈现精选 GitHub 项目，每张卡片包含编号、标签（开源工具/实验项目等）、项目名称、描述、技术栈 chips 与 GitHub 链接；并以紧凑列表展示补充项目层。

#### Scenario: 首页展示项目卡片
- **WHEN** 用户访问首页并滚动到项目区块
- **THEN** 看到带编号的项目卡片列表，每张卡片包含编号、标签、项目名称、描述、技术栈 chips 与 GitHub 链接

#### Scenario: 点击项目链接
- **WHEN** 用户点击项目卡片
- **THEN** 在新标签页打开对应的 GitHub 仓库

#### Scenario: 补充项目层展示
- **WHEN** 用户浏览精选项目区块下方
- **THEN** 看到补充项目的紧凑列表（名称 + 一句话描述），同样可跳转 GitHub

### Requirement: 找到我区块
首页 SHALL 展示「找到我」联系区，包含微信二维码占位（用户提供图片后启用）与 GitHub、Gitee、博客园、邮箱等联系链接。

#### Scenario: 展示联系链接
- **WHEN** 用户访问首页并滚动到联系区块
- **THEN** 看到微信二维码区与社交、联系链接，每个链接可点击跳转

#### Scenario: 二维码占位
- **WHEN** 微信二维码图片尚未提供
- **THEN** 联系区显示占位框与提示（不显示损坏图片），提供图片后自动展示二维码

## ADDED Requirements

### Requirement: About 三事实区块
首页 SHALL 展示「三个事实」About 区块，以 FACT 01/02/03 编号短句呈现基于真实经历的三段式自我介绍。

#### Scenario: 展示三个事实
- **WHEN** 用户浏览首页 About 区块
- **THEN** 看到 FACT 01/02/03 三张事实卡片，每张含标题与一句话描述，内容基于真实经历
