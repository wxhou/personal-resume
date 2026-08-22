## Why

用户对比参考站 jingjinglearns.cc 后，认为当前 HeroSphere「动效不如参考站好看」。当前实现是单一静态自转 + 鼠标 raycaster 球面 repel 的粒子球，视觉张力弱、缺叙事。已逆向参考站 hero 源码，其核心手法是**粒子在三种形态间循环 morph（数据云 → 结构化矩阵 → 神经网络球）+ 相机鼠标视差 + 细环 + 克制两色**，慢节奏呈现。本次重写为该风格，提升首页首屏的高级感与「作者性」。

## What Changes

- 移除现有单一球体 + raycaster 球面 repel 交互，改为**三形态循环 morph**：散乱数据云 → 结构化矩阵 → 神经网络球，每 ~6.4s 切换（hold 4.2s + morph 2.2s，缓动插值），循环往复
- 新增**相机鼠标视差**：鼠标移动经 lerp 平滑后驱动 `camera.position`，整个场景随鼠标轻摆（替代粒子被推的 repel 逻辑）
- 新增**细环**装饰：`TorusGeometry(r=7.6, tube=0.015)`、`0.3` 透明度、brass 色，缓慢自转
- 配色改为**克制两色**：sage `0x7E9479` + brass `0xC2705B`，每 6 个粒子 1 个 brass；雾更淡 `FogExp2(0xFBF7F1, 0.05)`
- 粒子数与节奏：桌面 ~4800（移动端 2400）、`PointsMaterial` size `0.06`、自转 `dt*0.06`（极慢），morph 为视觉主角
- 保留全部既有兜底：仅客户端 useEffect 初始化（vite-react-ssg 安全）、prefers-reduced-motion → 不渲染、ResizeObserver + 500ms 定时器 + webglcontextlost + document.hidden 暂停 RAF、Dev 调试 hook `window.__heroSphere`
- `src/components/HeroSphere.jsx` 整体重写（~280 行 → 三形态 morph 版）

## Capabilities

### New Capabilities
<!-- 无新增能力 -->

### Modified Capabilities
- `homepage-visual-alignment`: 在「Hero 顶部装饰 / Hero 左对齐」等既有视觉对齐要求之外，新增 Hero 粒子系统的行为要求（三形态循环 morph、相机鼠标视差、细环、克制两色、慢节奏），与参考站 hero 视觉语言对齐

## Impact

- **代码**：`src/components/HeroSphere.jsx`（重写）；`src/pages/home.css`（如配色 token 需对齐 sage/brass）；`src/pages/HomePage.jsx`（可选：加形态名 stageLabel 元素）
- **依赖**：沿用已引入的 `three@0.185.1`，无其他新依赖
- **不受影响**：`/resume` 子页、SiteNav、Footer、数据层（facts/achievements/featuredProjects）、FxCursor 三层光标系统
- **可回撤**：本次改动集中在 HeroSphere.jsx 单文件 + 可选 css，终点可精确回到 HEAD 前状态
