// ─── Resume Data ───────────────────────────────────────────
export const personalInfo = {
  name: 'Bigger蓝莓',
  title: 'AI应用工程师',
  email: 'hooupythonic@gmail.com',
  github: 'https://github.com/wxhou',
  education: {
    school: '陕西职业技术学院',
    major: '工程造价',
    degree: '大专'
  }
}

export const skills = {
  ai: ['AI编程', 'LangChain', 'LangGraph', 'Dify', 'Prompt工程', 'RAG技术', 'AI Agent', 'MCP'],
  backend: ['FastAPI', 'Flask', 'RESTful API', 'Linux', 'SQL'],
  automation: ['Python + Requests', 'Selenium', 'Airtest', 'Locust', 'Jmeter'],
  basic: ['Python', 'Git']
}

export const experience = [
  {
    company: '西安云景智维科技有限公司',
    roles: [
      { title: 'AI应用工程师', period: '2025 – 至今', active: true },
      { title: '项目经理', period: '2020 – 2024', active: false },
      { title: '测试开发工程师', period: '2018.11 – 2019', active: false }
    ]
  }
]

// 工作项目（简历页展示，公司项目）
export const workProjects = [
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

export const evaluations = [
  '做人真诚，做事认真负责',
  '进取务实，善于学习自我感兴趣的知识和事物，敢于主动承担自我的职责',
  '细节决定成败'
]

export const personalLinks = [
  { name: '博客园', url: 'https://www.cnblogs.com/wxhou' },
  { name: 'Gitee', url: 'https://gitee.com/wxhou' },
  { name: 'OpenSpec Playwright', url: 'https://wxhou.github.io/openspec-playwright/' },
]
