import { motion } from 'framer-motion'
import {
  Phone, Mail, MapPin, Github, User, GraduationCap,
  Cpu, Code, Wrench, Boxes, Briefcase,
  Rocket, Zap, Package, ChevronRight, BookOpen, Link,
  Star, CheckCircle
} from 'lucide-react'

// Resume Data
const personalInfo = {
  name: '侯伟轩',
  title: 'AI应用工程师',
  salary: '18K-20K',
  phone: '18291900215',
  email: 'hooupythonic@gmail.com',
  location: '西安市周至县',
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
      { title: 'AI应用工程师', period: '2025 - 至今' },
      { title: '项目经理', period: '2020 - 2024' },
      { title: '测试开发工程师', period: '2018.11 - 2019' }
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
      '参与后端的API的开发工作',
      '负责批量控制近百台设备的脚本开发',
      '日常版本更新迭代维护',
      '模拟现场环境，寻找系统响应瓶颈'
    ]
  }
]

const evaluations = [
  '做人真诚，做事认真负责',
  '进取务实，善于学习新事物',
  '细节决定成败'
]

// Components
function Card({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={`bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 card-bg ${className}`}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ icon, title, delay = 0 }) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay + 0.2, duration: 0.4 }}
      className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"
    >
      <span className="text-brand-orange">{icon}</span>
      <span className="relative">
        {title}
        <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-brand-orange rounded-full"></span>
      </span>
    </motion.h2>
  )
}

function SkillTag({ children, delay = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.3, duration: 0.3 }}
      className="inline-block px-3 py-1.5 bg-gradient-to-r from-brand-orange/10 to-brand-orange-light/10 border border-brand-orange/20 rounded-full text-sm text-gray-700 hover:bg-brand-orange/15 hover:border-brand-orange/40 transition-all cursor-default"
    >
      {children}
    </motion.span>
  )
}

function ProjectCard({ project, index }) {
  const icons = [CheckCircle, Star, CheckCircle, Star]
  const Icon = icons[index % icons.length]

  return (
    <Card delay={0.4 + index * 0.1} className="group">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-800 group-hover:text-brand-orange transition-colors">
          {project.name}
        </h3>
        <span className="w-2 h-2 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity"></span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
      <ul className="space-y-1">
        {project.details.map((detail, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 + i * 0.05 }}
            className="text-xs text-gray-500 flex items-start gap-1.5"
          >
            <Icon size={12} className="text-brand-orange mt-0.5 flex-shrink-0" />
            <span>{detail}</span>
          </motion.li>
        ))}
      </ul>
    </Card>
  )
}

export default function App() {
  return (
    <div className="min-h-screen py-8 px-4">
      {/* A4 Container */}
      <div className="a4-container">
        {/* A4 Background Decorations */}
        <div className="a4-bg-decoration a4-bg-decoration--top-right"></div>
        <div className="a4-bg-decoration a4-bg-decoration--bottom-left"></div>
        <div className="a4-grid-pattern"></div>
        <div className="a4-header-decoration"></div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 pb-6 border-b-2 border-gray-100"
        >
          {/* Avatar */}
          <div className="mx-auto w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center shadow-lg">
            <User size={40} className="text-white" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display tracking-tight">
            {personalInfo.name}
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <p className="text-xl text-brand-orange font-medium">{personalInfo.title}</p>
            <span className="text-gray-300">|</span>
            <p className="text-lg text-gray-600 font-medium">
              ¥{personalInfo.salary}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <motion.a
              href={`tel:${personalInfo.phone}`}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 hover:text-brand-orange transition-colors"
            >
              <Phone size={16} />
              <span>{personalInfo.phone}</span>
            </motion.a>
            <motion.a
              href={`mailto:${personalInfo.email}`}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 hover:text-brand-orange transition-colors"
            >
              <Mail size={16} />
              <span>{personalInfo.email}</span>
            </motion.a>
            <span className="flex items-center gap-1.5">
              <MapPin size={16} />
              <span>{personalInfo.location}</span>
            </span>
            <motion.a
              href={personalInfo.github}
              target="_blank"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 hover:text-brand-orange transition-colors"
            >
              <Github size={16} />
              <span>github.com/wxhou</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* About Me */}
            <Card delay={0.1}>
              <SectionTitle icon={<User size={18} />} title="关于我" delay={0.1} />
              <div className="space-y-2">
                {evaluations.map((evalText, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-gray-600 text-sm flex items-start gap-2"
                  >
                    <ChevronRight size={14} className="text-brand-orange mt-1 flex-shrink-0" />
                    <span>{evalText}</span>
                  </motion.p>
                ))}
              </div>
            </Card>

            {/* Education */}
            <Card delay={0.2}>
              <SectionTitle icon={<GraduationCap size={18} />} title="教育背景" delay={0.2} />
              <div>
                <h3 className="font-semibold text-gray-800">{personalInfo.education.school}</h3>
                <p className="text-gray-600 text-sm">{personalInfo.education.major} · {personalInfo.education.degree}</p>
              </div>
            </Card>

            {/* Skills - AI */}
            <Card delay={0.3}>
              <SectionTitle icon={<Cpu size={18} />} title="AI技能" delay={0.3} />
              <div className="flex flex-wrap gap-2">
                {skills.ai.map((skill, index) => (
                  <SkillTag key={skill} delay={index * 0.05}>{skill}</SkillTag>
                ))}
              </div>
            </Card>

            {/* Skills - Backend */}
            <Card delay={0.35}>
              <SectionTitle icon={<Code size={18} />} title="后端开发" delay={0.35} />
              <div className="flex flex-wrap gap-2">
                {skills.backend.map((skill, index) => (
                  <SkillTag key={skill} delay={index * 0.05}>{skill}</SkillTag>
                ))}
              </div>
            </Card>

            {/* Skills - Automation */}
            <Card delay={0.45}>
              <SectionTitle icon={<Zap size={18} />} title="自动化测试" delay={0.45} />
              <div className="flex flex-wrap gap-2">
                {skills.automation.map((skill, index) => (
                  <SkillTag key={skill} delay={index * 0.05}>{skill}</SkillTag>
                ))}
              </div>
            </Card>

            {/* Skills - Basic */}
            <Card delay={0.5}>
              <SectionTitle icon={<Package size={18} />} title="基础技能" delay={0.5} />
              <div className="flex flex-wrap gap-2">
                {skills.basic.map((skill, index) => (
                  <SkillTag key={skill} delay={index * 0.05}>{skill}</SkillTag>
                ))}
              </div>
            </Card>

            {/* Blog */}
            <Card delay={0.55}>
              <SectionTitle icon={<BookOpen size={18} />} title="个人博客" delay={0.55} />
              <div className="space-y-3">
                <motion.a
                  href="https://www.cnblogs.com/wxhou"
                  target="_blank"
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-orange transition-colors"
                >
                  <Link size={14} />
                  <span>博客园</span>
                </motion.a>
                <motion.a
                  href="https://gitee.com/wxhou"
                  target="_blank"
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-orange transition-colors"
                >
                  <Link size={14} />
                  <span>Gitee</span>
                </motion.a>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Experience */}
            <Card delay={0.15}>
              <SectionTitle icon={<Briefcase size={18} />} title="工作经历" delay={0.15} />
              <div className="relative pl-4 border-l-2 border-brand-orange/30">
                {experience[0].roles.map((role, index) => (
                  <motion.div
                    key={role.title}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.15 }}
                    className="relative mb-4 last:mb-0"
                  >
                    <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-orange border-2 border-white"></span>
                    <h3 className="font-semibold text-gray-800">{role.title}</h3>
                    <p className="text-sm text-brand-orange-dark font-medium">{experience[0].company}</p>
                    <p className="text-xs text-gray-500">{role.period}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Projects */}
            <div>
              <SectionTitle icon={<Rocket size={18} />} title="项目经验" delay={0.2} />
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <ProjectCard key={project.name} project={project} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-6 border-t border-gray-100 text-center"
        >
          <div className="flex justify-center gap-4 mb-4">
            <motion.a
              href={`tel:${personalInfo.phone}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-brand-orange text-white rounded-full font-medium text-sm hover:bg-brand-orange-dark transition-colors shadow-md hover:shadow-lg"
            >
              Contact Me
            </motion.a>
            <motion.a
              href={`mailto:${personalInfo.email}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors"
            >
              Send Email
            </motion.a>
          </div>
          <p className="text-xs text-gray-400">
            © 2026 {personalInfo.name}. Built with care.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
