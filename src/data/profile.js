// 首页与简历共用的公开资料；真正的简历私有数据在 resume.js（仅加密脚本引用）
export const personalInfo = {
  name: 'Bigger蓝莓',
  title: 'AI应用工程师 / FDE',
  email: 'hooupythonic@gmail.com',
  github: 'https://github.com/wxhou',
  education: {
    school: '陕西职业技术学院',
    major: '工程造价',
    degree: '大专'
  }
}

// 简历页用真名；name 是站点品牌（首页、站点导航），两者不同
export const resumeName = '侯伟轩'

export const skills = {
  ai: ['AI编程', 'LangChain', 'LangGraph', 'Dify', 'Prompt工程', 'RAG技术', 'AI Agent', 'MCP'],
  backend: ['FastAPI', 'Flask', 'RESTful API', 'Linux', 'SQL'],
  automation: ['Python + Requests', 'Selenium', 'Airtest', 'Locust', 'Jmeter'],
  basic: ['Python', 'Git']
}

export const personalLinks = [
  { name: '博客园', url: 'https://www.cnblogs.com/wxhou' },
  { name: 'Gitee', url: 'https://gitee.com/wxhou' },
  { name: 'OpenSpec Playwright', url: 'https://openspec-playwright.pages.dev/' },
]
