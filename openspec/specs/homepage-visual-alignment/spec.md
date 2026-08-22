# Homepage Visual Alignment

## Purpose

Defines the homepage visual parameters aligned to the reference site jingjinglearns.cc — hero left-alignment, headline typography, intro typography, section spacing, project description typography, the SCROLL hint, the hero top decorative arc, and the hero particle system (three-morph Points, camera parallax, thin ring).

## Requirements

### Requirement: Hero 左对齐
首页 Hero 区块 SHALL 采用左对齐排版（textAlign: left），与参考站编辑式排版一致。

#### Scenario: Hero 内容左对齐
- **WHEN** 用户访问首页
- **THEN** Hero 内 eyebrow、大标题、简介、CTA 均左对齐展示

### Requirement: Hero 大标题字体与字号
首页 Hero 大标题 SHALL 使用 Noto Sans SC、字重 700、letter-spacing -0.03em；字号按响应式 clamp 收敛到 1.333 完美四度比例（顶部 ≤ 76px），行高约 1.06。不使用衬线字体。

#### Scenario: 桌面端大标题
- **WHEN** 用户在 1440px 宽度访问首页
- **THEN** 大标题使用 sans-serif 粗体（Noto Sans SC 700），letter-spacing -0.03em

#### Scenario: 窄屏自适应
- **WHEN** 用户在 375px 宽度访问首页
- **THEN** 大标题随 clamp 缩小，无横向溢出

### Requirement: Hero 简介正文排版
首页 Hero 简介正文 SHALL 使用正文 token 字号（var(--fs-body-lg)）、行高遵循 body 行高分层（var(--lh-body)）、文字色遵循正文色 token。

#### Scenario: 简介正文样式
- **WHEN** 用户浏览 Hero 简介
- **THEN** 简介字号、行高、文字色均由 token 控制，不硬编码 px 值

### Requirement: Hero 顶部装饰
首页 Hero 顶部 SHALL 展示一条 1px 水平的细弧线作为签名装饰元素，仅占 hero 顶部 ≤ 15% 高度，半透明赭红色（accent + alpha 衰减）。不展示大椭圆 SVG。

#### Scenario: 顶部装饰可见
- **WHEN** 用户访问首页
- **THEN** Hero 顶部可见一条细弧线装饰，不出现完整大椭圆

### Requirement: section 留白
首页各 section SHALL 使用 `120px 72px` 内边距、容器 `1280px`。

#### Scenario: section 留白
- **WHEN** 用户浏览首页 section
- **THEN** section 内边距为 120px 上下、72px 左右

### Requirement: 项目描述排版
首页项目卡片描述 SHALL 使用 14px 字号、26.6px 行高、`#6E665B` 文字色。

#### Scenario: 项目描述样式
- **WHEN** 用户浏览项目卡片描述
- **THEN** 描述字号 14px、行高 26.6px、色 `#6E665B`

### Requirement: SCROLL 滚动提示
首页 Hero 底部 SHALL 展示 `SCROLL` 滚动提示（含下箭头），提示用户向下浏览。

#### Scenario: 展示滚动提示
- **WHEN** 用户访问首页 Hero
- **THEN** Hero 底部显示 `SCROLL` 提示与下箭头

### Requirement: Hero 粒子系统（三形态 morph）
首页 Hero 背景 SHALL 渲染一个用 Three.js Points 实现的粒子系统，粒子在三种形态间循环 morph：散乱数据云（chaos）→ 结构化矩阵（matrix）→ 神经网络球（brain），循环往复。

#### Scenario: 形态循环
- **WHEN** 用户停留在首页 Hero 且未触发 reduced-motion
- **THEN** 粒子在每个形态停留约 4.2s 后，用约 2.2s 缓动过渡到下一形态；三种形态依次循环（chaos → matrix → brain → chaos）

#### Scenario: morph 为连续插值
- **WHEN** 粒子从形态 A 过渡到形态 B
- **THEN** 每个粒子的位置从 A 目标点按缓动函数平滑插值到 B 目标点，过渡期间不出现整体闪烁或瞬移

#### Scenario: 配色克制两色
- **WHEN** 粒子系统渲染
- **THEN** 粒子仅使用两种颜色——sage 与 brass（每 6 个粒子约 1 个 brass），不出现多色杂讯

#### Scenario: 慢节奏自转
- **WHEN** 粒子系统运行
- **THEN** 整体绕 Y 轴自转速度极慢（约每秒 0.06 rad），morph 为视觉主角而非快速旋转

#### Scenario: reduced-motion 不渲染
- **WHEN** 用户系统设置 prefers-reduced-motion: reduce
- **THEN** 粒子系统 canvas 不初始化、不渲染，页面其余内容正常

#### Scenario: 上下文安全（SSG）
- **WHEN** 站点通过 vite-react-ssg 预渲染
- **THEN** Three.js 初始化仅发生在客户端 useEffect 内，预渲染阶段不访问 WebGL

### Requirement: Hero 相机鼠标视差
首页 Hero 粒子系统 SHALL 响应鼠标移动，通过平滑跟随的相机位置偏移让整个场景随鼠标轻摆。

#### Scenario: 鼠标驱动相机偏移
- **WHEN** 用户在 Hero 区域移动鼠标
- **THEN** camera.position.x / y 经 lerp 平滑跟随鼠标归一化坐标（幅度约 ±1.6 / ±1.1），场景轻摆；鼠标静止后偏移稳定不抖动

#### Scenario: 非 hover 设备跳过
- **WHEN** 设备为触屏（hover: none）
- **THEN** 不监听 pointermove，相机保持静态

### Requirement: Hero 细环装饰
首页 Hero 粒子系统 SHALL 在粒子外缘叠加一个缓慢自转的细环（TorusGeometry，半径约 7.6、管径约 0.015、透明度约 0.3、brass 色）。

#### Scenario: 细环可见且缓慢自转
- **WHEN** 用户浏览首页 Hero
- **THEN** 可见一圈细环围绕粒子，并缓慢自转；环不喧宾夺主（透明度低）

### Requirement: 卡片光斑跟随
首页可交互卡片（精选项目卡、补充项目卡、成果卡、事实卡）SHALL 在鼠标悬停时展示跟随光标的径向光斑：pointermove 将光标相对卡片坐标写入 `--mx/--my`，`::after` 伪元素以 radial-gradient（半径约 240px、accent 色、低透明度约 0.08）在光标位置渲染光斑。

#### Scenario: 光斑随光标移动
- **WHEN** 用户在卡片内移动鼠标
- **THEN** 卡片的 `--mx/--my` 随光标实时更新，光斑跟随光标位置游走；移出卡片后光斑消失

#### Scenario: 触屏设备不启用
- **WHEN** 设备为触屏（hover: none）
- **THEN** 不监听卡片 pointermove，无光斑效果，卡片展示不受影响

#### Scenario: reduced-motion 降级
- **WHEN** 用户系统设置 prefers-reduced-motion: reduce
- **THEN** 光斑效果不出现，卡片保留静态样式

### Requirement: 磁吸按钮与点击迸发
首页 Hero 的 GitHub 主 CTA SHALL 具备磁吸效果：鼠标进入按钮周边约 100px 范围时按钮向光标方向位移约 30%，离开后回弹。全站自定义光标层 SHALL 在点击时于点击点生成约 10 个 accent 色小粒子向外飞散并衰减。

#### Scenario: 按钮磁吸
- **WHEN** 鼠标接近 GitHub CTA 约 100px 内
- **THEN** 按钮向光标方向轻微位移（约偏移量的 30%），离开范围后平滑回弹

#### Scenario: 点击迸发
- **WHEN** 用户点击页面任意处
- **THEN** 自定义光标画布在点击点生成约 10 个 accent 色小粒子，向外飞散并快速衰减消失

#### Scenario: 触屏与 reduced-motion 降级
- **WHEN** 设备为触屏（hover: none）或用户设置 prefers-reduced-motion: reduce
- **THEN** 磁吸与点击迸发均不启用，按钮为普通 hover 样式

### Requirement: 点阵纸纹背景
首页 SHALL 在米色底上叠加低对比度的点阵纹理（1px 暖深色圆点、约 22px 网格间距、透明度约 0.06），参考 antfu.me / pseudoyu.com 的 dotted grid，为纯色底提供「印刷纸」肌理。

#### Scenario: 点阵纹理可见
- **WHEN** 用户访问首页
- **THEN** 米色底上可见均匀分布的细小点阵，对比度低不干扰内容阅读；粒子 canvas 与卡片表面不受影响（点阵位于其下）

#### Scenario: 零布局影响
- **WHEN** 页面在任意断点渲染
- **THEN** 点阵为背景平铺实现，不产生额外 DOM、不引起布局偏移或滚动溢出

### Requirement: 身份徽章行
首页 Hero SHALL 展示「Creator of」身份徽章行：6 个精选项目以可点击 chip 形式排列（antfu.me / pseudoyu.com 同款模式），每个 chip 包含 monogram 字母方块（CSS 生成、色板轮换）与项目名，点击在新标签页打开对应 GitHub 仓库；数据来自现有 featuredProjects 数据。

#### Scenario: 徽章行展示与跳转
- **WHEN** 用户浏览 Hero
- **THEN** 可见「CREATOR OF」标签与 6 个项目 chip，点击任意 chip 在新标签页打开该项目的 GitHub 仓库

#### Scenario: chip 视觉与 hover
- **WHEN** 用户悬停项目 chip
- **THEN** chip 呈现与全站一致的 hover 反馈（边框/文字转赭红），monogram 方块按色板轮换区分项目

#### Scenario: 无外部图标依赖
- **WHEN** 页面离线或外部图片服务不可用
- **THEN** 徽章行完整展示（monogram 为 CSS 生成），无图片加载失败占位

### Requirement: Hero 实时数据行
首页 Hero 底部（SCROLL 提示上方）SHALL 展示一行等宽字体小字数据：GitHub 公开仓库数、openspec-playwright star 数、博客文章数，格式如 `104 仓库 · ⭐10 · 20 篇`；仓库数与 star 数复用现有 GitHub 实时数据（构建值打底 + 客户端刷新），文章数来自构建时博客数据。

#### Scenario: 数据行展示实时值
- **WHEN** 用户浏览 Hero
- **THEN** 数据行显示当前 GitHub 实时数据（与成果区卡片同源），等宽字体、低对比度、不喧宾夺主

#### Scenario: 降级一致
- **WHEN** GitHub API 不可用或被限流
- **THEN** 数据行显示构建时兜底值，与成果区卡片行为一致，无空白或报错