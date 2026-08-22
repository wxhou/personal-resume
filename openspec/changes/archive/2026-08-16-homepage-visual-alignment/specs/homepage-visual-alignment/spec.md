## ADDED Requirements

### Requirement: Hero 左对齐
首页 Hero 区块 SHALL 采用左对齐排版（textAlign: left），与参考站编辑式排版一致。

#### Scenario: Hero 内容左对齐
- **WHEN** 用户访问首页
- **THEN** Hero 内 eyebrow、大标题、简介、状态条、CTA 均左对齐展示

### Requirement: Hero 大标题字号
首页 Hero 大标题 SHALL 使用响应式字号，桌面端（1440px）实测约 108px，行高约 1.06。

#### Scenario: 桌面端大标题
- **WHEN** 用户在 1440px 宽度访问首页
- **THEN** 大标题字号约 108px、行高约 1.06

#### Scenario: 窄屏自适应
- **WHEN** 用户在 375px 宽度访问首页
- **THEN** 大标题随 clamp 缩小，无横向溢出

### Requirement: Hero 简介正文排版
首页 Hero 简介正文 SHALL 使用 17px 字号、34px 行高、`#6E665B` 文字色。

#### Scenario: 简介正文样式
- **WHEN** 用户浏览 Hero 简介
- **THEN** 简介字号 17px、行高 34px、色 `#6E665B`

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
