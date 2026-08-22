## Why

首页已按 jingjinglearns.cc 的单页滚动叙事结构改版，但视觉参数（Hero 对齐、大标题字号、section 留白、正文字号）仍与参考站实测值有差距，导致整体观感「形似神不似」。本次将首页视觉参数对齐参考站实测指标，拉近观感差距。

## What Changes

- **Hero 左对齐**：从居中改为左对齐（参考站 textAlign: start），匹配编辑式排版
- **Hero 大标题加大**：`clamp(2.6rem, 7.4vw, 6.1rem)` → `clamp(2.8rem, 7.5vw, 6.75rem)`（实测 108px @1440w），行高 1.06
- **Hero 加宽**：`max-width 880px` → `1280px`，padding `104px 24px 72px` → `90px 72px 0`
- **简介正文对齐**：tagline `15.68px/28px` → `17px/34px`，颜色 `#6E665B`
- **新增 SCROLL 提示**：Hero 底部加滚动引导（参考站同款）
- **section 留白对齐**：`120px 48px` → `120px 72px`
- **项目描述字号对齐**：`15px` → `14px/26.6px`，颜色 `#6E665B`

## Capabilities

### New Capabilities

- `homepage-visual-alignment`: 首页视觉参数对齐参考站（Hero 对齐/字号/留白/正文排版）

### Modified Capabilities

（无，均为首页视觉实现细节，不改变既有 spec 的行为契约）

## Impact

- `src/pages/HomePage.jsx` — Hero 新增 SCROLL 提示
- `src/pages/home.css` — Hero 对齐/字号/留白、section 留白、项目描述字号
- 无路由/构建/部署/API 变更
