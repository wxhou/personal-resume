## 1. 数据扩展

- [x] 1.1 扩展 `src/data/featuredProjects.json`：精选项目加 tag 与 tech 字段；新增补充项目层数据（moreProjects）
- [x] 1.2 创建 `src/data/achievements.js`：成就滚动条真实数据（openspec-playwright ⭐8、博客园 20 篇、8 年转型经历等）
- [x] 1.3 创建 `src/data/facts.js`：About 三事实数据（测试开发起步/项目经理四年/AI 应用工程师，基于真实经历）
- [x] 1.4 Hero 定位语候选交用户选定（design D2 三选一），写入数据文件（已选「用 AI 解决真实问题」）

## 2. 首页重写（单页滚动）

- [x] 2.1 重写 `src/pages/HomePage.jsx` 为单页滚动结构：Hero（定位语/副标题/状态条/双 CTA）→ 成就滚动条 → 技能栈 → 精选项目（编号卡片）→ 补充项目 → 成果区（#proof）→ About 三事实（#about）→ 博客 → 联系区（#contact）
- [x] 2.2 重写 `src/pages/home.css`：锚点 section 样式、区块编号、marquee 无缝滚动（纯 CSS animation + prefers-reduced-motion 降级）、编号项目卡片、成果卡片网格、FACT 卡片、二维码占位
- [x] 2.3 SiteNav 双态改造：首页显示锚点链接（项目/成果/关于/联系）+ 简历路由链接；简历页保持现状
- [x] 2.4 验证：浏览器实测锚点跳转平滑滚动、marquee 循环、reduced-motion 下停止、区块编号展示

## 3. SSG 与部署

- [x] 3.1 构建验证：静态 HTML 含成就/项目/事实全部文本（爬虫可见）、无 opacity:0 残留
- [x] 3.2 移动端验证：375px 无横向溢出、marquee 与卡片正常堆叠
- [x] 3.3 部署到 Vercel 并线上验证（锚点导航/滚动条/两页回归：简历页主题切换与导出正常）

## 4. 收尾

- [x] 4.1 提交变更（微信二维码图片待用户提供后单独补）
