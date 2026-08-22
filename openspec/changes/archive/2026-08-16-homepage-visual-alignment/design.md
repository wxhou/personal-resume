## Context

首页已按 jingjinglearns.cc 单页滚动叙事结构改版（change `homepage-redesign-narrative` 已归档）。但视觉参数仍与参考站实测值有差距：Hero 居中 vs 参考站左对齐、大标题 97.6px vs 108px、section 留白 48px vs 72px、正文 15.68px vs 17px。本次纯视觉参数对齐，不改结构、不改数据、不改路由。

参考站实测值（Playwright 提取）：
- Hero：textAlign `start`、padding `90px 72px 0`、H1 `108px`/行高 `114px`/字重 600
- 简介正文：`17px`/行高 `34px`/色 `rgb(110,102,91)`
- section：padding `120px 72px`、容器 `1280px`
- 项目卡片：padding `34px 32px`、圆角 `18px`、白底；标题 `22px`/600；描述 `14px`/行高 `26.6px`

## Goals / Non-Goals

**Goals:**
- Hero 从居中改为左对齐，匹配参考站编辑式排版
- 大标题加大到 108px 量级，行高 1.06
- Hero 加宽到 1280px、padding `90px 72px 0`
- 简介正文对齐 17px/34px、色 `#6E665B`
- section 留白对齐 `120px 72px`
- 项目描述对齐 14px/26.6px、色 `#6E665B`
- 新增 SCROLL 滚动提示

**Non-Goals:**
- 不改首页结构、数据、路由、构建、部署
- 不改简历页
- 不新增图片素材（项目/成果区真实图片需用户另行提供）

## Decisions

### D1: Hero 左对齐
- **选择**：`.home-hero` 从 `text-align: center` 改为 `left`，padding `104px 24px 72px` → `90px 72px 0`，`max-width 880px` → `1280px`
- **理由**：参考站 Hero 为左对齐编辑排版（实测 textAlign: start），居中与参考站观感差异最大
- **备选**：保持居中——但无法拉近参考站观感，弃

### D2: 大标题字号
- **选择**：`clamp(2.6rem, 7.4vw, 6.1rem)` → `clamp(2.8rem, 7.5vw, 6.75rem)`（max 108px），行高 `1.12` → `1.06`
- **理由**：参考站 H1 实测 108px/行高 114px，clamp 上限对齐 108px，行高对齐 1.06
- **备选**：固定 108px——但会失去响应式缩放，弃

### D3: 简介正文与项目描述字号
- **选择**：tagline `15.68px/28px` → `17px/34px`、色 `#6E665B`；项目描述 `15px` → `14px/26.6px`、色 `#6E665B`
- **理由**：参考站正文实测 17px/34px、项目描述 14px/26.6px，色 `rgb(110,102,91)` = `#6E665B`

### D4: SCROLL 提示
- **选择**：Hero 底部新增 `.home-hero__scroll`（`SCROLL` + 下箭头），`aria-hidden`
- **理由**：参考站 Hero 底部有滚动引导，增强叙事感

## Risks / Trade-offs

- [Hero 左对齐后背景光斑位置可能不协调] → 光斑为装饰性绝对定位，左对齐后视觉仍可接受；浏览器实测确认无溢出
- [大标题加大在窄屏溢出] → 用 clamp 响应式缩放，375px 下自动缩小；实测确认无横向溢出
- [SCROLL 提示在 reduced-motion 下无意义] → 纯静态文本，无动画依赖，无需降级

## Migration Plan

1. 修改 `src/pages/home.css`（Hero 对齐/字号/留白、section 留白、项目描述字号）
2. 修改 `src/pages/HomePage.jsx`（新增 SCROLL 提示）
3. 浏览器实测：H1 108px/左对齐、tagline 17px/34px、section 120px 72px、无横向溢出、无控制台错误

回滚：单 commit 视觉改动，revert 即恢复。
