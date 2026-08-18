import { useEffect } from 'react'
import { motion } from 'framer-motion'
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
import { achievements } from '../data/achievements.js'
import { facts, heroStatement } from '../data/facts.js'
import ScrollProgress from '../components/ScrollProgress.jsx'
import HeroDust from '../components/HeroDust.jsx'
import './home.css'

// blog.json 为构建时生成（.gitignore），用 glob 容错加载
const dataFiles = import.meta.glob('../data/blog.json', { eager: true })
const blogPosts = dataFiles['../data/blog.json']?.default ?? []

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

export default function HomePage() {
  // 首页强制米色暖底（参考站 jingjinglearns.cc 设计语言）
  useEffect(() => {
    document.body.style.background = '#FBF7F1'
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <div className="home-page">
      <Head>
        <title>侯伟轩 - AI应用工程师</title>
        <meta name="description" content="侯伟轩的个人主页：AI应用工程师，专注 AI 应用开发（LangChain、RAG、Dify、AI Agent），分享开源项目与技术文章。" />
        <meta property="og:title" content="侯伟轩 - AI应用工程师" />
        <meta property="og:description" content="AI应用工程师，专注 AI 应用开发（LangChain、RAG、Dify、AI Agent），分享开源项目与技术文章。" />
        <meta property="og:image" content="https://wxhou.vercel.app/og-image.png" />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://wxhou.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* ─── 滚动进度条 ─── */}
      <ScrollProgress />

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
          <HeroDust />
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
            <span className="home-hero__console-val">27+ public</span>
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
        <p className="home-hero__status">{heroStatement.status}</p>
        <div className="home-hero__ctas">
          <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="home-hero__cta">
            <Github size={16} />
            GitHub @wxhou
            <ArrowRight size={16} />
          </a>
        </div>
        <div className="home-hero__scroll" aria-hidden="true">
          SCROLL
          <ArrowDown size={14} />
        </div>
      </motion.section>

      {/* ─── 成就滚动条 ─── */}
      <div className="home-marquee" aria-label="成就速览">
        <div className="home-marquee__track">
          {[...achievements, ...achievements].map((text, i) => (
            <span key={i} className="home-marquee__item">●{text}</span>
          ))}
        </div>
      </div>

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
            <span className="home-proof__value">27+</span>
            <span className="home-proof__label">GitHub 公开仓库</span>
          </a>
          <a className="home-proof__card" href="https://github.com/wxhou/openspec-playwright" target="_blank" rel="noopener noreferrer">
            <Star size={22} className="home-proof__icon" />
            <span className="home-proof__value">⭐8</span>
            <span className="home-proof__label">openspec-playwright 开源 star</span>
          </a>
          <a className="home-proof__card" href="https://www.cnblogs.com/wxhou" target="_blank" rel="noopener noreferrer">
            <FileText size={22} className="home-proof__icon" />
            <span className="home-proof__value">20 篇</span>
            <span className="home-proof__label">博客园技术文章</span>
          </a>
        </div>
        </Reveal>
      </section>

      {/* ─── About 三事实 ─── */}
      <section id="about" className="home-section">
        <SectionHeader index="03" label="ABOUT" title="三个事实" note="GitHub 开源创作的三条主线。" />
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
            {/* TODO(user): 用户提供微信二维码图片后替换为 public/wechat-qr.png */}
            <div className="home-contact__qr-placeholder" aria-label="微信二维码占位">二维码<br />待提供</div>
            <span className="home-contact__qr-label">微信</span>
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
