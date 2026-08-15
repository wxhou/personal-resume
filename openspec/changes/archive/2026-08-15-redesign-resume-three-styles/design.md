## Context

当前简历（src/App.jsx）使用橙色主题 + Tailwind + Framer Motion，视觉风格偏普通，缺乏辨识度。已尝试暖色调编辑风格但效果不佳。需要通过融合三种成熟的高级设计风格来彻底提升视觉品质。

项目约束：
- 技术栈：React + Tailwind CSS + Framer Motion + Lucide React
- 必须保留所有内容数据不变
- 导出 PDF/图片功能必须正常工作
- A4 纸张尺寸打印适配
- 三种风格需在同一页面中共存，通过切换器切换

## Goals / Non-Goals

**Goals:**
- 实现三种差异化的高级设计风格：深色精密感、艺术杂志风、几何艺术构成
- 通过主题切换器让用户实时预览不同风格
- 每种风格都要达到 Awwwards 级别的视觉品质
- 确保打印和导出的输出物干净、专业

**Non-Goals:**
- 不改变任何内容数据和业务逻辑
- 不添加新的功能模块（如动画、Hover 特效除外）
- 不修改后端或构建配置
- 不做响应式多设备适配优化（聚焦桌面 A4 展示）

## Decisions

### D1: 主题切换架构 — CSS 变量 + data-theme 属性

**选择方案**：通过 React state 切换根元素的 `data-theme` 属性，所有样式基于 CSS 变量实现主题化。

**备选方案对比**：
- CSS-in-JS（styled-components）：增加 bundle size，且主题切换需要重新渲染
- 多组件方案（3 套独立组件）：代码重复，维护成本高
- Tailwind 变体（dark:）：适合 dual-theme，但三种风格切换过于复杂

**结论**：CSS 变量方案最轻量，切换无闪烁，一套组件复用。

### D2: 三种风格的设计语言

| 维度 | 深色精密感 (Dark) | 艺术杂志风 (Editorial) | 几何艺术构成 (Geometric) |
|------|-----------------|---------------------|----------------------|
| 背景 | #09090B 近黑 | #F9F7F4 暖白 | #FFFFFF 纯白 |
| 主色 | #FAFAFA 冷白文字 | #1C1917 深炭文字 | #0F172A 深蓝文字 |
| 强调色 | #F59E0B 琥珀 | #DC2626 朱红 | #1E3A5F 深蓝 |
| 字体标题 | Outfit 700 | Playfair Display 600 | Space Grotesk 700 |
| 字体正文 | Inter 300 | Cormorant Garamond 400 | DM Sans 400 |
| 布局 | 左对齐精密网格，大量留白 | 左重非对称排版 | 几何线条分区 |
| 卡片 | 无边框，微妙分隔线 | 无卡片，细分隔线 | 几何形状切割 |
| 动效 | 精密的 fade + 微位移 | 优雅的 stagger reveal | 几何线条入场动画 |

### D3: 技能标签展示方式

- **Dark**：等宽字体 + 细边框药丸，hover 时微微发光
- **Editorial**：无边框纯文字，字号由大到小渐变排列
- **Geometric**：矩形药丸网格（Space Mono + 1px 细边框）

### D4: 项目经验卡片

- **Dark**：纯文字，左侧细线指示器，hover 时右侧出现琥珀色竖线
- **Editorial**：项目名超大字体，描述文字极小，之间用细线分隔
- **Geometric**：每张卡片有数字索引（01, 02...）作为装饰元素，左侧细蓝竖线指示器

### D5: 头像设计

- **Dark**：正方形 + 细边框，姓名首字母，header 左对齐布局
- **Editorial**：圆形 + 衬线字体姓名缩写，外圈装饰线
- **Geometric**：六边形 + 姓名首字母，几何外框

## Risks / Trade-offs

- **CSS 变量数量膨胀** → 维护一份 `theme-variables.css` 作为主题变量定义中心
- **三种风格 SVG/CSS 复杂度高** → 使用 Framer Motion 统一动效曲线，避免每套重复
- **打印时主题样式残留** → 在 `@media print` 中统一使用无装饰的干净白底样式
- **bundle size 增加** → 三套风格通过 CSS 变量共享 JS，大小可控
- **Dark 主题打印黑底问题** → `@media print` 中强制白色背景 + 深色文字
- **主题切换动画时长** → CSS `transition: all 300ms ease-out` 统一过渡
- **localStorage 不可用** → 降级为 session-only，不报错

## Resolved Decisions

1. **主题切换器 UI**：三个文字按钮横向排列（精密 / 杂志 / 几何），当前风格高亮
2. **默认主题**：深色精密感作为默认主题
3. **Dark header 布局**：左对齐，参考 Linear 的左重设计
4. **Geometric 技能标签**：矩形药丸（细边框 + Space Mono），不使用六边形 clip-path
