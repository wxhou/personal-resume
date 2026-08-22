## ADDED Requirements

### Requirement: 构建时静态生成
构建流程 SHALL 使用 vite-react-ssg 在构建时渲染 `/` 与 `/resume` 两个路由，输出包含完整内容的静态 HTML。

#### Scenario: 构建产物含可见静态内容
- **WHEN** 执行 `npm run build` 并检查 `dist/index.html`
- **THEN** HTML 中包含首页的姓名、职位等实际内容，且关键元素无 `opacity:0` 内联样式（内容可见）

#### Scenario: 简历页静态生成
- **WHEN** 检查 `dist/resume/index.html`
- **THEN** HTML 中包含简历内容（姓名、技能等实际内容），且关键元素无 `opacity:0` 内联样式

### Requirement: 页面 meta 标签
每个页面 SHALL 设置独立的 title 与 meta description，首页 title 包含姓名与职位。

#### Scenario: 首页 meta
- **WHEN** 检查首页 HTML 的 `<head>`
- **THEN** title 包含姓名与职位，存在 meta description

#### Scenario: 简历页 meta
- **WHEN** 检查简历页 HTML 的 `<head>`
- **THEN** title 为简历相关描述，存在 meta description

### Requirement: Open Graph 标签
首页 SHALL 包含 Open Graph 标签（og:title、og:description、og:image、og:type、og:url），确保微信/QQ 等平台分享时展示卡片。

#### Scenario: 首页含 OG 标签
- **WHEN** 检查首页 HTML 的 `<head>`
- **THEN** 存在 og:title、og:description、og:image、og:type、og:url 标签，og:image 指向可访问的分享图（1200x630）

#### Scenario: 微信分享展示卡片
- **WHEN** 将首页链接分享到微信
- **THEN** 分享卡片显示标题、描述与图片，而非裸 URL

### Requirement: 结构化数据
首页 SHALL 包含 JSON-LD 结构化数据（Person schema），声明姓名、职位、社交链接。

#### Scenario: 首页含 JSON-LD
- **WHEN** 检查首页 HTML
- **THEN** 存在 `application/ld+json` 脚本，包含 Person 类型数据

### Requirement: 爬虫文件
站点 SHALL 提供 `robots.txt` 与 `sitemap.xml`，sitemap 包含首页与简历页 URL。

#### Scenario: 爬虫文件存在
- **WHEN** 检查构建产物
- **THEN** `robots.txt` 与 `sitemap.xml` 存在且内容有效
