## Context

探索阶段对国内六站（antfu.me / pseudoyu.com / diygod.cc / innei.in / timqian.com / weijunext.com）的实测截图与设计 token 已归档（`tmp/ref-cn-*.png`）。我们的动效层已达标，本次补质感层三项。现有可复用资产：`useGitHubStats`（构建值+客户端实时）、`featuredData`（6 精选 + 6 补充项目）、`blogPosts.length`、全站 token（米底 `--bg-page`、暖深字 `--text-strong: #34302A`、赭红 `--accent`）。

## Goals / Non-Goals

**Goals:**
- 点阵纸纹、身份徽章行、hero 数据行三项落地
- 全部复用现有数据源与 token，零新依赖、零外链图片

**Non-Goals:**
- 暗色模式（全站双套 token，工程量大，调研结论为缓）
- 霞鹜文楷换字体（会稀释现有衬线气质）
- 真人照片 / 幽默文案（需用户提供素材）
- 「开源 N 年」年限展示（无真实起始年份数据，见 Open Questions）

## Decisions

1. **点阵用单条 radial-gradient 平铺**（antfu 同款视觉）
   ```css
   .home-page {
     background-image: radial-gradient(rgba(52, 48, 42, 0.06) 1px, transparent 1px);
     background-size: 22px 22px;
   }
   ```
   - 加在 `.home-page` 根上（body 背景仍由 HomePage useEffect 控制为纯色）；marquee/卡片自带表面色自然覆盖，层次正确
   - 备选否决：SVG pattern data-uri（体积更大、无收益）；fixed 伪元素层（多一层合成）

2. **徽章 monogram 纯 CSS 生成**
   - GitHub 无稳定的按仓库图标 URL；用户头像全仓库相同无区分度；编造 favicon 外链违反数据纪律 → 用「项目名首字母小方块」：24px 圆角方块、三色板轮换（赭红/暖灰/米白描边），等宽字母
   - chip 结构：`<a class="home-idbadge" href={url}>[monogram] name</a>`，hover 边框/文字转 accent（与 .home-skill 同语言）
   - 数据：`featured` 6 个项目（name + url），label 行用现有 eyebrow 风格「CREATOR OF」

3. **数据行放 hero 底部 SCROLL 上方**
   - 结构：CTAs 之后、`.home-hero__scroll` 之前，一行 flex（gap 分隔 · 符号），JetBrains Mono、`--fs-small`、`--text-soft`
   - 值直接读 `githubStats.repos / githubStats.stars / blogPosts.length`——不做滚动动画（区别于 Proof 区，保持「一行安静的事实」），GitHub 更新后随 React 重渲染自动变化

4. **不引入 CountUp/Reveal 到新元素**
   - 徽章行随 Reveal 容器进场即可；数据行静态渲染——参考站 innei 的数据行也是静态小字，克制优先

## Risks / Trade-offs

- **[点阵对比度失衡]** → 0.06 起步，验证时若肉眼难辨调至 0.08、若干扰文字降回 0.04（Playwright 截图确认）
- **[徽章行挤占 hero 高度]** → hero 为 min-height 100svh 的 flex column，内容区有余量；chip 单行 flex-wrap，移动端换行不溢出（375px 断点验证）
- **[monogram 字母重复]**（如 gpt-image2-prompt 与 github 同首字母）→ 取 name 前 2 字符更稳（如 `op`/`gp`），实现时确定
- **[数据行与 Proof 卡信息重复]** → 有意为之：hero 是「一眼事实」，Proof 是「点击可查」，参考站 innei 同样两处都有

## Migration Plan

1. home.css：点阵背景（.home-page 一处）+ `.home-idbadge*` chip 样式 + `.home-hero__stats` 数据行样式
2. HomePage.jsx：hero 内插入徽章行（tagline 后）与数据行（scroll 提示前），纯 JSX 组装现有数据
3. 回撤边界：2 文件纯展示层改动

## Open Questions

- 「开源 N 年」需真实起始年份，暂不含在数据行；用户提供年份后可作为第四段加入
