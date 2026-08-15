import { motion } from 'framer-motion'
import { Head } from 'vite-react-ssg'
import { ArrowRight, ExternalLink, Github, Mail, Rss } from 'lucide-react'
import { personalInfo, skills, personalLinks } from '../data/resume.js'
import featuredProjects from '../data/featuredProjects.json'
import './home.css'

// blog.json 为构建时生成（.gitignore），用 glob 容错加载
const dataFiles = import.meta.glob('../data/blog.json', { eager: true })
const blogPosts = dataFiles['../data/blog.json']?.default ?? []

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
}

const skillGroups = [
  { label: 'AI 技能', key: 'ai' },
  { label: '后端开发', key: 'backend' },
  { label: '自动化测试', key: 'automation' },
]

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function HomePage() {
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
      {/* ─── Hero ─── */}
      <motion.section
        className="home-hero"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <h1 className="home-hero__name">{personalInfo.name}</h1>
        <p className="home-hero__title">{personalInfo.title} · {personalInfo.location}</p>
        <p className="home-hero__tagline">
          专注 AI 应用开发：LangChain、RAG、Dify、AI Agent、MCP。
          用 AI 编程解决真实业务问题，也折腾开源工具与自动化。
        </p>
        <a href="/resume" className="home-hero__cta">
          查看简历
          <ArrowRight size={16} />
        </a>
      </motion.section>

      {/* ─── Skills ─── */}
      <motion.section
        className="home-section"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        <div className="home-section__label">技能栈</div>
        {skillGroups.map(group => (
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

      {/* ─── Featured Projects ─── */}
      <motion.section
        className="home-section"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
      >
        <div className="home-section__label">精选项目</div>
        <div className="home-projects">
          {featuredProjects.map(project => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="home-project"
            >
              <div className="home-project__name">
                {project.name}
                <span className="home-project__lang">{project.language}</span>
              </div>
              <div className="home-project__desc">{project.description}</div>
              <span className="home-project__link">
                GitHub
                <ExternalLink size={12} />
              </span>
            </a>
          ))}
        </div>
      </motion.section>

      {/* ─── Latest Blog ─── */}
      {blogPosts.length > 0 && (
        <motion.section
          className="home-section"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
          <div className="home-section__label">最新博客</div>
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

      {/* ─── Find Me ─── */}
      <motion.section
        className="home-section"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.4}
      >
        <div className="home-section__label">找到我</div>
        <div className="home-contact">
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
      </motion.section>

      {/* ─── Footer ─── */}
      <footer className="home-footer">
        <span>© 2026 {personalInfo.name}</span>
        <span>Powered by React + Vite</span>
      </footer>
    </div>
  )
}
