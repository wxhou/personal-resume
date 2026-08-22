## 1. 点阵纸纹背景

- [x] 1.1 `home.css`：`.home-page` 加点阵背景（`radial-gradient(rgba(52,48,42,0.06) 1px, transparent 1px)`，`background-size: 22px 22px`）
- [x] 1.2 Playwright 截图确认：点阵肉眼可辨且不干扰文字；粒子 canvas、marquee、卡片表面层次正确

## 2. 身份徽章行

- [x] 2.1 `home.css`：新增 `.home-idbadge-row`（flex wrap + gap）与 `.home-idbadge` chip 样式（monogram 方块 + 项目名，hover 边框/文字转 accent，过渡沿用动效 token）
- [x] 2.2 `HomePage.jsx`：hero 内 tagline 之后插入徽章行——label「CREATOR OF」+ 遍历 `featured` 渲染 6 个 chip（monogram 取 name 前 2 字符，三色板轮换），点击新标签页跳转 `project.url`
- [x] 2.3 Playwright 断言：6 个 chip 渲染、href 指向对应 GitHub 仓库（target=_blank）、hover 类生效

## 3. Hero 实时数据行

- [x] 3.1 `home.css`：`.home-hero__stats` 样式（JetBrains Mono、--fs-small、--text-soft、flex · 分隔、margin-top 与 SCROLL 提示留白协调）
- [x] 3.2 `HomePage.jsx`：`.home-hero__scroll` 之前插入数据行——`{githubStats.repos} 仓库 · ⭐{githubStats.stars} · {blogPosts.length} 篇`，随 React 重渲染自动更新
- [x] 3.3 Playwright 断言：初始显示构建值 `104 仓库 · ⭐10 · 20 篇`；mock GitHub API 返回 stars=11 后数据行变为 ⭐11（复用 useGitHubStats 重渲染）

## 4. 验证与回归

- [x] 4.1 `npm run build` 通过
- [x] 4.2 回归检查：微交互四项不受影响（光斑 hover / 数字滚动 / 视差 / 迸发）、HeroSphere 正常、0 console error（403 资源日志除外并说明）
- [x] 4.3 移动端 375px：徽章行 flex-wrap 不溢出、数据行不换行错乱
