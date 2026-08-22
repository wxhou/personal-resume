import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate, useReducedMotion } from 'framer-motion'
import { Head } from 'vite-react-ssg'
import '@fontsource/noto-serif-sc/400.css'
import '@fontsource/noto-serif-sc/600.css'
import '@fontsource/noto-serif-sc/700.css'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/500.css'
import '@fontsource/noto-sans-sc/700.css'
import { ArrowRight, ArrowDown, ExternalLink, Github, Mail, Rss, Star, FileText, FolderGit2 } from 'lucide-react'
import { personalInfo, skills, personalLinks } from '../data/resume.js'
import featuredData from '../data/featuredProjects.json'
import { facts, heroStatement } from '../data/facts.js'
import ScrollProgress from '../components/ScrollProgress.jsx'
import HeroSphere from '../components/HeroSphere.jsx'
import FxCursor from '../components/FxCursor.jsx'
import { HOME_THEME_TOGGLE_EVENT, THEME_STORAGE_KEY } from '../lib/homeTheme.js'
import './home.css'

// blog.json 为构建时生成（.gitignore），用 glob 容错加载
const dataFiles = import.meta.glob('../data/blog.json', { eager: true })
const blogPosts = dataFiles['../data/blog.json']?.default ?? []

// github-stats.json 为构建时生成（.gitignore），客户端 mount 后再刷新真·实时
// 兜底值来源：2026-08-22 gh api 实测（stars=10, public_repos=104）
const ghStatFiles = import.meta.glob('../data/github-stats.json', { eager: true })
const initialGhStats = ghStatFiles['../data/github-stats.json']?.default ?? { stars: 10, repos: 104 }

// GitHub 公开数据实时刷新：构建值为初始，mount 后拉 GitHub REST API 覆盖
// API 来源: https://docs.github.com/en/rest/repos/repos · /rest/users/users（未认证 60 req/h/IP）
// sessionStorage 缓存 10 分钟防限流；全部失败时静默保留构建值
function useGitHubStats(initial) {
  const [stats, setStats] = useState(initial)
  const statsRef = useRef(initial)
  statsRef.current = stats

  useEffect(() => {
    const CACHE_KEY = 'gh-stats-v1'
    const TTL = 10 * 60 * 1000
    let cancelled = false

    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null')
      if (cached && Date.now() - cached.t < TTL && cached.stats) {
        setStats(cached.stats)
        return () => { cancelled = true }
      }
    } catch { /* sessionStorage 不可用时直接请求 */ }

    Promise.allSettled([
      fetch('https://api.github.com/repos/wxhou/openspec-playwright').then(r => (r.ok ? r.json() : null)),
      fetch('https://api.github.com/users/wxhou').then(r => (r.ok ? r.json() : null)),
    ]).then(([repo, user]) => {
      if (cancelled) return
      const stars = repo.status === 'fulfilled' ? repo.value?.stargazers_count : null
      const repos = user.status === 'fulfilled' ? user.value?.public_repos : null
      if (stars == null && repos == null) return // 全部失败保留构建值
      const prev = statsRef.current
      const next = { stars: stars ?? prev.stars, repos: repos ?? prev.repos }
      setStats(next)
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), stats: next })) } catch { /* 忽略 */ }
    })
    return () => { cancelled = true }
  }, [])

  return stats
}

const { featured, more } = featuredData

// 进场用更短的位移 + 弹簧（避免全站对称 fade-up 的"AI 指纹"）
const heroEnter = {
  hidden: { opacity: 0, y: 8 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  })
}

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 字符拼合：标题字符从两侧汇聚成词（Stefan Vitasović 签名动效，一次性）
// 用 spring 而非对称 bezier——避免"AI 指纹"
function SplitChars({ text, className, delay = 0, stagger = 0.045 }) {
  const mid = Math.floor(text.length / 2)
  return (
    <span className={className} aria-label={text} role="text">
      {text.split('').map((ch, i) => {
        const fromLeft = i < mid
        const dist = fromLeft ? mid - i : i - mid + 1
        return (
          <motion.span
            key={i}
            aria-hidden="true"
            className="split-char"
            initial={{ opacity: 0, x: fromLeft ? -dist * 14 : dist * 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: delay + i * stagger,
              type: 'spring',
              stiffness: 320,
              damping: 28,
              mass: 0.7,
            }}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {ch}
          </motion.span>
        )
      })}
    </span>
  )
}

// 区块标题：滚动进场时字符错峰（InView 一次性触发）
// 区块标题：滚动进场时字符错峰（InView 一次性触发）
function SectionTitle({ text }) {
  return (
    <h2 className="home-section__title">
      <SplitChars text={text} stagger={0.04} />
    </h2>
  )
}

// 区块头：eyebrow + 字符级标题 + 编号 + 注释（滚动进场）
function SectionHeader({ index, label, title, note }) {
  return (
    <div className="home-section__head">
      <div>
        <span className="home-section__eyebrow">{label} / {index}</span>
        <SectionTitle text={title} />
      </div>
      <span className="home-section__index" aria-hidden="true">{index}</span>
      {note && <p className="home-section__note">{note}</p>}
    </div>
  )
}

// 滚动进场容器：进入视口时淡入上浮（一次性，弹簧而非对称 fade-up）
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
    >
      {children}
    </motion.div>
  )
}

// 数字滚动进场（参考站 lab-panel 同款）：进入视口后从 0 滚到目标值，1.1s easeInOut
// prefix/suffix 显式传参（如 ⭐ / + / 篇），不做字符串猜测解析
// value 运行时更新（GitHub 实时刷新）时从当前显示值平滑滚到新目标，不从 0 重滚
// reduced-motion 直接渲染最终值
function CountUp({ value, prefix = '', suffix = '', delay = 0 }) {
  const ref = useRef(null)
  const currentRef = useRef(0) // 当前显示值，value 变化时的滚动起点
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduced = useReducedMotion()
  const finalText = `${prefix}${value}${suffix}`

  useEffect(() => {
    if (!inView || !ref.current) return
    if (reduced) {
      currentRef.current = value
      ref.current.textContent = finalText
      return
    }
    const controls = animate(currentRef.current, value, {
      duration: 1.1,
      delay,
      ease: 'easeInOut',
      onUpdate: (v) => {
        const n = Math.round(v)
        currentRef.current = n
        if (ref.current) ref.current.textContent = `${prefix}${n}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, reduced, value, prefix, suffix, delay])

  return <span ref={ref}>{reduced ? finalText : `${prefix}0${suffix}`}</span>
}

export default function HomePage() {
  // GitHub 数据：构建值打底，客户端实时刷新
  const githubStats = useGitHubStats(initialGhStats)

  // 明暗主题：FOUC 内联脚本已在首帧前把 data-theme 写到 <html>，这里读取并接管。
  // 归一化防御：/resume 的 style-switcher 会把 html data-theme 改成 "original" 等
  // 自有值，SPA 返回首页时以合法值优先、localStorage 记忆兜底
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'light'
    const t = document.documentElement.dataset.theme
    if (t === 'dark' || t === 'light') return t
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      if (saved === 'dark' || saved === 'light') return saved
    } catch { /* 忽略 */ }
    return 'dark' // 默认暗色（站点身份，不随系统偏好）
  })

  // SiteNav 的 toggle 按钮经自定义事件桥接（两者无父子数据流）
  useEffect(() => {
    const onToggle = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    window.addEventListener(HOME_THEME_TOGGLE_EVENT, onToggle)
    return () => window.removeEventListener(HOME_THEME_TOGGLE_EVENT, onToggle)
  }, [])

  // theme 变化：同步 <html> data-theme + localStorage 持久化
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem(THEME_STORAGE_KEY, theme) } catch { /* 隐私模式等场景忽略 */ }
  }, [theme])

  // 首页强制暖底（亮 #FBF7F1 / 暗 #211D18），离开首页恢复
  useEffect(() => {
    document.body.style.background = theme === 'dark' ? '#211D18' : '#FBF7F1'
    return () => { document.body.style.background = '' }
  }, [theme])

  // 卡片光斑跟随：pointermove 写 --mx/--my，enter/leave 切 is-glowing（参考站 .card 同款）
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noHover = window.matchMedia('(hover: none)').matches
    if (reduced || noHover) return
    const cards = document.querySelectorAll('.home-project, .home-more__item, .home-proof__card, .home-fact')
    const onMove = (e) => {
      const r = e.currentTarget.getBoundingClientRect()
      e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
      e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    const onEnter = (e) => e.currentTarget.classList.add('is-glowing')
    const onLeave = (e) => e.currentTarget.classList.remove('is-glowing')
    cards.forEach((card) => {
      card.addEventListener('pointermove', onMove)
      card.addEventListener('pointerenter', onEnter)
      card.addEventListener('pointerleave', onLeave)
    })
    return () => {
      cards.forEach((card) => {
        card.removeEventListener('pointermove', onMove)
        card.removeEventListener('pointerenter', onEnter)
        card.removeEventListener('pointerleave', onLeave)
      })
    }
  }, [])

  // 首屏滚动视差（参考站同款）：内容 y*0.18 渐隐、粒子层 y*0.08、SCROLL 提示 y>60 淡出，rAF 合帧
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const heroInner = document.querySelector('.home-hero__inner')
    const heroBg = document.querySelector('.home-hero__bg')
    const scrollHint = document.querySelector('.home-hero__scroll')
    if (!heroInner) return
    let tick = false
    const onScroll = () => {
      if (tick) return
      tick = true
      requestAnimationFrame(() => {
        tick = false
        const y = window.scrollY
        const vh = window.innerHeight
        if (scrollHint) scrollHint.style.opacity = y > 60 ? 0 : 1
        if (y > vh) return // 超出首屏跳过无效计算
        heroInner.style.transform = `translateY(${(y * 0.18).toFixed(1)}px)`
        heroInner.style.opacity = String(Math.max(0, 1 - y / (vh * 0.85)))
        if (heroBg) heroBg.style.transform = `translateY(${(y * 0.08).toFixed(1)}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 磁吸按钮：鼠标进入 CTA 周边 100px 时向光标位移 30%，离开回弹
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noHover = window.matchMedia('(hover: none)').matches
    if (reduced || noHover) return
    const zone = document.querySelector('.home-hero__ctas')
    const btn = zone?.querySelector('.home-hero__cta')
    if (!btn) return
    const RADIUS = 100
    const PULL = 0.3
    const onMove = (e) => {
      const r = btn.getBoundingClientRect()
      const near =
        e.clientX > r.left - RADIUS && e.clientX < r.right + RADIUS &&
        e.clientY > r.top - RADIUS && e.clientY < r.bottom + RADIUS
      if (near) {
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        btn.classList.add('is-magnet')
        btn.style.transform = `translate(${(e.clientX - cx) * PULL}px, ${(e.clientY - cy) * PULL}px)`
      } else if (btn.style.transform) {
        btn.classList.remove('is-magnet') // 回落到 300ms transition，形成回弹
        btn.style.removeProperty('transform')
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      btn.classList.remove('is-magnet')
      btn.style.removeProperty('transform')
    }
  }, [])

  return (
    <div className="home-page fx-cursor">
      <Head>
        <title>Bigger蓝莓 - AI应用工程师</title>
        <meta name="description" content="Bigger蓝莓的个人主页：AI应用工程师，专注 AI 应用开发（LangChain、RAG、Dify、AI Agent），分享开源项目与技术文章。" />
        <meta property="og:title" content="Bigger蓝莓 - AI应用工程师" />
        <meta property="og:description" content="AI应用工程师，专注 AI 应用开发（LangChain、RAG、Dify、AI Agent），分享开源项目与技术文章。" />
        <meta property="og:image" content="https://wxhou.vercel.app/og-image.png" />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://wxhou.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* ─── 滚动进度条 ─── */}
      <ScrollProgress />

      {/* ─── 自定义光标 ─── */}
      <FxCursor />

      {/* ─── Hero ─── */}
      <motion.section className="home-hero" variants={heroEnter} initial="hidden" animate="visible" custom={0}>
        {/* 椭圆描边（参考站 signature 元素，横跨 hero 顶部） */}
        <svg
          className="home-hero__ellipse"
          viewBox="0 0 1400 420"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <ellipse
            cx="700"
            cy="210"
            rx="680"
            ry="170"
            fill="none"
            stroke="#B86B5D"
            strokeWidth="1"
            strokeOpacity="0.35"
          />
        </svg>
        {/* 金尘粒子（暖色三色：森林 / 赭土 / 米雾），压在椭圆之下内容之下 */}
        <div className="home-hero__bg" aria-hidden="true">
          <HeroSphere dark={theme === 'dark'} />
        </div>

        {/* 控制台面板：GitHub 开源读数（签名元素） */}
        <div className="home-hero__console" aria-hidden="true">
          <div className="home-hero__console-line">
            <span className="home-hero__console-prompt">$</span>
            <span className="home-hero__console-key">github</span>
          </div>
          <div className="home-hero__console-line">
            <span className="home-hero__console-val">@wxhou</span>
          </div>
          <div className="home-hero__console-line">
            <span className="home-hero__console-prompt">$</span>
            <span className="home-hero__console-key">repos</span>
          </div>
          <div className="home-hero__console-line">
            <span className="home-hero__console-val">{githubStats.repos}+ public</span>
          </div>
          <div className="home-hero__console-line">
            <span className="home-hero__console-prompt">$</span>
            <span className="home-hero__console-key">stack</span>
          </div>
          <div className="home-hero__console-line">
            <span className="home-hero__console-val">LangChain · RAG · Dify · Agent</span>
          </div>
          <div className="home-hero__console-line">
            <span className="home-hero__console-prompt">$</span>
            <span className="home-hero__console-key">focus</span>
          </div>
          <div className="home-hero__console-line">
            <span className="home-hero__console-val">open source · AI tools</span>
          </div>
          <div className="home-hero__console-line">
            <span className="home-hero__console-prompt">$</span>
            <span className="home-hero__console-cursor" />
          </div>
        </div>

        {/* Hero 内容包装层：滚动视差 transform/opacity 的承载者 */}
        <div className="home-hero__inner">
        <span className="home-hero__eyebrow">AI APPLICATION ENGINEER · AI 编程落地</span>
        <h1 className="home-hero__name">
          <SplitChars text={heroStatement.headline.slice(0, -2)} stagger={0.07} />
          <motion.em
            className="split-char"
            aria-hidden="true"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 * (heroStatement.headline.length - 2), duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {heroStatement.headline.slice(-2)}
          </motion.em>
        </h1>
        <p className="home-hero__subtitle">{heroStatement.subtitle}</p>
        <p className="home-hero__tagline">{heroStatement.tagline}</p>
        {/* 身份徽章行：Creator of + 精选项目 chip（antfu/pseudoyu 同款） */}
        <div className="home-idbadge-row">
          <span className="home-idbadge-row__label">Creator of</span>
          {featured.map(project => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="home-idbadge"
            >
              <span className="home-idbadge__mono" aria-hidden="true">{project.name.slice(0, 2)}</span>
              {project.name}
            </a>
          ))}
        </div>
        <div className="home-hero__ctas">
          <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="home-hero__cta">
            <Github size={16} />
            GitHub @wxhou
            <ArrowRight size={16} />
          </a>
        </div>
        {/* Hero 实时数据行：与成果区同源的 GitHub 实时数据（innei 同款克制小字） */}
        <div className="home-hero__stats" aria-label="GitHub 与博客数据">
          <span><b>{githubStats.repos}</b> 仓库</span>
          <span className="home-hero__stats-sep">·</span>
          <span><Star size={13} className="star-icon" /><b>{githubStats.stars}</b></span>
          <span className="home-hero__stats-sep">·</span>
          <span><b>{blogPosts.length}</b> 篇</span>
        </div>
        <div className="home-hero__scroll" aria-hidden="true">
          SCROLL
          <ArrowDown size={14} />
        </div>
        </div>
      </motion.section>

      {/* ─── 技能栈 ─── */}
      <section className="home-section">
        <SectionHeader index="00" label="SKILLS" title="技能栈" />
        <Reveal>
        {[
          { label: 'AI 技能', key: 'ai' },
          { label: '后端开发', key: 'backend' },
          { label: '自动化测试', key: 'automation' },
        ].map(group => (
          <div key={group.key} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '0.8rem', color: '#A8A29E', marginBottom: 8 }}>{group.label}</div>
            <div className="home-skills">
              {skills[group.key].map(s => (
                <span key={s} className="home-skill">{s}</span>
              ))}
            </div>
          </div>
        ))}
        </Reveal>
      </section>

      {/* ─── 精选项目 ─── */}
      <section id="projects" className="home-section">
        <SectionHeader index="01" label="SELECTED WORK" title="做过的东西" note="6 个精选开源项目：测试代理、AI 工具与实验作品。" />
        <Reveal>
        <div className="home-projects">
          {featured.map((project, i) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="home-project"
            >
              <div className="home-project__head">
                <span className="home-project__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="home-project__tag">{project.tag}</span>
              </div>
              <div className="home-project__name">{project.name}</div>
              <div className="home-project__desc">{project.description}</div>
              <div className="home-project__tech">
                {project.tech.map(t => (
                  <span key={t} className="home-project__chip">{t}</span>
                ))}
              </div>
              <span className="home-project__link">
                GitHub
                <ExternalLink size={12} />
              </span>
            </a>
          ))}
        </div>
        </Reveal>

        {/* ─── 补充项目 ─── */}
        <Reveal delay={0.1}>
        <div className="home-more">
          <div className="home-more__label">MORE WORK · 还折腾过这些</div>
          <div className="home-more__grid">
            {more.map(project => (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="home-more__item"
              >
                <span className="home-more__name">{project.name}</span>
                <span className="home-more__desc">{project.description}</span>
              </a>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      {/* ─── 成果 ─── */}
      <section id="proof" className="home-section">
        <SectionHeader index="02" label="PROOF" title="看得见的成果" note="GitHub 仓库、star 数与博客园记录。" />
        <Reveal>
        <div className="home-proof">
          <a className="home-proof__card" href={personalInfo.github} target="_blank" rel="noopener noreferrer">
            <FolderGit2 size={22} className="home-proof__icon" />
            <span className="home-proof__value"><CountUp value={githubStats.repos} suffix="+" /></span>
            <span className="home-proof__label">GitHub 公开仓库</span>
          </a>
          <a className="home-proof__card" href="https://github.com/wxhou/openspec-playwright" target="_blank" rel="noopener noreferrer">
            <Star size={22} className="home-proof__icon" />
            <span className="home-proof__value"><CountUp value={githubStats.stars} delay={0.09} /></span>
            <span className="home-proof__label">openspec-playwright 开源 star</span>
          </a>
          <a className="home-proof__card" href="https://www.cnblogs.com/wxhou" target="_blank" rel="noopener noreferrer">
            <FileText size={22} className="home-proof__icon" />
            <span className="home-proof__value"><CountUp value={20} suffix=" 篇" delay={0.18} /></span>
            <span className="home-proof__label">博客园技术文章</span>
          </a>
        </div>
        </Reveal>
      </section>

      {/* ─── About 事实卡 ─── */}
      <section id="about" className="home-section">
        <SectionHeader index="03" label="ABOUT" title="两个事实" note="GitHub 开源创作的两条主线。" />
        <Reveal>
        <div className="home-facts">
          {facts.map(fact => (
            <div key={fact.id} className="home-fact">
              <span className="home-fact__id">{fact.id}</span>
              <h3 className="home-fact__title">{fact.title}</h3>
              <p className="home-fact__desc">{fact.description}</p>
            </div>
          ))}
        </div>
        </Reveal>
      </section>

      {/* ─── 最新博客 ─── */}
      {blogPosts.length > 0 && (
        <section id="blog" className="home-section">
          <SectionHeader index="04" label="WRITING" title="最新博客" note="博客园持续输出的技术文章。" />
          <Reveal>
          <div className="home-blog">
            {blogPosts.slice(0, 5).map(post => (
              <a
                key={post.link}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="home-post"
              >
                <span className="home-post__date">{formatDate(post.pubDate)}</span>
                <span className="home-post__title">{post.title}</span>
              </a>
            ))}
          </div>
          </Reveal>
        </section>
      )}

      {/* ─── 联系 ─── */}
      <section id="contact" className="home-section">
        <SectionHeader index="05" label="CONTACT" title="想聊点什么？" note="技术交流 · 开源协作 · 项目合作，欢迎联系。" />
        <Reveal>
        <div className="home-contact">
          <div className="home-contact__qr">
            <a href="/qq-group-qr.png" target="_blank" rel="noopener noreferrer" aria-label="放大 QQ 群二维码">
              <img
                src="/qq-group-qr.png"
                alt="QQ 群「AI agent 学习交流」入群二维码"
                width={148}
                height={148}
                loading="lazy"
              />
            </a>
            <span className="home-contact__qr-label">QQ 群 · AI agent 学习交流</span>
          </div>
          <div className="home-contact__qr">
            <a href="/wechat-qr.png" target="_blank" rel="noopener noreferrer" aria-label="放大微信二维码">
              <img
                src="/wechat-qr.png"
                alt="微信二维码，扫一扫添加好友"
                width={148}
                height={148}
                loading="lazy"
              />
            </a>
            <span className="home-contact__qr-label">微信 · 随风挥手</span>
          </div>
          <div className="home-contact__links">
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="home-contact__link">
              <Github size={15} />
              GitHub
            </a>
            {personalLinks.map(link => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="home-contact__link">
                {link.name === '博客园' ? <Rss size={15} /> : <ExternalLink size={15} />}
                {link.name}
              </a>
            ))}
            <a href={`mailto:${personalInfo.email}`} className="home-contact__link">
              <Mail size={15} />
              邮箱
            </a>
          </div>
        </div>
        </Reveal>
      </section>

      {/* ─── Footer ─── */}
      <footer className="home-footer">
        <span>{heroStatement.headline} · {personalInfo.name}</span>
        <span>© 2026 {personalInfo.name} · BUILT WITH AI, SHIPPED BY HUMAN</span>
      </footer>
    </div>
  )
}
