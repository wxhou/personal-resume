## Context

首页颜色体系现状盘点：
- **已 token 化**（暗色只需重定义值）：`.home-page` 上 13 个 `--bg/--surface/--text/--accent` 变量，全部组件消费 token
- **硬编码需联动**（5 处）：① `HomePage.jsx` useEffect 强制 `document.body.style.background = '#FBF7F1'`；② HeroSphere `FogExp2(0xfbf7f1, .05)`；③ JSX 内 SVG 椭圆 `stroke="#B86B5D"`；④ console 面板 `rgba(255,255,255,0.7)` 背景 + 点阵 `rgba(52,48,42,.06)`（CSS）；⑤ ScrollProgress 渐变第二色 `#2d4a3a`（暗底可辨，保留）
- `/resume` 有独立 style-switcher（多套风格），本 change 不触碰
- 参考站架构已逆向：`applyTheme(mode)` → `documentElement.dataset.theme` + `localStorage.siteTheme` + fog 色切换——照抄该模型

## Goals / Non-Goals

**Goals:**
- 首页亮/暗双主题：toggle + 系统跟随 + localStorage + FOUC 防护
- 非 DOM 层（HeroSphere 雾色、光标可辨性）同步
- 全部换肤经 token 与少量显式联动点实现，无逐元素硬编码扩散

**Non-Goals:**
- 不动 `/resume` 及其主题系统
- 不做「跟随系统」独立档位的三态循环 UI（两态 toggle + 首次跟随系统，心智最简）
- 不做主题切换过渡动画的全局统一编排（沿用现有 transition 自然过渡）
- 不改亮色任何既有视觉值

## Decisions

1. **状态源与作用域**：theme state 放 HomePage（useState 初始化自内联脚本已设好的 `data-theme` 属性），写 `.home-page[data-theme="dark"]`
   - 内联脚本（Head 里 `<script>`）负责首帧前设置：读 `localStorage.siteTheme` → 无记录用 `matchMedia('(prefers-color-scheme: dark)')` → 写 `.home-page` 的 data-theme（脚本在 SSG HTML 中 body 开头附近执行时容器可能未解析完，改为设置在 `document.documentElement`，`.home-page` 选择器改挂 `html[data-theme]` 后代选择器）
   - 决策：`data-theme` 设在 `<html>` 上，CSS 用 `:root[data-theme="dark"] .home-page { … }`——内联脚本时机最稳

2. **暗色 token 值**（暖色同源推导）：
   ```
   --bg-page: #211D18        --text-strong: #F0EAE2     --accent: #C97A66
   --bg-soft: #2A251F        --text-base: #B8AFA3       --accent-hover: #D48973
   --surface: #2E2924        --text-soft: #857C70       --accent-soft: rgba(201,122,102,.14)
   --surface-border: rgba(240,234,226,.08)
   --surface-border-strong: rgba(240,234,226,.16)
   ```
   - accent 提亮的理由：#B86B5D 在 #211D18 上对比度约 3.2:1，提亮到 #C97A66 约 4.6:1 过 AA（正文级）
   - 点阵暗色版：`radial-gradient(rgba(240,234,226,.05) 1px, transparent 1px)`
   - console 面板背景改 token：亮 `rgba(255,255,255,.7)` → 暗 `rgba(46,41,36,.72)`（用变量 `--console-bg` 新增或直接在 dark 块覆写该规则）

3. **联动桥接**：
   - body 背景：HomePage useEffect 依赖 theme → `document.body.style.background = theme==='dark' ? '#211D18' : '#FBF7F1'`
   - HeroSphere：新增 prop `dark: boolean`（React 正道，优于 window hook），effect 内监听变化 → `scene.fog.color.set(dark ? 0x211D18 : 0xfbf7f1)`；粒子 sage/brass 保持（实测暗底可辨），若验证发现过暗再调
   - SVG 椭圆：`stroke` 保持赭红、暗色下靠 opacity 已有 0.35 可辨，不改；验证不过再适配
   - FxCursor：拖尾 #B86B5D 暗底对比约 3:1，dot/ring 同色可辨——保持不动（spec 场景只要求「可辨」）

4. **Toggle 组件**：SiteNav 内 `onHome` 分支渲染按钮（Sun/Moon 按 theme 切换图标），aria-label「切换主题」；点击回调由 HomePage 传入？——否决 props 下传（SiteNav 与 HomePage 无父子数据流），改用**自定义事件**：SiteNav dispatch `homepage:toggle-theme`，HomePage 监听并 setState。解耦且不动 SiteNav 接口
   - 备选否决：把 toggle 直接放 HomePage hero 区（视觉位置不对，参考站在 nav）；放 SiteNav 用 context（引入 Provider 包裹，改动面更大）

5. **FOUC 脚本**（~8 行，注入 Vite 入口模板 `index.html` 的 `<head>`）：
   > 实现备注：原计划经 vite-react-ssg 的 `Head` 注入，实测其不输出 `<script>` 标签，故改注入 Vite HTML 模板——效果一致且对两个页面（/ 与 /resume）均生效。
   ```js
   try{var t=localStorage.getItem('siteTheme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}
   ```

6. **持久化 key 与参考站一致**（`siteTheme`），值为 `'light'/'dark'`

## Risks / Trade-offs

- **[SSG 预渲染 HTML 的 head 注入]** → vite-react-ssg 的 `Head` 支持 script 标签输出；build 后检查 dist/index.html 含内联脚本（验证任务覆盖）
- **[暗色对比度不达标处漏网]** → Playwright 双主题截图人工核 + 对正文/accent 抽查 computed contrast ≥ AA；发现问题迭代 token 值
- **[HeroSphere prop 引发 scene 重建]** → effect 只改 fog.color.set()，不重建 renderer/geometry；deps 数组精确控制
- **[SiteNav 自定义事件耦合弱化类型安全]** → 事件名常量导出共享，两处引用同一常量
- **[暗色下微交互色彩]** → 光斑 rgba(accent,.08)、迸发 #B86B5D、磁吸 hover 均基于 accent 系，暗色下自动随 token/保持可辨；验证清单含微交互双主题抽查

## Migration Plan

1. home.css：`:root[data-theme="dark"] .home-page` token 块 + console/点阵等硬编码的 dark 覆写
2. HomePage.jsx：theme state + 内联初始化读取 + body 联动 + 事件监听 + HeroSphere prop
3. SiteNav.jsx：toggle 按钮（onHome 时）dispatch 事件
4. HeroSphere.jsx：`dark` prop → fog 联动
5. Head 内联 FOUC 脚本
6. 回撤边界：5 个文件展示层改动，git 单独提交可精确回退

## Open Questions

- 无阻塞项。暗色具体色值以验证阶段实际观感为准微调（design 给的是推导起点）。
