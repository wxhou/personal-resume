## Why

当前简历设计缺乏视觉个性和艺术感，无法在众多候选人中脱颖而出。需要进行一次全面的视觉升级，将三种成熟的高级设计风格融合，打造一个有辨识度、有品味的简历页面。

## What Changes

- 全面重构简历视觉设计，融合三种风格：
  1. **深色精密感**：借鉴 Linear/Vercel 的克制美学
  2. **艺术杂志风**：参考 Pentagram 的编辑排版
  3. **几何艺术构成**：参考顶级建筑事务所作品集风格
- 保留所有内容数据不变，仅优化视觉呈现
- 确保导出 PDF/图片的功能不受影响
- 支持打印适配

## Capabilities

### New Capabilities

- `resume-visual-system`: 建立简历视觉设计系统（配色、字体、空间、动效）
- `resume-dark-style`: 深色精密感主题
- `resume-editorial-style`: 艺术杂志编辑风主题
- `resume-geometric-style`: 几何艺术构成主题
- `resume-style-switcher`: 主题切换器，让用户在不同风格间切换预览

### Modified Capabilities

（无，现有简历内容结构保持不变）

## Impact

- `src/App.jsx` — 重构主组件，主题切换逻辑
- `src/index.css` — 全新的 CSS 设计系统
- `tailwind.config.js` — 更新配色和字体配置
- 无 API 变更，无依赖变更
