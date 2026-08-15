## ADDED Requirements

### Requirement: 多页面路由
站点 SHALL 使用 react-router-dom 提供两个页面：`/`（首页）与 `/resume`（简历页），使用 history 模式路由。

#### Scenario: 访问首页
- **WHEN** 用户访问站点根路径 `/`
- **THEN** 渲染首页内容

#### Scenario: 访问简历页
- **WHEN** 用户访问 `/resume` 路径
- **THEN** 渲染简历页内容

#### Scenario: 直接访问子路径
- **WHEN** 用户直接输入 URL 访问 `/resume`（非从首页点击进入）
- **THEN** 页面正常渲染简历内容，不出现 404

### Requirement: 站点导航
站点 SHALL 提供导航链接，允许用户在首页与简历页之间切换，当前所在页面 SHALL 有激活态标识。

#### Scenario: 导航切换
- **WHEN** 用户在首页点击「简历」导航链接
- **THEN** 跳转到 `/resume` 且导航项显示激活态

#### Scenario: 返回首页
- **WHEN** 用户在简历页点击「首页」导航链接
- **THEN** 跳转到 `/` 且导航项显示激活态

### Requirement: 未知路径处理
访问不存在的路径时，站点 SHALL 重定向到首页或显示 404 页面，不出现空白页。

#### Scenario: 访问未知路径
- **WHEN** 用户访问不存在的路径（如 `/nonexistent`）
- **THEN** 页面重定向到首页或显示明确的 404 提示
