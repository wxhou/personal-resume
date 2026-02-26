# 侯伟轩 - 个人简历网站

一个精美的个人简历网站，采用 A4 纸张设计风格展示。

## 在线预览

访问 [https://wxhou.github.io/personal-resume](https://wxhou.github.io/personal-resume)

## 技术栈

- **React** - UI 框架
- **Vite** - 构建工具
- **Tailwind CSS** - 样式设计
- **Framer Motion** - 动画效果
- **Lucide React** - 图标库

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 部署到 GitHub Pages

项目已配置 GitHub Actions，推送代码后会自动部署。

### 首次部署步骤

```bash
# 1. 初始化 git（如果尚未初始化）
git init

# 2. 添加所有文件
git add .

# 3. 提交代码
git commit -m "feat: 初始化简历网站"

# 4. 创建 main 分支
git branch -M main

# 5. 添加远程仓库
git remote add origin https://github.com/wxhou/personal-resume.git

# 6. 推送到 GitHub
git push -u origin main
```

### 后续更新

修改代码后，直接推送即可自动部署：

```bash
git add .
git commit -m "feat: 更新内容"
git push
```

### 启用 GitHub Pages

推送代码后，进入仓库设置：
- Settings → Pages → Source 选择 **GitHub Actions**
- 或者等待 Actions 运行完成后自动启用

部署后访问：`https://wxhou.github.io/personal-resume/`

## 设计特点

- A4 纸张尺寸设计
- 活力橙红主题配色
- 卡片网格布局
- 入场动画效果
- 支持打印

## License

MIT
