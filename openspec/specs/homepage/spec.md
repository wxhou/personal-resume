# Homepage

## Purpose

Defines the homepage structure and content, covering the hero section, skills, featured projects, latest blog posts, contact links, responsive layout, and the salary privacy boundary (salary content is restricted to the resume page).

## Requirements

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

### Requirement: 技能栈区块
首页 SHALL 在 Hero 与精选项目之间展示技能栈标签区块，数据复用自简历数据模块的 skills，让访客无需进入简历页即可了解核心技能。

#### Scenario: 首页展示技能标签
- **WHEN** 用户访问首页并滚动到技能区块
- **THEN** 看到技能标签列表（如 AI 技能、后端开发等分类），与简历页技能数据一致

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

### Requirement: 最新博客区块
首页 SHALL 展示最新博客区块，以卡片形式呈现博客园最新文章（标题、日期、摘要），点击跳转博客园原文。

#### Scenario: 首页展示博客文章
- **WHEN** 用户访问首页并滚动到博客区块
- **THEN** 看到博客文章卡片列表，每张卡片包含文章标题、发布日期与摘要

#### Scenario: 点击文章跳转
- **WHEN** 用户点击博客文章卡片
- **THEN** 在新标签页打开博客园原文链接

#### Scenario: 无博客数据时隐藏区块
- **WHEN** 博客数据为空（RSS 拉取失败或暂无文章）
- **THEN** 博客区块自动隐藏，首页其余区块正常展示

### Requirement: 找到我区块
首页 SHALL 展示「找到我」联系区，包含微信二维码占位（用户提供图片后启用）与 GitHub、Gitee、博客园、邮箱等联系链接。

#### Scenario: 展示联系链接
- **WHEN** 用户访问首页并滚动到联系区块
- **THEN** 看到微信二维码区与社交、联系链接，每个链接可点击跳转

#### Scenario: 二维码占位
- **WHEN** 微信二维码图片尚未提供
- **THEN** 联系区显示占位框与提示（不显示损坏图片），提供图片后自动展示二维码

### Requirement: About 三事实区块
首页 SHALL 展示「三个事实」About 区块，以 FACT 01/02/03 编号短句呈现基于真实经历的三段式自我介绍。

#### Scenario: 展示三个事实
- **WHEN** 用户浏览首页 About 区块
- **THEN** 看到 FACT 01/02/03 三张事实卡片，每张含标题与一句话描述，内容基于真实经历

### Requirement: 响应式布局
首页 SHALL 在桌面与移动端均正常展示，区块在窄屏下纵向堆叠，无横向溢出。

#### Scenario: 移动端浏览
- **WHEN** 用户在移动端宽度（如 375px）访问首页
- **THEN** 各区块正常堆叠展示，无横向滚动条

### Requirement: 薪资隐私边界
首页 SHALL 不展示薪资信息（薪资仅存在于简历页）。

#### Scenario: 首页无薪资
- **WHEN** 用户访问首页
- **THEN** 页面任何位置均不出现薪资相关内容