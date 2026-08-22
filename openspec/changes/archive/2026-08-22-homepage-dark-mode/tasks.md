## 1. 主题状态与 FOUC

- [x] 1.1 HomePage.jsx：`Head` 内注入 FOUC 内联脚本（读 `localStorage.siteTheme`，无记录读 `prefers-color-scheme`，写 `documentElement.dataset.theme`）
- [x] 1.2 HomePage.jsx：`theme` state（初始读 `documentElement.dataset.theme`）、`toggleTheme`（setState + 写 localStorage + 同步 `documentElement.dataset.theme`）；监听 SiteNav 的 `homepage:toggle-theme` 自定义事件（事件名常量导出共享）
- [x] 1.3 HomePage.jsx：body 背景 useEffect 跟随 theme（`#FBF7F1 ↔ #211D18`），清理时恢复原逻辑

## 2. 暗色 token 与硬编码清理

- [x] 2.1 home.css：`:root[data-theme="dark"] .home-page` 重定义全套 token（design 色板：底 #211D18 / 表面 #2E2924 / 文字米白系 / accent #C97A66）
- [x] 2.2 home.css：暗色覆写点阵纹理（浅色点 rgba(240,234,226,.05)）与 console 面板背景（rgba(46,41,36,.72)）
- [x] 2.3 检查其余硬编码：ScrollProgress 渐变、SVG 椭圆描边、FxCursor 拖尾——按 design 结论保留（暗底可辨），验证不过再补

## 3. 组件联动

- [x] 3.1 SiteNav.jsx：`onHome` 分支渲染主题切换按钮（Sun/Moon 图标随 theme、aria-label「切换主题」），点击 dispatch `homepage:toggle-theme`；按钮样式与 nav 现有链接语言一致
- [x] 3.2 HeroSphere.jsx：新增 `dark` prop，effect 内监听变化 `scene.fog.color.set(dark ? 0x211D18 : 0xfbf7f1)`（不重建场景）；HomePage 传入
- [x] 3.3 SiteNav 主题按钮的 hover/焦点样式适配双主题（消费 token）

## 4. 验证

- [x] 4.1 `npm run build` 通过；检查 dist/index.html 含 FOUC 内联脚本
- [x] 4.2 Playwright 双主题断言：点击 toggle → html data-theme 切换、body/页面底色切换、HeroSphere 雾色切换（读 hook）、localStorage 写入；刷新后主题保持；0 pageerror
- [x] 4.3 FOUC 验证：emulate prefers-color-scheme: dark + 清 localStorage → 首帧即暗色（加载后立即读 data-theme）
- [x] 4.4 暗色回归抽查：正文/accent 对比度抽查（computed）、微交互（光斑/数字滚动/磁吸）暗色下正常、粒子场景无报错、点阵可见
- [x] 4.5 `/resume` 回归：首页切暗色后进入 /resume 不受影响（resume 主题系统独立）
- [x] 4.6 移动端 375px：暗色下布局无溢出、toggle 可点
