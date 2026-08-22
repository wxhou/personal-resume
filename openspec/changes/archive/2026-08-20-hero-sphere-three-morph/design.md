## Context

当前 `src/components/HeroSphere.jsx` 是单一 Fibonacci 球面粒子 + raycaster 球面 repel，视觉张力弱。参考站 jingjinglearns.cc 的 hero 已逆向确认核心手法：三形态 morph（chaos/matrix/brain）+ 相机视差 + 细环 + 两色克制 + 慢节奏。本设计在**复用现有所有兜底机制**（SSG 安全、reduced-motion、ResizeObserver/定时器/webglcontextlost/hidden 暂停、Dev hook）的前提下重写粒子系统，移除 raycaster repel。

## Goals / Non-Goals

**Goals:**
- 三形态（chaos → matrix → brain）循环 morph，缓动插值
- 相机鼠标视差替代 repel
- 细环 + 两色克制 + 慢节奏，对齐参考站视觉语言
- 保留全部既有兜底与 Dev 调试 hook

**Non-Goals:**
- 不改 `/resume`、nav、footer、数据层、FxCursor 三层光标
- 不引入 R3F/drei（手写 Three.js 控制体积）
- 不做交互式拖拽/缩放（仅被动视差）
- 不引入新 npm 依赖（沿用 `three@0.185.1`）

## Decisions

1. **三形态用预计算目标数组 + 运行时插值**（对齐参考站做法）
   - `makeChaos()`：随机散布 `±11/±7/±7` 的散乱数据云
   - `makeMatrix()`：行列网格 `±10/±5.5`，z 用 `sin*cos*1.2` 微起伏（结构化矩阵）
   - `makeBrain()`：球面分布（r 取 4.6/6.4 双层），`r*sin(t)*cos(p)`（神经网络球）
   - 三数组存进 `shapes[]`，动画循环中按 `from + (to-from)*ease(k)` 写入 `geometry.attributes.position`
   - 理由：参考站实测即此结构，0.06 size 的极小球在 morph 时呈现「流动感」而非硬切

2. **morph 调度状态机**
   - 常量：`HOLD = 4.2s`、`MORPH = 2.2s`、`ease = cubic`（`x<0.5 ? 4x³ : 1-(-2x+2)³/2`）
   - `phase: 'hold' → 'morph' → 'hold'`，`stage/next` 索引在 `shapes` 间循环
   - 仅 morph 阶段写 position + `needsUpdate = true`；hold 阶段不写（省 CPU）

3. **相机视差替代 repel**
   - 删除 raycaster + uMousePoint + uRepelStrength（含 shader 中 repel 分支）
   - 新增 `pointermove` → `mx/my` 归一化；每帧 `camera.position.x += (tx*1.6 - x)*0.04`，`lookAt(0,0,0)`
   - 理由：参考站用相机视差，整体轻摆比「粒子被推」更显高级且不抢标题戏

4. **细环 TorusGeometry**
   - `new TorusGeometry(7.6, 0.015, 8, 160)`，`MeshBasicMaterial({ color: brass, transparent, opacity: 0.3 })`
   - `ring.rotation.x = Math.PI/2.4`，每帧 `ring.rotation.z += dt*0.04`

5. **两色克制 + 慢粒子**
   - `sage = 0x7E9479`、`brass = 0xC2705B`；`paintColors()` 每 6 个粒子 1 个 brass
   - `PointsMaterial({ size: 0.06, vertexColors: true, transparent, opacity: 0.92, depthWrite: false })`
   - 粒子数：`isMobile ? 2400 : 4800`，`setDrawRange(0, drawCount)` 可动态调密度
   - 自转 `points.rotation.y += dt*0.06`（极慢），雾 `FogExp2(0xfbf7f1, 0.05)`

6. **Dev hook 与兜底保留**
   - `window.__heroSphere = { scene, camera, renderer, points, material, geometry, ring, resize }`
   - 移除 raycaster 相关字段；其余 ResizeObserver/定时器/webglcontextlost/hidden 暂停不变

## Risks / Trade-offs

- **[4800 粒子 CPU 插值]** → morph 阶段每帧遍历 `4800*3` 写 position；hold 阶段跳过写入。`drawRange` 可降级密度。
- **[GPU 负担]** → size 0.06 极小、`depthWrite:false`、antialias 沿用；移动端降到 2400。
- **[三形态叙事与简历主题契合度]** → chaos/matrix/brain 对应「原始数据→数据工程→AI 产品」，与简历 AI 应用工程师定位一致，无需用户文案确认（视觉层决策）。
- **[相机视差幅度]** → `±1.6/±1.1` 取自参考站，若实测遮挡标题再下调（验证阶段可调）。

## Migration Plan

1. 重写 `src/components/HeroSphere.jsx`（保留文件、改内容）
2. 如 `--accent` 与 brass/sage 不一致，在 `home.css` 增补 token（当前 accent `#B86B5D` 接近 brass，可不改）
3. `HomePage.jsx` 可选：加 `#stageLabel` 显示当前形态名（参考站有，但本站未要求，默认不加，保持 hero 克制）
4. 回撤边界：仅 HeroSphere.jsx 单文件改动 + 可选 css，可精确回到 HEAD 前

## Open Questions

- 是否要加 `#stageLabel` 形态名文字（参考站有「原始数据/数据工程/AI 产品」提示）。默认不加以保持 hero 克制；如用户后续想要可补。
