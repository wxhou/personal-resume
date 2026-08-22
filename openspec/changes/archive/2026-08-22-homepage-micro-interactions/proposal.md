## Why

首页下半页与首屏交互目前是「静态卡片墙」：卡片 hover 只有轻微上浮、Proof 数字直接静态显示、首屏滚动是硬切、CTA 无生命。参考站 jingjinglearns.cc 的四项微交互手法已逆向拿到源码（参数可照抄），补齐后整页从 hero 到 footer 的「活」感一致，且全部是该站验证过的成熟模式，不发明新轮子。

## What Changes

- **卡片光斑跟随**：`.home-project` / `.home-more__item` / `.home-proof__card` / `.home-fact` 卡片在鼠标移入时出现跟随光标的径向光斑（pointermove 写 `--mx/--my` + `::after` radial-gradient），参考站同款
- **Proof 数字滚动**：成果区 27+ / ⭐8 / 20 篇 进入视口时从 0 滚动到目标值（IO threshold 0.4 触发一次，1100ms easeInOut），后缀（+/⭐/篇）不动，reduced-motion 直接显示最终值
- **首屏滚动视差**：滚动时 hero 内容 translateY(y*0.18) 且渐隐（1 - y/(vh*0.85)），粒子层以 y*0.08 慢速跟随，SCROLL 提示 y>60 淡出；rAF 节流
- **磁吸按钮 + 点击迸发**：GitHub CTA 鼠标 ~100px 接近时向光标位移 ~30%、离开回弹；点击时在 FxCursor 的 fx-canvas 上生成 ~10 个 accent 色粒子向外飞散衰减
- 全部支持降级：prefers-reduced-motion 全静态；触屏（hover:none）跳过磁吸/光斑

## Capabilities

### New Capabilities
<!-- 无新增能力 -->

### Modified Capabilities
- `homepage-visual-alignment`: 新增「卡片光斑跟随」「磁吸按钮与点击迸发」两个 requirement（跨区块视觉行为）
- `homepage-proof-section`: 成果数据卡片新增「数字滚动进场」行为要求
- `homepage-scroll-narrative`: 新增「首屏滚动视差」requirement

## Impact

- **代码**：`src/pages/HomePage.jsx`（数字滚动 + 视差 + 磁吸）、`src/pages/home.css`(光斑样式)、`src/components/FxCursor.jsx`（点击迸发）；如光斑/磁吸逻辑复用性强则内联 useEffect，不强制新文件
- **依赖**：沿用 framer-motion（useInView/animate），零新包
- **不受影响**：HeroSphere 三形态 morph 逻辑、SiteNav 结构、数据层、`/resume`
- **风险面小**：均为展示层微交互，无 API/数据变更；终点可回撤
