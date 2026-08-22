## ADDED Requirements

### Requirement: 简历页挂载
简历页 SHALL 挂载在 `/resume` 路径，内容与现有简历一致（个人信息、技能、工作经历、项目经验、教育背景、个人链接）。

#### Scenario: 访问简历页
- **WHEN** 用户访问 `/resume`
- **THEN** 完整渲染简历内容，与改造前一致

### Requirement: 主题切换保留
简历页 SHALL 保留 4 套主题切换功能（原始/精密/杂志/几何），切换即时生效并持久化到 localStorage。

#### Scenario: 切换主题
- **WHEN** 用户在简历页点击主题切换器中的任一主题
- **THEN** 页面主题立即切换，刷新后保持所选主题

### Requirement: 导出功能保留
简历页 SHALL 保留导出 PDF 与导出图片功能，导出内容与当前主题一致。

#### Scenario: 导出 PDF
- **WHEN** 用户点击「导出 PDF」按钮
- **THEN** 下载当前主题样式的 PDF 文件

#### Scenario: 导出图片
- **WHEN** 用户点击「导出图片」按钮
- **THEN** 下载当前主题样式的 PNG 图片

### Requirement: 打印适配保留
简历页 SHALL 保留打印样式适配，打印输出为干净的 A4 简历。

#### Scenario: 打印简历
- **WHEN** 用户在简历页触发打印（Ctrl/Cmd+P）
- **THEN** 打印预览为 A4 简历样式，主题切换器等界面元素不出现
