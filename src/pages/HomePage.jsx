import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Head } from 'vite-react-ssg'
import '@fontsource/noto-serif-sc/400.css'
import '@fontsource/noto-serif-sc/600.css'
import '@fontsource/noto-serif-sc/700.css'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/500.css'
import '@fontsource/noto-sans-sc/700.css'
import { ArrowRight, ArrowDown, ExternalLink, Github, Mail, Rss, Star, FileText, FolderGit2, Cpu } from 'lucide-react'
import { personalInfo, skills, personalLinks } from '../data/resume.js'
import featuredData from '../data/featuredProjects.json'
import { achievements } from '../data/achievements.js'
import { facts, heroStatement } from '../data/facts.js'
import HeroParticles from '../components/HeroParticles.jsx'
import ScrollProgress from '../components/ScrollProgress.jsx'
import './home.css'

// blog.json 为构建时生成（.gitignore），用 glob 容错加载
const dataFiles = import.meta.glob('../data/blog.json', { eager: true })
const blogPosts = dataFiles['../data/blog.json']?.default ?? []

const { featured, more } = featuredData

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
}

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function SectionHeader({ index, label, title, note }) {
  return (
    <div className="home-section__head">
      <div>
        <span className="home-section__eyebrow">{label} / {index}</span>
        <h2 className="home-section__title">{title}</h2>
      </div>
      <span className="home-section__index" aria-hidden="true">{index}</span>
      {note && <p className="home-section__note">{note}</p>}
    </div>
  )
}

export default function HomePage() {
  // index.css 的简历主题变量会把 body 染成暗色；首页强制暖米色
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
      <motion.section className="home-hero" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <div className="home-hero__bg" aria-hidden="true">
          <HeroParticles />
        </div>
        <span className="home-hero__eyebrow">AI APPLICATION ENGINEER · AI 编程落地</span>
        <h1 className="home-hero__name">{heroStatement.headline}</h1>
        <p className="home-hero__subtitle">{heroStatement.subtitle}</p>
        <p className="home-hero__tagline">{heroStatement.tagline}</p>
        <p className="home-hero__status">{heroStatement.status}</p>
        <div className="home-hero__ctas">
          <a href="#projects" className="home-hero__cta">
            查看项目
            <ArrowDown size={16} />
          </a>
          <a href="/resume" className="home-hero__cta home-hero__cta--ghost">
            查看简历
            <ArrowRight size={16} />
          </a>
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
      <motion.section className="home-section" variants={fadeUp} initial="hidden" animate="visible" custom={0.05}>
        <SectionHeader index="00" label="SKILLS" title="技能栈" />
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
      </motion.section>

      {/* ─── 精选项目 ─── */}
      <motion.section id="projects" className="home-section" variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
        <SectionHeader index="01" label="SELECTED WORK" title="做过的东西" note="6 个精选开源项目：测试代理、AI 工具与实验作品。" />
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

        {/* ─── 补充项目 ─── */}
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
      </motion.section>

      {/* ─── 成果 ─── */}
      <motion.section id="proof" className="home-section" variants={fadeUp} initial="hidden" animate="visible" custom={0.15}>
        <SectionHeader index="02" label="PROOF" title="看得见的成果" note="真实可核验的数据与记录。" />
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
          <a className="home-proof__card" href="/resume">
            <Cpu size={22} className="home-proof__icon" />
            <span className="home-proof__value">4 个</span>
            <span className="home-proof__label">ToB 项目业务落地</span>
          </a>
        </div>
      </motion.section>

      {/* ─── About 三事实 ─── */}
      <motion.section id="about" className="home-section" variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
        <SectionHeader index="03" label="ABOUT" title="三个事实" note="8 年成长弧线：测试 → 项目 → AI 应用。" />
        <div className="home-facts">
          {facts.map(fact => (
            <div key={fact.id} className="home-fact">
              <span className="home-fact__id">{fact.id}</span>
              <h3 className="home-fact__title">{fact.title}</h3>
              <p className="home-fact__desc">{fact.description}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ─── 最新博客 ─── */}
      {blogPosts.length > 0 && (
        <motion.section id="blog" className="home-section" variants={fadeUp} initial="hidden" animate="visible" custom={0.25}>
          <SectionHeader index="04" label="WRITING" title="最新博客" note="博客园持续输出的技术文章。" />
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
        </motion.section>
      )}

      {/* ─── 联系 ─── */}
      <motion.section id="contact" className="home-section" variants={fadeUp} initial="hidden" animate="visible" custom={0.3}>
        <SectionHeader index="05" label="CONTACT" title="想聊点什么？" note="求职沟通 · 技术交流 · 项目合作，欢迎联系。" />
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
      </motion.section>

      {/* ─── Footer ─── */}
      <footer className="home-footer">
        <span>{heroStatement.headline} · {personalInfo.name}</span>
        <span>© 2026 {personalInfo.name} · BUILT WITH AI, SHIPPED BY HUMAN</span>
      </footer>
    </div>
  )
}
