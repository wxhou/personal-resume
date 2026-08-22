## Why

暗色模式上线后用户反馈「暗色比亮色还好看」——暗色是这套暖色体系的天然主场。当前暗色只是「把亮色翻过来」（token 换值 + 雾色联动），尚未发挥暗底的独特优势：additive 混合的发光粒子、区域氛围光这些**只有深底才成立**的效果。本次把暗色从「及格」推到「惊艳」，同时按用户决策把默认主题定为暗色（不再跟随系统）。

## What Changes

- **① 粒子星云化**：暗色下 HeroSphere 粒子切换 `AdditiveBlending` 并提亮色板（sage `#7E9479→#96AC90`、brass `#C2705B→#D48973`），粒子从「撒点」变「微光星云」；亮色保持 NormalBlending 不受影响（additive 在浅底会过曝不可见）
- **② 暖色氛围光**：暗色下 hero 区叠加深赭红 radial glow（`rgba(201,122,102,.08)` 椭圆光晕），纯 CSS 零 DOM，给画面纵深
- **④ 细节微调**：暗色点阵纹理 α `0.05→0.07`；`--text-soft` 提亮 `#857C70→#8F867A`（对暗底 ≥4.5:1）；卡片光斑暗色下增强（α `.08→.12`、色随暗色 accent）
- **③ 默认暗色**：首次访问（localStorage 无记录）直接渲染暗色，**移除系统偏好跟随**；手动切换与 localStorage 持久化保持不变
- 不做：亮色侧任何视觉变更、FxCursor 拖尾色适配（实测 5.15:1 已可辨）、三态切换 UI

## Capabilities

### Modified Capabilities
- `homepage-theme-switching`:
  - REMOVED「首次访问跟随系统」（产品决策：暗色为站点默认身份，不随系统摇摆）
  - ADDED「默认暗色」「暗色粒子星云」「暗色氛围光与细节增强」

## Impact

- **代码**：`src/components/HeroSphere.jsx`（双主题色板 + blending 切换）、`src/pages/home.css`（氛围光 + 点阵/soft/光斑暗色覆写）、`index.html`（FOUC fallback 改 dark）、`src/pages/HomePage.jsx`（归一化兜底同步改 dark）
- **依赖**：零新包
- **不受影响**：亮色全部视觉、`/resume`、切换/持久化机制本身
- **风险**：additive 与 fog 的相互作用需实测调参；blending 切换需 `material.needsUpdate`（漏掉会不生效）
