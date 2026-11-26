import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Head } from 'vite-react-ssg'
import {
  Phone, Mail, MapPin, Github, ExternalLink,
} from 'lucide-react'
import ResumeLock from '../components/ResumeLock.jsx'
import ProfileCard from '../components/ProfileCard.jsx'
import { resumeName } from '../data/profile.js'
import { unlockResume, ResumeUnlockError } from '../lib/resumeCrypto.js'
import './resume.css'

const THEMES = [
  { id: 'original', label: '墨蓝' },
  { id: 'dark', label: '夜航' },
  { id: 'editorial', label: '纸本' },
  { id: 'geometric', label: '几何' },
]

// 画像卡导出档位，统一 16:9
const CARD_SIZES = [
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 3840, height: 2160 },
]

// ─── Animation Variants ────────────────────────────────────
// reduced：不做位移与淡入，内容直接以最终位置出现
const fadeUp = (reduced) => (reduced
  ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
  : {
    hidden: { opacity: 0, y: 16 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }
    })
  })

const fadeIn = (reduced) => (reduced
  ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
  : {
    hidden: { opacity: 0 },
    visible: (delay = 0) => ({
      opacity: 1,
      transition: { delay, duration: 0.4, ease: 'easeOut' }
    })
  })

// ─── Theme Switcher ───────────────────────────────────────
function ThemeSwitcher({ theme, onThemeChange }) {
  const handleKeyDown = (event) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const buttons = [...event.currentTarget.querySelectorAll('button')]
    const current = buttons.findIndex((button) => button.getAttribute('aria-pressed') === 'true')
    const delta = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1
    const next = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? THEMES.length - 1
        : (current + delta + THEMES.length) % THEMES.length
    onThemeChange(THEMES[next].id)
    buttons[next]?.focus()
  }

  return (
    <div className="theme-switcher" role="group" aria-label="简历主题" onKeyDown={handleKeyDown}>
      {THEMES.map(t => (
        <button
          key={t.id}
          type="button"
          aria-pressed={theme === t.id}
          aria-label={`切换到${t.label}主题`}
          className={`theme-switcher__btn${theme === t.id ? ' theme-switcher__btn--active' : ''}`}
          onClick={() => onThemeChange(t.id)}
          tabIndex={theme === t.id ? 0 : -1}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ─── Resume Page ───────────────────────────────────────────
export default function ResumePage() {
  const reducedMotion = useReducedMotion()
  const fadeUpV = fadeUp(reducedMotion)
  const fadeInV = fadeIn(reducedMotion)

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
    } catch { /* 隐私模式 localStorage 不可用，忽略 */ }
  }, [theme])

  const [resumeData, setResumeData] = useState(null)
  const [unlocking, setUnlocking] = useState(false)
  const [unlockError, setUnlockError] = useState('')

  const cardDialogRef = useRef(null)
  const cardStageRef = useRef(null)
  const cardOffscreenRef = useRef(null)
  const [cardOpen, setCardOpen] = useState(false)
  const [cardPreviewWidth, setCardPreviewWidth] = useState(1200)
  const [cardExport, setCardExport] = useState(null)
  const [cardBusy, setCardBusy] = useState(false)

  // 预览宽度跟随弹层可用宽度，卡片按该宽度等比排版
  useEffect(() => {
    if (!cardOpen) return
    const stage = cardStageRef.current
    if (!stage) return
    const update = () => {
      const style = getComputedStyle(stage)
      const available = stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
      const width = Math.min(Math.floor(available), 1280)
      if (width > 0) setCardPreviewWidth(width)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [cardOpen])

  const handleUnlock = async (password) => {
    setUnlocking(true)
    setUnlockError('')
    try {
      setResumeData(await unlockResume(password))
    } catch (err) {
      setUnlockError(err instanceof ResumeUnlockError ? err.message : '解锁失败，请重试')
    } finally {
      setUnlocking(false)
    }
  }

  const pageHead = (
    <Head>
      <title>{resumeName} - 个人简历</title>
      <meta name="description" content={`${resumeName}的在线简历：AI应用工程师，擅长 LangChain、RAG、Dify、AI Agent 开发与自动化测试。`} />
      <meta name="robots" content="noindex,nofollow" />
    </Head>
  )

  const exportPDF = async () => {
    const element = document.getElementById('resume-a4')
    if (!element) return
    const { default: html2pdf } = await import('html2pdf.js')
    const paperBackground = getComputedStyle(element).backgroundColor
    const opt = {
      margin: 0,
      filename: `${resumeName}_个人简历.pdf`,
      image: { type: 'png', quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        windowWidth: 794,
        backgroundColor: paperBackground,
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
    // 纸张按 297mm 渲染会在 jsPDF 里溢出到第二页（余数切片），压到 295mm 保证单页
    element.classList.add('a4-container--export')
    element.style.minHeight = '295mm'
    try {
      await html2pdf().set(opt).from(element).save()
    } finally {
      element.classList.remove('a4-container--export')
      element.style.minHeight = ''
    }
  }

  const exportImage = async () => {
    const element = document.getElementById('resume-a4')
    if (!element) return
    const { default: html2canvas } = await import('html2canvas')
    element.classList.add('a4-container--export')
    let canvas
    try {
      canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: getComputedStyle(element).backgroundColor
      })
    } finally {
      element.classList.remove('a4-container--export')
    }
    const link = document.createElement('a')
    link.download = `${resumeName}_个人简历.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const openCardPreview = () => {
    const dialog = cardDialogRef.current
    if (!dialog || dialog.open) return
    setCardOpen(true)
    dialog.showModal()
  }

  // 导出用离屏副本：把卡片按目标像素宽度挂到视口外再截图，不动可见布局
  const exportProfileCard = async (size) => {
    if (cardBusy) return
    setCardBusy(true)
    try {
      await document.fonts.ready
      setCardExport(size)
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      const element = cardOffscreenRef.current?.querySelector('.profile-card')
      if (!element) return
      const { default: html2canvas } = await import('html2canvas')
      // 卡片固定 1920×1080 排版，用 scale 把它渲染成目标像素尺寸
      const canvas = await html2canvas(element, {
        scale: size.width / 1920,
        useCORS: true,
        logging: false,
        width: 1920,
        height: 1080,
        backgroundColor: getComputedStyle(element).backgroundColor
      })
      const link = document.createElement('a')
      link.download = `${resumeName}-能力画像-${size.width}x${size.height}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setCardExport(null)
      setCardBusy(false)
    }
  }

  if (!resumeData) {
    return (
      <>
        {pageHead}
        <ResumeLock onSubmit={handleUnlock} loading={unlocking} error={unlockError} />
      </>
    )
  }

  const { personalInfo, skills, experience, workProjects, evaluations, personalLinks } = resumeData

  return (
    <div className="resume-page">
      {pageHead}
      <aside className="resume-tools" aria-label="简历工具">
        <ThemeSwitcher theme={theme} onThemeChange={setTheme} />
        <div className="resume-tools__exports">
        <motion.button
          whileHover={reducedMotion ? undefined : { scale: 1.03 }}
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
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
          whileHover={reducedMotion ? undefined : { scale: 1.03 }}
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
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
        <motion.button
          whileHover={reducedMotion ? undefined : { scale: 1.03 }}
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
          onClick={openCardPreview}
          className="export-btn"
          aria-label="打开能力画像"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2.5" y="4.5" width="19" height="15" rx="1.5"/>
            <line x1="2.5" y1="9" x2="21.5" y2="9"/>
            <line x1="7.5" y1="13" x2="16.5" y2="13"/>
          </svg>
          画像
        </motion.button>
        </div>
      </aside>

      {/* A4 Paper */}
      <main id="resume-a4" className="a4-container">
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
          variants={fadeUpV}
          initial="hidden"
          animate="visible"
          custom={0}
          className="resume-masthead"
        >
          <motion.div
            variants={fadeUpV}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="resume-masthead__identity"
          >
            <span className="footer-mark block mb-1">No. 001</span>
            <div className="resume-name">
              <h1 className="header-name">{personalInfo.name}</h1>
              <span className="resume-seal" aria-hidden="true">{personalInfo.name.charAt(0)}</span>
            </div>
            <p className="header-title">{personalInfo.title}</p>
            <p className="header-salary">¥{personalInfo.salary}</p>
          </motion.div>

          <motion.div
            variants={fadeInV}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="resume-masthead__meta"
          >
            <div className="avatar-wrap" aria-hidden="true">
              <div className="avatar-ring" />
              <div className="avatar-inner">
                <span className="avatar-monogram">{personalInfo.name.charAt(0)}</span>
              </div>
            </div>
            <div className="resume-contact">
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
            </div>
          </motion.div>
        </motion.header>

        <div className="section-rule" />

        {/* ─── Two-Column Layout ─── */}
        <div className="resume-body">
          {/* ── Left Column ── */}
          <div className="resume-column resume-column--left">

            {/* About */}
            <motion.div variants={fadeUpV} initial="hidden" animate="visible" custom={0.15}>
              <h2 className="section-label">关于我</h2>
              <div className="space-y-2">
                {evaluations.map((text, i) => (
                  <motion.p
                    key={i}
                    variants={fadeUpV}
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
            <motion.div variants={fadeUpV} initial="hidden" animate="visible" custom={0.2}>
              <h2 className="section-label">教育背景</h2>
              <motion.div variants={fadeUpV} initial="hidden" animate="visible" custom={0.3} className="mt-1">
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
              <motion.div key={key} variants={fadeUpV} initial="hidden" animate="visible" custom={0.25 + idx * 0.05}>
                <h2 className="section-label">{label}</h2>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {skills[key].map((s, i) => (
                    <motion.span
                      key={s}
                      variants={fadeInV}
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
            <motion.div variants={fadeUpV} initial="hidden" animate="visible" custom={0.5}>
              <h2 className="section-label">个人主页</h2>
              <div className="space-y-2 mt-1">
                {personalLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={fadeUpV}
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
          <div className="resume-column resume-column--right">

            {/* Experience */}
            <motion.div variants={fadeUpV} initial="hidden" animate="visible" custom={0.2}>
              <h2 className="section-label">工作经历</h2>
              <div className="mt-1">
                {experience[0].roles.map((role, i) => (
                  <motion.div
                    key={role.title}
                    variants={fadeUpV}
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
            <motion.div variants={fadeUpV} initial="hidden" animate="visible" custom={0.35}>
              <h2 className="section-label">项目经验</h2>
              <div className="mt-1 space-y-4">
                {workProjects.map((project, i) => (
                  <motion.div
                    key={project.name}
                    variants={fadeUpV}
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
                          variants={fadeInV}
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
          variants={fadeUpV}
          initial="hidden"
          animate="visible"
          custom={0.7}
          className="resume-footer"
        >
          <div className="flex gap-3">
            <motion.a
              href={`tel:${personalInfo.phone}`}
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              className="btn-cta btn-cta--primary"
            >
              联系我
            </motion.a>
            <motion.a
              href={`mailto:${personalInfo.email}`}
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              className="btn-cta btn-cta--ghost"
            >
              发送邮件
            </motion.a>
          </div>
          <span className="footer-mark">
            © 2026 {personalInfo.name}
          </span>
        </motion.div>
      </main>

      <dialog
        ref={cardDialogRef}
        className="card-dialog"
        aria-label="能力画像预览"
        onClose={() => setCardOpen(false)}
      >
        <div className="card-dialog__bar">
          <span className="card-dialog__title">能力画像</span>
          <button
            type="button"
            className="card-dialog__close"
            onClick={() => cardDialogRef.current?.close()}
            aria-label="关闭"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        <div className="card-dialog__stage" ref={cardStageRef}>
          <ProfileCard data={resumeData} width={cardPreviewWidth} />
        </div>

        <div className="card-dialog__sizes">
          <span className="card-dialog__sizes-label">导出尺寸</span>
          {CARD_SIZES.map((size) => (
            <button
              key={size.width}
              type="button"
              className="card-dialog__size"
              onClick={() => exportProfileCard(size)}
              disabled={cardBusy}
              aria-label={`导出 ${size.width}×${size.height} PNG`}
            >
              {size.width}×{size.height}
            </button>
          ))}
        </div>
      </dialog>

      {cardExport && (
        <div className="card-offscreen" aria-hidden="true" ref={cardOffscreenRef}>
          <ProfileCard data={resumeData} width={1920} />
        </div>
      )}
    </div>
  )
}
