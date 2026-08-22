## Context

首页当前状态：Hero 已对齐参考站（三形态 morph 粒子 + 相机视差 + 细环，见已归档 change hero-sphere-three-morph），但下半页四类卡片是静态白卡、Proof 数字静态显示、首屏滚动硬切、CTA 普通 hover。参考站 jingjinglearns.cc 的对应源码已逆向拿到（fx 模块 blob + 内联脚本），参数可直接照抄。项目已有 framer-motion（Reveal/useInView 可用）、FxCursor 三层光标（含全屏 fx-canvas 画布）。

## Goals / Non-Goals

**Goals:**
- 四项微交互落地：卡片光斑、Proof 数字滚动、首屏滚动视差、磁吸按钮+点击迸发
- 参数与参考站一致（光斑 240px/0.08α、滚动 1100ms easeInOut 错峰 90ms、视差 0.18/0.08/60px、磁吸 100px/30%）
- 全量降级：reduced-motion 静态、触屏跳过 hover 类交互

**Non-Goals:**
- 不做卡片 3D 倾斜（容易过度，参考站有但克制起见本次不做）
- 不做开场 intro overlay、眉题解码动画
- 不动 HeroSphere / SiteNav / 数据层 / `/resume`
- 不为光斑单独建 React 组件——用事件委托式 useEffect

## Decisions

1. **卡片光斑：单个 useEffect + 事件委托，CSS 变量承载坐标**
   - HomePage.jsx 增加一个 useEffect：`document.querySelectorAll('.home-project, .home-more__item, .home-proof__card, .home-fact')` 上绑 pointermove，写 `--mx/--my`；`pointerenter/leave` 切换 `is-glowing` 类
   - CSS：`.home-project::after { background: radial-gradient(240px circle at var(--mx,50%) var(--my,50%), rgba(184,107,93,.08), transparent 60%); opacity:0; transition:opacity .3s } .home-project.is-glowing::after { opacity:1 }`
   - 备选否决：每卡片一个 React 组件包裹 → 改动面大、和现有 Reveal 嵌套冲突
   - 卡片需 `position:relative; overflow:hidden`（.home-fact/.home-proof__card 现无 overflow，需补）

2. **Proof 数字滚动：CountUp 子组件 + framer-motion useInView**
   - 新增 `CountUp({ value, prefix, suffix })`：解析现有字符串为数字部分（27+/⭐8/20 篇 → 27/8/20），`useInView(ref, { once:true, amount:0.4 })` 触发，`animate(0, value, { duration:1.1, ease:'easeInOut', onUpdate })` 写回 textContent；三卡通过 Reveal 的 delay 或自身 index*90ms 错峰
   - reduced-motion（framer-motion 的 `useReducedMotion()`）→ 直接渲染最终值
   - 数据仍来自现有 JSX 字面量（27+/⭐8/20 篇），不新建数据文件

3. **首屏滚动视差：HomePage 内一个 useEffect，rAF 节流，直写 style**
   - 引用：`.home-hero > 内容元素`（eyebrow/h1/subtitle/tagline/status/ctas 打包进一个包装 div？）——否决改 DOM 结构；改为对 `.home-hero` 直接操作其子文本容器不可行 → 采用参考站做法：给 hero 内容包一层 `heroInner` div（新增一个 className=`home-hero__inner` 的 wrapper），transform/opacity 写在它上面
   - `.home-hero__bg` translateY(y*0.08)；`.home-hero__scroll` opacity 由 y>60 控制
   - y > window.innerHeight 后 early-return；`matchMedia('(prefers-reduced-motion: reduce)')` 为 true 则不绑监听
   - 注意与 framer-motion heroEnter 动画的 transform 冲突：heroEnter 在 section 根上做一次性进场，视差写在 inner wrapper 与 bg 层，二者不叠加同一元素，无冲突

4. **磁吸按钮：CTA 容器级 mousemove + transform 直写**
   - 对 `.home-hero__ctas` 区域监听 pointermove：距离按钮中心 <100px 时 `translate((dx)*0.3, (dy)*0.3)`，否则 reset；`transition: transform .2s ease-out`（进入）/`.3s`（回弹）由类切换
   - 触屏（hover:none）与 reduced-motion 跳过

5. **点击迸发：扩展 FxCursor 现有 canvas 渲染循环**
   - FxCursor 已有 pointsRef 拖尾粒子池 + drawTrail；增加 `burstsRef`：click 时 push ~10 个 `{x,y,vx,vy,a:1}`（随机角度/速度），循环里更新位置（vx/vy 衰减 0.92）、alpha 衰减，同色 #B86B5D
   - reduced-motion 时 FxCursor 整体已 return，天然降级

6. **性能纪律**
   - 所有 scroll/pointer 监听 `{ passive: true }`；scroll 用 rAF 合帧（parTick 模式）
   - 光斑 pointermove 只写两个 CSS 变量（浏览器合成层处理），无布局抖动

## Risks / Trade-offs

- **[hero 内容包一层 wrapper 改 DOM]** → 仅影响 hero 内布局（flex column 下 wrapper 成为唯一 flex 子项，需让 wrapper `display:contents` 或把 flex 移到 wrapper）；采用方案：wrapper 自身 `display:flex; flex-direction:column; flex:1`，SCROLL 提示移入 wrapper 保持 margin-top:auto 生效
- **[光斑 ::after 与卡片既有 border/hover 冲突]** → ::after 用 inset:0 + pointer-events:none，不遮内容；z-index 高于背景低于文字（默认即可，文字在正常流）
- **[磁吸与 CTA 原 translateY(-1px) hover 冲突]** → 磁吸激活时移除 CSS hover 的 translate（类切换或磁吸 transform 覆盖内联优先级更高）；验证阶段确认
- **[CountUp 解析 "⭐8" emoji]** → prefix/suffix 显式传参（prefix="⭐", value=8, suffix="" 等），不做字符串猜测解析

## Migration Plan

1. home.css 加光斑样式（4 类卡片 + is-glowing）
2. HomePage.jsx：加 CountUp 组件替换 Proof 数值渲染；hero 包 inner wrapper；三个 useEffect（光斑委托 / 视差 / 磁吸）
3. FxCursor.jsx：加 bursts 迸发粒子
4. 回撤边界：3 个文件均为展示层改动，git 单独提交可精确回退

## Open Questions

- 无（四项范围用户已确认；磁吸/迸发参数若实测过度再微调，属实现细节）
