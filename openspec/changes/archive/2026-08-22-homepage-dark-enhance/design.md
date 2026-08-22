## Context

暗色已上线（token 双套 + 雾色联动 + FOUC），本次是暗色的「质感深化」。关键事实：粒子用 `PointsMaterial` + vertex colors（sage/brass 写死归一化值）+ NormalBlending；HeroSphere 已有 `dark` prop 与 sceneRef 桥接（雾色联动先例）；光斑/点阵/text-soft 均在 home.css 可定位。

## Goals / Non-Goals

**Goals:**
- 暗色下星云化（additive + 提亮色板）、氛围光、三处细节增强
- 默认主题改暗色，移除系统跟随
- 亮色零变更

**Non-Goals:**
- 不做 FxCursor 拖尾适配（5.15:1 已达标）
- 不做切换过渡动画编排
- 不动 /resume

## Decisions

1. **双主题色板进 paintColors(dark)**：现有 `paintColors()` 无参写死 sage/brass 归一化值 → 改为 `paintColors(isDark)` 内两套色板；dark prop 变化的 effect 里重写 color attribute + `needsUpdate = true`
   - 暗色板：sage `#96AC90`(0.588,0.675,0.565)、brass `#D48973`(0.831,0.537,0.451)——additive 下叠加会自然增亮，色值不必过亮
2. **blending 切换与首帧防闪**：init effect 创建场景时即按当前 `dark` prop 初始化色板与混合模式；`[dark]` 联动 effect 用 `useLayoutEffect`（commit 后、绘制前执行）——否则默认暗色下每个新访客首帧都会闪现「普通混合·亮色板」粒子再切星云。切换时：重写 color attribute + `attribute.needsUpdate = true`（颜色生效的必要条件）；`material.blending` 直接赋值即生效（非编译期状态，`needsUpdate` 仅无害保险）
   - fog 保持现状（FogExp2 已随主题切色）；additive × fog 的实际观感实现时截图调参，必要时暗色下微降 opacity（0.92→0.85）
3. **氛围光挂在 `.home-hero__bg::after`**：z-index 置于 canvas 之上（内容之下），radial-gradient 椭圆 60%×50% at 60% 38%、rgba(201,122,102,.08)→transparent 65%；pointer-events:none。放在粒子层内让光「透过」粒子云而非垫底
4. **细节三处均为暗色块内覆写**：点阵 α、--text-soft 变量值、光斑 ::after 的 gradient 色（新增一条 dark 覆写规则统一四类卡片）
5. **默认暗色两处改动**：index.html FOUC `|| 'dark'`（删 matchMedia）；HomePage 归一化兜底 `'light'→'dark'`（注释同步）
6. **spec 处理**：「首次访问跟随系统」REMOVED+ADDED「默认暗色」（语义反转，非 MODIFIED）

## Risks / Trade-offs

- **[additive 在 additive 下 fog 使远处粒子发灰]** → 截图实测，必要时暗色下 fog density 0.05 微调或 opacity 下调
- **[blending 切换后首帧闪烁]** → needsUpdate 同帧生效，React effect 时序在渲染循环外，风险低；验证覆盖
- **[默认暗色对亮色系统用户的第一印象突变]** → 用户明确决策（暗色为站点身份）；toggle 一键可回亮色且被记住
- **[氛围光遮挡文字]** → α 仅 .08 且 radial 渐变边缘透明；截图验证文字对比度不变

## Migration Plan

1. HeroSphere.jsx：色板参数化 + [dark] effect 三件套
2. home.css：氛围光 + 三处暗色覆写
3. index.html + HomePage.jsx：fallback 改 dark
4. 回撤边界：4 文件展示层，git 单独提交可回退

## Open Questions

- 无。
