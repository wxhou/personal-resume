# Homepage Theme Switching

## REMOVED Requirements

### Requirement: 首次访问跟随系统
用户未做过手动选择时，首页主题 SHALL 跟随系统 `prefers-color-scheme`；一旦手动切换即以 localStorage 记忆为准。

**Reason**: 产品决策——暗色为站点默认身份（用户反馈暗色观感优于亮色），首次访问不再随系统偏好摇摆。
**Migration**: FOUC 内联脚本 fallback 由系统偏好改为固定 `dark`；手动切换与 localStorage 持久化行为不变。

## ADDED Requirements

### Requirement: 默认暗色
首次访问且无本地记忆时，首页 SHALL 默认以暗色渲染；用户手动切换后仍以 localStorage 记忆为准。

#### Scenario: 首次访问默认暗色
- **WHEN** 用户首次访问（localStorage 无 siteTheme 记录，无论系统偏好为何）
- **THEN** 首页直接以暗色渲染，首帧即暗无闪烁

#### Scenario: 手动切换仍然有效
- **WHEN** 用户通过导航按钮切换到亮色
- **THEN** 选择写入 localStorage，后续访问保持亮色

### Requirement: 暗色粒子星云
暗色下 HeroSphere 粒子 SHALL 切换为加法混合（AdditiveBlending）并使用提亮色板（sage 约 `#96AC90`、brass 约 `#D48973`），呈现微光星云质感；亮色主题保持普通混合与原色板。

#### Scenario: 暗色下星云质感
- **WHEN** 主题为暗色时浏览 Hero
- **THEN** 粒子以加法混合渲染，重叠处产生微光叠加效果，粒子云呈星云质感而非平面撒点

#### Scenario: 亮色不受影响
- **WHEN** 切换回亮色
- **THEN** 粒子恢复普通混合与原色板（sage/brass），视觉与暗色增强上线前的亮色一致

### Requirement: 暗色氛围光
暗色下首页 Hero 区 SHALL 叠加一处深赭红径向光晕（accent 色、透明度约 0.08、椭圆分布），纯 CSS 实现不增加 DOM、不拦截交互。

#### Scenario: 氛围光可见
- **WHEN** 暗色下浏览 Hero
- **THEN** hero 区域可见微妙的暖赭红光晕提供纵深，文字可读性不受影响

#### Scenario: 亮色无氛围光
- **WHEN** 主题为亮色
- **THEN** 无氛围光层，页面视觉与此前一致

### Requirement: 暗色细节对比度增强
暗色下 SHALL 微调三处细节：点阵纹理透明度提升至约 0.07、`--text-soft` 提亮至对暗底 ≥4.5:1（约 `#8F867A`）、卡片光斑增强（accent 色透明度约 0.12）。

#### Scenario: 细节可感知
- **WHEN** 暗色下浏览页面
- **THEN** 点阵纹理隐约可辨、次要文字（数据行/SCROLL 等 soft 层）清晰可读、卡片光斑比增强前更明显

#### Scenario: 对比度达标
- **WHEN** 检查暗色下 text-soft 文本
- **THEN** 对暗底对比度 ≥4.5:1（WCAG AA）
