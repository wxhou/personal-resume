## 1. 卡片光斑跟随

- [x] 1.1 `home.css`：为 `.home-project / .home-more__item / .home-proof__card / .home-fact` 补 `position:relative; overflow:hidden`，加 `::after` 光斑样式（`radial-gradient(240px circle at var(--mx,50%) var(--my,50%), rgba(184,107,93,.08), transparent 60%)`，opacity 0→.3s 过渡）
- [x] 1.2 `HomePage.jsx`：新增一个 useEffect——选择器委托绑定上述四类卡片，pointermove 写 `--mx/--my`（相对卡片左上角），pointerenter/leave 切换 `is-glowing` 类；hover:none 与 reduced-motion 跳过
- [x] 1.3 清理函数：移除全部监听

## 2. Proof 数字滚动

- [x] 2.1 `HomePage.jsx` 新增 `CountUp({ value, prefix, suffix })` 组件：framer-motion `useInView(ref,{once:true,amount:0.4})` + `animate()`（1.1s easeInOut）滚动数值；`useReducedMotion()` 为 true 时直接渲染最终值；三卡 index 错峰 ~90ms
- [x] 2.2 替换 Proof 三张卡的数值渲染为 CountUp：27+（prefix 无/value 27/suffix "+"）、⭐8（prefix "⭐"/value 8）、20 篇（value 20/suffix " 篇"）

## 3. 首屏滚动视差

- [x] 3.1 `home.css`：hero 内容包一层 wrapper（`.home-hero__inner`：flex column、flex:1），SCROLL 提示的 margin-top:auto 移到 wrapper 内仍生效；`.home-hero__bg` 加 `will-change: transform`
- [x] 3.2 `HomePage.jsx`：hero 内容包进 `<div className="home-hero__inner">`；新增 useEffect 滚动视差（rAF parTick 节流）：inner translateY(y*0.18)、opacity max(0,1-y/(vh*0.85))，`.home-hero__bg` translateY(y*0.08)，SCROLL 提示 y>60 opacity 0，y>vh early-return；reduced-motion 不绑监听

## 4. 磁吸按钮 + 点击迸发

- [x] 4.1 `HomePage.jsx`：对 `.home-hero__ctas` 监听 pointermove（<100px 时按钮 translate(dx*0.3, dy*0.3)，离开 reset，transform transition .2s/.3s 切换）；hover:none 与 reduced-motion 跳过；确认与 CSS hover 的 translateY(-1px) 不叠加冲突
- [x] 4.2 `FxCursor.jsx`：click 时 push ~10 个迸发粒子 `{x,y,vx,vy,a:1}` 到独立池，drawTrail 循环里更新（vx/vy*0.92、alpha 衰减），同色 #B86B5D；reduced-motion 天然降级（组件已 return）

## 5. 验证

- [x] 5.1 `npm run build` 通过
- [x] 5.2 Playwright 断言（1440×900）：hover 项目卡时 `--mx/--my` 随鼠标变化且 is-glowing 类切换；滚到 Proof 区后数字从滚动值收敛到 27/8/20 且后缀不变；滚动 y=300 时 inner transform/opacity 与 bg transform 符合公式；CTA 接近鼠标时产生 transform；点击页面后 fx-canvas 出现新粒子并衰减；全程 0 console error
- [x] 5.3 reduced-motion emulate：数字直接显示最终值、无视差 transform、无迸发粒子、0 error
- [x] 5.4 触屏模拟（hover:none）：无磁吸/光斑监听副作用，页面功能正常
