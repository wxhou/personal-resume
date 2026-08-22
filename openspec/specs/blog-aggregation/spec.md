# Blog Aggregation

## Purpose

Defines the build-time aggregation of blog posts from the cnblogs RSS feed, covering the pre-build script that fetches and parses the feed into `src/data/blog.json`, the required data fields, and post ordering.

## Requirements

### Requirement: 构建时 RSS 聚合
构建流程 SHALL 在 `vite build` 前运行脚本拉取博客园 RSS（`https://www.cnblogs.com/wxhou/rss`），解析文章列表并生成 `src/data/blog.json`（含标题、链接、发布日期、摘要）。

#### Scenario: 构建生成博客数据
- **WHEN** 执行 `npm run build`
- **THEN** 构建脚本拉取 RSS 并生成包含文章列表的 `blog.json`

#### Scenario: RSS 拉取失败
- **WHEN** 构建时 RSS 拉取失败（网络错误或格式变化）
- **THEN** 构建不失败，`blog.json` 为空数组

### Requirement: 文章数据字段
`blog.json` 中每篇文章 SHALL 包含标题（title）、原文链接（link）、发布日期（pubDate）、摘要（summary）字段。

#### Scenario: 数据字段完整
- **WHEN** 检查生成的 `blog.json`
- **THEN** 每篇文章均包含 title、link、pubDate、summary 四个字段

### Requirement: 文章排序
博客文章列表 SHALL 按发布日期倒序排列，最新文章在前。

#### Scenario: 排序正确
- **WHEN** 检查 `blog.json` 中的文章顺序
- **THEN** 文章按发布日期从新到旧排列
