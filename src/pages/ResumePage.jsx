import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Head } from 'vite-react-ssg'
import {
  Phone, Mail, MapPin, Github, ExternalLink,
} from 'lucide-react'
import { personalInfo, skills, experience, workProjects, evaluations, personalLinks } from '../data/resume.js'

const THEMES = [
  { id: 'original', label: '原始' },
  { id: 'dark', label: '精密' },
  { id: 'editorial', label: '杂志' },
  { id: 'geometric', label: '几何' },
]

// ─── Animation Variants ────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  })
}
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { delay, duration: 0.4, ease: 'easeOut' }
  })
}

// ─── Theme Switcher ───────────────────────────────────────
function ThemeSwitcher({ theme, onThemeChange }) {
  return (
    <div className="theme-switcher" role="tablist" aria-label="简历主题切换">
      {THEMES.map(t => (
        <button
          key={t.id}
          role="tab"
          aria-selected={theme === t.id}
          aria-label={`切换到${t.label}风格`}
          className={`theme-switcher__btn${theme === t.id ? ' theme-switcher__btn--active' : ''}`}
          onClick={() => onThemeChange(t.id)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              const idx = THEMES.findIndex(x => x.id === theme)
              const next = e.key === 'ArrowDown'
                ? THEMES[(idx + 1) % THEMES.length]
                : THEMES[(idx - 1 + THEMES.length) % THEMES.length]
              onThemeChange(next.id)
            }
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ─── Resume Page ───────────────────────────────────────────
export default function ResumePage() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resume-theme')
      if (saved && THEMES.some(t => t.id === saved)) return saved
    }
    return 'original'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('resume-theme', theme)
    } catch {}
  }, [theme])

  const exportPDF = async () => {
    const element = document.getElementById('resume-a4')
    if (!element) return
    const { default: html2pdf } = await import('html2pdf.js')
    const opt = {
      margin: 2,
      filename: '侯伟轩_个人简历.pdf',
      image: { type: 'png', quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        windowWidth: 794,
        backgroundColor: theme === 'dark' ? '#09090B' : theme === 'editorial' ? '#F9F7F4' : '#ffffff',
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('resume-a4')
          if (el) {
            el.style.margin = '0'
            el.style.boxShadow = 'none'
            clonedDoc.documentElement.setAttribute('data-theme', theme)
          }
        }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }
    html2pdf().set(opt).from(element).save()
  }

  const exportImage = async () => {
    const element = document.getElementById('resume-a4')
    if (!element) return
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      backgroundColor: theme === 'dark' ? '#09090B' : theme === 'editorial' ? '#F9F7F4' : '#ffffff'
    })
    const link = document.createElement('a')
    link.download = '侯伟轩_个人简历.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="min-h-screen pl-[56px]" style={{ background: 'var(--bg-page)', transition: 'background 300ms ease-out' }}>
      <Head>
        <title>侯伟轩 - 个人简历</title>
        <meta name="description" content="侯伟轩的在线简历：AI应用工程师，擅长 LangChain、RAG、Dify、AI Agent 开发与自动化测试。" />
      </Head>
      {/* Theme Switcher - Left Sidebar */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Export Buttons - Top Right (below site nav) */}
      <div className="fixed top-20 right-4 z-50 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={exportImage}
          className="export-btn"
          aria-label="导出图片"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          导出图片
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={exportPDF}
          className="export-btn"
          aria-label="导出PDF"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          导出PDF
        </motion.button>
      </div>

      {/* A4 Paper */}
      <div id="resume-a4" className="a4-container">
        {/* Corner Marks */}
        <div className="a4-corner-mark a4-corner-mark--tl" aria-hidden="true" />
        <div className="a4-corner-mark a4-corner-mark--tr" aria-hidden="true" />
        <div className="a4-corner-mark a4-corner-mark--bl" aria-hidden="true" />
        <div className="a4-corner-mark a4-corner-mark--br" aria-hidden="true" />

        {/* Geometric Art (only shown in geometric theme) */}
        <div className="geometric-art geometric-art--dot1" aria-hidden="true" />
        <div className="geometric-art geometric-art--dot2" aria-hidden="true" />
        <div className="geometric-art geometric-art--line1" aria-hidden="true" />
        <div className="geometric-art geometric-art--line2" aria-hidden="true" />

        {/* ─── Header ─── */}
        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-5"
        >
          <div className="flex items-start justify-between">
            {/* Left: Name & Title */}
            <div className="flex-1">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.1}
              >
                <span className="footer-mark block mb-1">No. 001</span>
                <h1 className="header-name">{personalInfo.name}</h1>
                <p className="header-title">{personalInfo.title}</p>
                <p className="header-salary">{personalInfo.salary}</p>
              </motion.div>
            </div>

            {/* Right: Avatar */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="avatar-wrap"
              aria-hidden="true"
            >
              <div className="avatar-ring" />
              <div className="avatar-inner">
                <span className="avatar-monogram">{personalInfo.name.charAt(0)}</span>
              </div>
            </motion.div>
          </div>

          {/* Contact Row */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <a href={`tel:${personalInfo.phone}`} className="contact-link">
              <Phone size={11} strokeWidth={1.5} />
              {personalInfo.phone}
            </a>
            <a href={`mailto:${personalInfo.email}`} className="contact-link">
              <Mail size={11} strokeWidth={1.5} />
              {personalInfo.email}
            </a>
            <span className="contact-link">
              <MapPin size={11} strokeWidth={1.5} />
              {personalInfo.location}
            </span>
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="contact-link">
              <Github size={11} strokeWidth={1.5} />
              github.com/wxhou
            </a>
          </motion.div>
        </motion.header>

        <div className="section-rule" />

        {/* ─── Two-Column Layout ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative" style={{ zIndex: 1 }}>
          {/* ── Left Column ── */}
          <div className="md:col-span-5 space-y-5">

            {/* About */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.15}>
              <div className="section-label">关于我</div>
              <div className="space-y-2">
                {evaluations.map((text, i) => (
                  <motion.p
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.25 + i * 0.08}
                    className="about-text"
                  >
                    {text}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
              <div className="section-label">教育背景</div>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.3} className="mt-1">
                <p className="edu-school">{personalInfo.education.school}</p>
                <p className="edu-meta">{personalInfo.education.major} · {personalInfo.education.degree}</p>
              </motion.div>
            </motion.div>

            {/* Skills */}
            {[
              { label: 'AI技能', key: 'ai' },
              { label: '后端开发', key: 'backend' },
              { label: '自动化测试', key: 'automation' },
              { label: '基础技能', key: 'basic' },
            ].map(({ label, key }, idx) => (
              <motion.div key={key} variants={fadeUp} initial="hidden" animate="visible" custom={0.25 + idx * 0.05}>
                <div className="section-label">{label}</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {skills[key].map((s, i) => (
                    <motion.span
                      key={s}
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      custom={0.35 + idx * 0.05 + i * 0.04}
                      className="skill-tag"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Personal Links */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.5}>
              <div className="section-label">个人主页</div>
              <div className="space-y-2 mt-1">
                {personalLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.58 + i * 0.06}
                    className="link-item"
                  >
                    <ExternalLink size={10} strokeWidth={1.5} />
                    <span className="link-item__name">{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right Column ── */}
          <div className="md:col-span-7 space-y-5">

            {/* Experience */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
              <div className="section-label">工作经历</div>
              <div className="mt-1">
                {experience[0].roles.map((role, i) => (
                  <motion.div
                    key={role.title}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.3 + i * 0.12}
                    className="timeline-item"
                  >
                    <div className={`timeline-dot ${role.active ? 'timeline-dot--active' : ''}`} />
                    <div className="timeline-title">{role.title}</div>
                    <div className="timeline-company">{experience[0].company}</div>
                    <div className="timeline-period">{role.period}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Projects */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.35}>
              <div className="section-label">项目经验</div>
              <div className="mt-1 space-y-4">
                {workProjects.map((project, i) => (
                  <motion.div
                    key={project.name}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.45 + i * 0.1}
                    className="project-card"
                  >
                    {/* Geometric: index number */}
                    <span className="geometric-index" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="project-card__name">{project.name}</div>
                    <div className="project-card__desc">{project.description}</div>
                    <div className="space-y-1">
                      {project.details.map((detail, j) => (
                        <motion.p
                          key={j}
                          variants={fadeIn}
                          initial="hidden"
                          animate="visible"
                          custom={0.55 + i * 0.1 + j * 0.05}
                          className="project-card__detail"
                        >
                          {detail}
                        </motion.p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─── Footer ─── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.7}
          className="mt-6 pt-4 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div className="flex gap-3">
            <motion.a
              href={`tel:${personalInfo.phone}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-cta btn-cta--primary"
            >
              联系我
            </motion.a>
            <motion.a
              href={`mailto:${personalInfo.email}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-cta btn-cta--ghost"
            >
              发送邮件
            </motion.a>
          </div>
          <span className="footer-mark">
            © 2026 {personalInfo.name}
          </span>
        </motion.div>
      </div>
    </div>
  )
}
