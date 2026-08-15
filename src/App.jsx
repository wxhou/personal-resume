import { Outlet } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import SiteNav from './components/SiteNav.jsx'
import './app-nav.css'

// SSG 渲染时禁用动画（输出最终可见态），运行时尊重系统 reduced-motion 偏好
const reducedMotion = typeof window === 'undefined' ? 'always' : 'user'

export default function App() {
  return (
    <MotionConfig reducedMotion={reducedMotion}>
      <SiteNav />
      <Outlet />
    </MotionConfig>
  )
}
