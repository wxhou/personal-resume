import { motion } from 'framer-motion'
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas'
import {
  Phone, Mail, MapPin, Github, GraduationCap,
  Cpu, Code, Zap, Package, Briefcase,
  Rocket, BookOpen, Link, ExternalLink,
} from 'lucide-react'

// ─── Resume Data ───────────────────────────────────────────
const personalInfo = {
  name: '侯伟轩',
  title: 'AI应用工程师',
  salary: '¥18K – 20K',
  phone: '18291900215',
  email: 'hooupythonic@gmail.com',
  location: '西安',
  github: 'https://github.com/wxhou',
  education: {
    school: '陕西职业技术学院',
    major: '工程造价',
    degree: '大专'
  }
}

const skills = {
  ai: ['AI编程', 'LangChain', 'LangGraph', 'Dify', 'Prompt工程', 'RAG技术', 'AI Agent', 'MCP'],
  backend: ['FastAPI', 'Flask', 'RESTful API', 'Linux', 'SQL'],
  automation: ['Python + Requests', 'Selenium', 'Airtest', 'Locust', 'Jmeter'],
  basic: ['Python', 'Git']
}

const experience = [
  {
    company: '西安云景智维科技有限公司',
    roles: [
      { title: 'AI应用工程师', period: '2025 – 至今', active: true },
      { title: '项目经理', period: '2020 – 2024', active: false },
      { title: '测试开发工程师', period: '2018.11 – 2019', active: false }
    ]
  }
]

const projects = [
  {
    name: '西安地铁智慧运维平台',
    description: '西安市轨道交通集团有限公司运营分公司的设备智慧运维系统',
    details: [
      '与客户进行需求沟通，梳理需求，编写需求文档',
      '设计开发架构，进行技术选型，编写后端API接口',
      '负责日常版本更新迭代维护，以及BUG修复和优化改进',
      '主持项目会议，安排测试开发任务，汇报项目进展'
    ]
  },
  {
    name: 'AI大模型室内定位系统',
    description: '基于ibeacon蓝牙位置信息的室内定位服务，通过AI编程优化算法提升定位精度',
    details: [
      '负责AI定位算法在业务场景中的应用落地，优化室内定位精度',
      '使用Python进行AI模型的数据预处理和后处理脚本开发',
      '设计开发室内定位数据采集与分析平台',
      '通过Locust进行并发压测，性能优化'
    ]
  },
  {
    name: '数字人智能体开发(Dify)',
    description: '基于Dify平台开发数字人智能体，集成RAG知识库实现西安地铁运营知识问答、换乘推荐等功能',
    details: [
      '配置工作流和Agent对话逻辑',
      '编写Prompt提示词，设置数字人回答规则',
      '搭建知识库，实现私有知识检索',
      '集成第三方工具（搜索、TTS等）'
    ]
  },
  {
    name: '光环商业信息发布系统',
    description: '重庆光环购物中心信息发布系统',
    details: [
      '参与后端API的开发工作，进行部分模块的接口开发',
      '负责批量控制近百台设备的脚本开发',
      '日常版本更新迭代维护',
      '模拟现场环境，寻找系统响应瓶颈'
    ]
  }
]

const evaluations = [
  '做人真诚，做事认真负责',
  '进取务实，善于学习自我感兴趣的知识和事物，敢于主动承担自我的职责',
  '细节决定成败'
]

const personalLinks = [
  { name: '博客园', url: 'https://www.cnblogs.com/wxhou' },
  { name: 'Gitee', url: 'https://gitee.com/wxhou' },
  { name: 'OpenSpec Playwright', url: 'https://wxhou.github.io/openspec-playwright/' },
]

// ─── Animation Variants ────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { delay, duration: 0.5, ease: 'easeOut' }
  })
}

// ─── App ───────────────────────────────────────────────────
export default function App() {
  const exportPDF = () => {
    const element = document.getElementById('resume-a4')
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
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('resume-a4')
          if (el) {
            el.style.margin = '0'
            el.style.boxShadow = 'none'
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
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      backgroundColor: '#FDFBF7'
    })
    const link = document.createElement('a')
    link.download = '侯伟轩_个人简历.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Export Buttons */}
      <div className="fixed top-5 right-5 z-50 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={exportImage}
          className="export-btn"
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
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          导出PDF
        </motion.button>
      </div>

      {/* A4 Paper */}
      <div id="resume-a4" className="a4-container">
        {/* Corner Marks */}
        <div className="a4-corner-mark a4-corner-mark--tl" />
        <div className="a4-corner-mark a4-corner-mark--tr" />
        <div className="a4-corner-mark a4-corner-mark--bl" />
        <div className="a4-corner-mark a4-corner-mark--br" />

        {/* Background Art */}
        <div className="a4-bg-art a4-bg-art--circle" />
        <div className="a4-bg-art a4-bg-art--line1" />
        <div className="a4-bg-art a4-bg-art--line2" />
        <div className="a4-bg-art a4-bg-art--dot" />

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
                {/* Decorative numeral */}
                <span className="footer-mark block mb-1">No. 001</span>
                <h1
                  className="text-[32px] font-bold text-[#2D2318] leading-none tracking-tight mb-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {personalInfo.name}
                </h1>
                <p
                  className="text-[15px] text-[#785A3C] tracking-[0.08em] mb-1"
                  style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}
                >
                  {personalInfo.title}
                </p>
                <p
                  className="text-[12px] text-[#A89A88] tracking-[0.04em]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                >
                  {personalInfo.salary}
                </p>
              </motion.div>
            </div>

            {/* Right: Geometric Avatar */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="avatar-art"
            >
              <div className="avatar-art__ring" />
              <div className="avatar-art__inner">
                <span className="avatar-art__monogram">
                  {personalInfo.name.charAt(0)}
                </span>
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
            style={{ borderTop: '1px solid rgba(120,90,60,0.12)' }}
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* ── Left Column (5 cols) ── */}
          <div className="md:col-span-5 space-y-5">

            {/* About */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.15}
            >
              <div className="section-label">关于我</div>
              <div className="space-y-2">
                {evaluations.map((text, i) => (
                  <motion.p
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.25 + i * 0.08}
                    className="text-[12px] text-[#6B5B4D] leading-relaxed"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                  >
                    {text}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
            >
              <div className="section-label">教育背景</div>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.3}
                className="mt-1"
              >
                <p
                  className="text-[13px] font-semibold text-[#2D2318]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {personalInfo.education.school}
                </p>
                <p
                  className="text-[11px] text-[#8B7B68] mt-0.5"
                  style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}
                >
                  {personalInfo.education.major} · {personalInfo.education.degree}
                </p>
              </motion.div>
            </motion.div>

            {/* Skills - AI */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.25}
            >
              <div className="section-label">AI技能</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {skills.ai.map((s, i) => (
                  <motion.span
                    key={s}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    custom={0.35 + i * 0.04}
                    className="skill-tag"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Skills - Backend */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
            >
              <div className="section-label">后端开发</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {skills.backend.map((s, i) => (
                  <motion.span
                    key={s}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    custom={0.4 + i * 0.04}
                    className="skill-tag"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Skills - Automation */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.35}
            >
              <div className="section-label">自动化测试</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {skills.automation.map((s, i) => (
                  <motion.span
                    key={s}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    custom={0.45 + i * 0.04}
                    className="skill-tag"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Skills - Basic */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
            >
              <div className="section-label">基础技能</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {skills.basic.map((s, i) => (
                  <motion.span
                    key={s}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    custom={0.5 + i * 0.04}
                    className="skill-tag"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Personal Links */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.45}
            >
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
                    custom={0.55 + i * 0.06}
                    className="link-item"
                  >
                    <ExternalLink size={10} strokeWidth={1.5} />
                    <span className="link-item__name">{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right Column (7 cols) ── */}
          <div className="md:col-span-7 space-y-5">

            {/* Experience */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
            >
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
                    <div className={`timeline-item__dot ${role.active ? 'timeline-item__dot--active' : ''}`} />
                    <div className="timeline-item__title">{role.title}</div>
                    <div className="timeline-item__company">{experience[0].company}</div>
                    <div className="timeline-item__period">{role.period}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Projects */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
            >
              <div className="section-label">项目经验</div>
              <div className="mt-1 space-y-4">
                {projects.map((project, i) => (
                  <motion.div
                    key={project.name}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.4 + i * 0.1}
                    className="project-card"
                  >
                    <div className="project-card__name">{project.name}</div>
                    <div className="project-card__desc">{project.description}</div>
                    <div className="space-y-1">
                      {project.details.map((detail, j) => (
                        <motion.p
                          key={j}
                          variants={fadeIn}
                          initial="hidden"
                          animate="visible"
                          custom={0.5 + i * 0.1 + j * 0.05}
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
          style={{ borderTop: '1px solid rgba(120,90,60,0.12)' }}
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
