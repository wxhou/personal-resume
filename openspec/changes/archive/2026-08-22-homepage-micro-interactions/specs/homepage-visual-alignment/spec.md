# Homepage Visual Alignment

## ADDED Requirements

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
