# Homepage Visual Alignment

## MODIFIED Requirements

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
