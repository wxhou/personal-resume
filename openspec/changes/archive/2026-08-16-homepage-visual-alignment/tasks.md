## 1. Hero 视觉对齐

- [x] 1.1 `src/pages/home.css`：`.home-hero` 改为左对齐（text-align: left）、padding `90px 72px 0`、max-width `1280px`
- [x] 1.2 `src/pages/home.css`：`.home-hero__name` 字号改为 `clamp(2.8rem, 7.5vw, 6.75rem)`、行高 1.06
- [x] 1.3 `src/pages/home.css`：`.home-hero__tagline` 改为 17px/34px、色 `#6E665B`
- [x] 1.4 `src/pages/HomePage.jsx`：Hero 底部新增 `.home-hero__scroll`（SCROLL + 下箭头）
- [x] 1.5 `src/pages/home.css`：新增 `.home-hero__scroll` 样式

## 2. 全局排版对齐

- [x] 2.1 `src/pages/home.css`：`.home-section` 内边距改为 `120px 72px`
- [x] 2.2 `src/pages/home.css`：`.home-project__desc` 改为 14px/26.6px、色 `#6E665B`

## 3. 验证

- [x] 3.1 浏览器实测：H1 108px/左对齐、tagline 17px/34px、section 120px 72px、项目描述 14px/26.6px
- [x] 3.2 浏览器实测：375px 无横向溢出、无控制台错误
