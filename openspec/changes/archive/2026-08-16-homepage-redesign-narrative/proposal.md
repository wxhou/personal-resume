## Why

现有首页是五区块纵向堆叠（Hero/技能栈/项目/博客/找到我），功能完整但缺乏叙事感和记忆点——访客滚完记不住「他是谁」。参考 jingjinglearns.cc 的单页滚动叙事结构（用户明确要求照搬该网站设计），将首页升级为有个人品牌感的作品集式页面，强化「被发现、展示价值」的核心目标。

## What Changes

- **首页改单页长滚动 + 锚点导航**：`#projects`（项目）`#proof`（成果）`#blog`（博客）`#about`（关于）`#contact`（联系），导航链接滚动定位
- **Hero 升级**：大字定位语（候选见 design）+ 副标题一句话 + 状态条（求职中 · 西安 · AI 应用工程师）+ 双 CTA（查看项目 / 查看简历）
- **新增成就滚动条（marquee）**：Hero 下方循环滚动的真实成就（GitHub openspec-playwright ⭐8、博客园 20 篇技术文章、测试开发 → 项目经理 → AI 应用工程师转型、8 年工程经验）
- **项目卡片升级**：编号（01/02…）+ 标签（开源工具/实验项目）+ 技术栈 chips；精选（6 个）与补充（其余 GitHub 项目）分层展示
- **新增成果区（#proof）**：无获奖证书类素材，用真实可核验数据卡片替代——GitHub 活跃记录、博客园文章数、开源项目 star、AI 技能认证类信息
- **新增「三个事实」About 区**：FACT 01/02/03 短句式自我介绍（基于真实经历起草）
- **联系区升级**：微信二维码占位（用户后续提供图片）+ 现有 GitHub/Gitee/博客园/邮箱链接
- **不照搬**：证据墙（无素材，用真实数据卡片替代）、实验室（无互动内容，跳过）
- `/resume` 简历页保持不变

## Capabilities

### New Capabilities

- `homepage-scroll-narrative`: 单页滚动结构与锚点导航（section 划分、锚点定位、导航联动）
- `homepage-marquee`: 成就滚动条（真实数据循环滚动展示）
- `homepage-proof-section`: 成果区（真实可核验数据卡片）

### Modified Capabilities

- `homepage`: Hero 升级（定位语/状态条/双 CTA）、项目卡片升级（编号/标签/技术栈/分层）、联系区升级（微信二维码占位）、新增 About 三事实——现有 spec 的对应 requirements 全部更新

## Impact

- `src/pages/HomePage.jsx` — 重写为单页滚动结构
- `src/pages/home.css` — 重写首页样式（marquee、编号卡片、锚点导航联动）
- `src/components/SiteNav.jsx` — 首页态导航加锚点链接（简历页态不变）
- `src/data/` — featuredProjects.json 扩展字段（标签/补充项目层）；新增 achievements 数据
- 无路由变更（/ 与 /resume 不变）、无构建/部署变更、无 API 变更
