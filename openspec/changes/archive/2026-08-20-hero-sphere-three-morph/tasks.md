## 1. 移除旧实现，搭建三形态数据

- [x] 1.1 重写 `HeroSphere.jsx` 导入：移除 `Raycaster/Vector2/AdditiveBlending/NormalBlending/ACESFilmicToneMapping/SRGBColorSpace` 等不再使用的符号，保留 `Scene/PerspectiveCamera/WebGLRenderer/BufferGeometry/BufferAttribute/Points/PointsMaterial/Mesh/TorusGeometry/MeshBasicMaterial/FogExp2/Vector3` 等
- [x] 1.2 新增 `makeChaos()` / `makeMatrix()` / `makeBrain()` 三个目标形态生成函数（散乱数据云 / 结构化矩阵 / 神经网络球双层球面），产出 `Float32Array(COUNT*3)`
- [x] 1.3 设定 `COUNT`（移动端 2400 / 桌面 4800）、`drawCount` 默认显示数、`shapes[]` 数组、`stageNames[]`（可选，默认不渲染文字）

## 2. 粒子系统 + 细环

- [x] 2.1 用 `shapes[0]` 初始化 `geometry.position`，`setDrawRange(0, drawCount)`；`geo.setAttribute('color', ...)` 并调用 `paintColors()`（每 6 个粒子 1 个 brass `0xC2705B`，其余 sage `0x7E9479`）
- [x] 2.2 创建 `PointsMaterial({ size: 0.06, vertexColors: true, transparent, opacity: 0.92, depthWrite: false })` 与 `points`，加入 scene
- [x] 2.3 创建细环 `TorusGeometry(7.6, 0.015, 8, 160)` + `MeshBasicMaterial({ color: brass, transparent, opacity: 0.3 })`，`ring.rotation.x = Math.PI/2.4`，加入 scene
- [x] 2.4 场景雾改用 `FogExp2(0xfbf7f1, 0.05)`；相机 `position.set(0,0, isMobile?16:12)`，fov 60

## 3. morph 调度 + 相机视差

- [x] 3.1 实现 morph 状态机：`HOLD=4.2` / `MORPH=2.2` / `ease` cubic；`phase` 在 hold↔morph 切换，`stage/next` 循环；morph 阶段按 `from+(to-from)*ease(k)` 写 position 并 `needsUpdate=true`，hold 阶段跳过写入
- [x] 3.2 实现相机视差：`pointermove`（非 hover 设备跳过）→ 归一化 `tx/ty`；每帧 `camera.position.x += (tx*1.6 - x)*0.04`、`camera.position.y += (-ty*1.1 - y)*0.04`、`lookAt(0,0,0)`
- [x] 3.3 极慢自转：`points.rotation.y += dt*0.06`、`ring.rotation.z += dt*0.04`

## 4. 兜底与调试 hook

- [x] 4.1 保留 reduced-motion `return null`、ResizeObserver + 500ms 定时器 + `webglcontextlost` 兜底 + `document.hidden` 暂停 RAF
- [x] 4.2 更新 `window.__heroSphere` Dev hook：暴露 `scene/camera/renderer/points/material/geometry/ring/resize`，移除 raycaster 字段
- [x] 4.3 清理函数：dispose geometry/material/renderer、移除事件监听、断开 ResizeObserver、clearInterval

## 5. 验证

- [x] 5.1 `npm run build` 通过（tree-shake 命名导入，无报错）
- [x] 5.2 dev server 起，Playwright 截图 1440×900：确认三形态可见（chaos/matrix/brain 至少观察到一个完整循环）、细环、两色克制、标题不被遮挡
- [x] 5.3 Playwright evaluate 断言：粒子数 4800、`camera.position.x/y` 随合成 pointermove 跟随、`repelStrength` 字段已移除、0 console error
- [x] 5.4 reduced-motion 模拟：粒子 canvas 不渲染、无报错
