## ADDED Requirements

### Requirement: 成就滚动条展示
首页 SHALL 在 Hero 下方展示成就滚动条（marquee），循环滚动展示真实成就数据。

#### Scenario: 滚动条展示成就
- **WHEN** 用户浏览首页 Hero 下缘
- **THEN** 看到循环滚动的成就条目（如「openspec-playwright GitHub ⭐8」「博客园 20 篇技术文章」等）

#### Scenario: 成就数据真实
- **WHEN** 检查成就滚动条内容
- **THEN** 所有条目均为真实可核验信息（对应 GitHub/博客园/在职经历），无虚构成就

### Requirement: 无缝循环滚动
滚动条 SHALL 无缝循环（内容不中断、不跳变），且 SHALL 在 `prefers-reduced-motion: reduce` 下停止动画仅静态展示。

#### Scenario: 无缝循环
- **WHEN** 滚动条动画运行
- **THEN** 内容首尾衔接循环，无空白间隙

#### Scenario: 减少动画偏好
- **WHEN** 用户系统开启「减少动态效果」
- **THEN** 滚动条停止动画，成就内容静态可读

### Requirement: 纯 CSS 实现
滚动动画 SHALL 用纯 CSS 实现（animation + 内容复制），无 JS 运行时依赖，SSG 静态 HTML 直接包含全部成就内容。

#### Scenario: SSG 输出可见
- **WHEN** 检查 SSG 构建产物首页 HTML
- **THEN** 成就文本在静态 HTML 中可见（爬虫可索引）
