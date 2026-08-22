import { ViteReactSSG } from 'vite-react-ssg'
import { Navigate } from 'react-router-dom'
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import './index.css'

export const createRoot = ViteReactSSG({
  routes: [
    {
      path: '/',
      element: <App />,
      entry: 'src/App.jsx',
      children: [
        { path: '/', element: <HomePage />, entry: 'src/pages/HomePage.jsx' },
        // 简历暂时隐藏：直达 /resume 一律回首页。
        // 恢复时：删除下面这行，启用被注释的原路由与 import 即可。
        { path: '/resume', element: <Navigate to="/" replace /> },
        // { path: '/resume', element: <ResumePage />, entry: 'src/pages/ResumePage.jsx' },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ],
})
