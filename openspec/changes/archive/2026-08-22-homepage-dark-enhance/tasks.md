## 1. 默认暗色

- [x] 1.1 `index.html`：FOUC 脚本 fallback 改 `|| 'dark'`，移除 matchMedia 系统偏好读取
- [x] 1.2 `HomePage.jsx`：归一化兜底 `'light'` 改 `'dark'`（useState 初始化处），注释同步
- [x] 1.3 Playwright 断言：清 localStorage（系统亮色模拟）→ 首帧 htmlTheme=dark；切亮后刷新保持 light

## 2. 暗色粒子星云

- [x] 2.1 `HeroSphere.jsx`：`paintColors(isDark)` 双色板（light: sage/brass 原值；dark: `#96AC90`/`#D48973` 归一化）；init effect 创建场景时按当前 `dark` prop 初始化色板与混合模式
- [x] 2.2 `HeroSphere.jsx`：`useLayoutEffect([dark])` 联动（防首帧闪烁）——blending 赋值切换 + color attribute 重写 + `attribute.needsUpdate = true`
- [x] 2.3 Playwright 断言：暗色下 `material.blending === AdditiveBlending`、color attribute 首值等于暗板；切亮恢复 NormalBlending 与原色板；additive 观感截图调参（fog/opacity 必要时微降）

## 3. 暗色氛围光与细节增强

- [x] 3.1 `home.css`：`.home-hero__bg::after` 暗色氛围光（radial-gradient 椭圆 rgba(201,122,102,.08)、pointer-events:none、z-index 于 canvas 上内容下）
- [x] 3.2 `home.css` 暗色块三处：点阵 α 0.05→0.07、`--text-soft` → `#8F867A`、四类卡片光斑 ::after gradient 覆写为 rgba(201,122,102,.12)
- [x] 3.3 Playwright 断言：暗色下氛围光 computed 存在且不拦截交互（elementFromPoint 穿透）、text-soft 对比度 ≥4.5、点阵 α 生效；亮色下均无变化

## 4. 回归与验证

- [x] 4.1 `npm run build` 通过
- [x] 4.2 双主题截图对比存档（星云质感 / 氛围光 / 整体观感），0 pageerror
- [x] 4.3 亮色回归抽查：粒子混合模式/色板/无氛围光/点阵——与增强前一致
- [x] 4.4 微交互回归：光斑暗色增强生效、数字滚动正常、切换往返状态正确
