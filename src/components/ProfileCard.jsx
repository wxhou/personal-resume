import './ProfileCard.css'

// 四行能力剖面：技术栈三行取自简历技能数据，定位算法一行用固定关键词
const CAPABILITIES = [
  {
    title: 'AI 应用工程',
    skillsKey: 'ai',
    proof: '数字人智能体：知识库检索 + 换乘推荐，接入搜索与 TTS 工具链'
  },
  {
    title: '定位算法落地',
    keywords: ['三角定位', '指纹匹配', '卡尔曼滤波', '最小二乘'],
    proof: 'iBeacon 室内定位：算法业务落地与精度优化，Python 数据前后处理'
  },
  {
    title: '后端与平台',
    skillsKey: 'backend',
    proof: '地铁智慧运维平台：技术选型、架构设计与后端接口，支撑持续迭代'
  },
  {
    title: '质量与交付',
    skillsKey: 'automation',
    proof: '2020–2024 任项目经理：主持需求、排期与验收，带队按期交付'
  }
]

// 卡片按 1920×1080 定稿排版，用 transform 缩放到目标宽度
export default function ProfileCard({ data, width }) {
  const { personalInfo, skills, workProjects } = data

  return (
    <div
      className="profile-card-frame"
      style={{ width: `${width}px`, height: `${Math.round(width * 9 / 16)}px` }}
    >
      <div className="profile-card" style={{ transform: `scale(${width / 1920})` }}>
      <div className="profile-card__topbar">
        <span>Professional Profile</span>
        <span><em>能力画像</em> · {new Date().getFullYear()}</span>
        <span>No. 001</span>
      </div>

      <div className="profile-card__cols">
        <section className="profile-card__identity">
          <div className="profile-card__name-row">
            <p className="profile-card__name">{personalInfo.name}</p>
            <span className="profile-card__seal" aria-hidden="true">{personalInfo.name.charAt(0)}</span>
          </div>
          <p className="profile-card__role">
            {personalInfo.title}<span> · 2018 年从业至今</span>
          </p>

          <div className="profile-card__hairline" />

          <p className="profile-card__statement">
            把 AI 能力落成<b>可交付的系统</b>：应用层开发、算法落地、工程化验证，从需求梳理到上线迭代，一条线走完。
          </p>

          <dl className="profile-card__facts">
            <div><dt>PROJECTS</dt><dd><strong>{workProjects.length}</strong> 个交付项目</dd></div>
            <div><dt>ROLES</dt><dd>开发 · 测试 · 项目经理</dd></div>
            <div><dt>TEAM</dt><dd>主持项目会议 · 安排测试开发任务</dd></div>
          </dl>
        </section>

        <section className="profile-card__caps">
          <div className="profile-card__caps-head">
            <span>Capability</span>
            <em>{String(CAPABILITIES.length).padStart(2, '0')}</em>
          </div>

          {CAPABILITIES.map((cap, i) => {
            const keywords = cap.skillsKey ? skills[cap.skillsKey] : cap.keywords
            return (
              <div className="profile-card__row" key={cap.title}>
                <span className="profile-card__idx">{String(i + 1).padStart(2, '0')}</span>
                <div className="profile-card__row-body">
                  <p className="profile-card__row-title">{cap.title}</p>
                  <p className="profile-card__chips">
                    {keywords.map((word, j) => (
                      <span key={word}>
                        {word}
                        {j < keywords.length - 1 && <i>/</i>}
                      </span>
                    ))}
                  </p>
                  <p className="profile-card__proof">{cap.proof}</p>
                </div>
              </div>
            )
          })}
        </section>
      </div>
      </div>
    </div>
  )
}
