## ADDED Requirements

### Requirement: SPA fallback 配置
`vercel.json` SHALL 配置 rewrites，将所有路径请求回退到 `index.html`，确保直接访问 `/resume` 不返回 404。

#### Scenario: 直接访问子路径
- **WHEN** 线上直接访问 `https://<domain>/resume`
- **THEN** 返回简历页内容，不出现 404

### Requirement: 构建与输出配置
Vercel 部署 SHALL 使用 `npm run build` 作为构建命令，输出目录为 `dist`，base 路径为根路径 `/`。

#### Scenario: 部署成功
- **WHEN** Vercel 执行部署
- **THEN** 构建成功且站点在根路径可访问

### Requirement: 根路径资源加载
部署后所有静态资源（JS/CSS/图片）SHALL 从根路径加载，不残留 `/personal-resume/` 前缀。

#### Scenario: 资源路径正确
- **WHEN** 检查线上页面加载的资源 URL
- **THEN** 资源 URL 以 `/` 开头，无 `/personal-resume/` 前缀
