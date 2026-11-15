import { ViteReactSSG } from 'vite-react-ssg'
import { Navigate } from 'react-router-dom'
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import ResumePage from './pages/ResumePage.jsx'
import './index.css'

export const createRoot = ViteReactSSG({
  routes: [
    {
      path: '/',
      element: <App />,
      entry: 'src/App.jsx',
      children: [
        { path: '/', element: <HomePage />, entry: 'src/pages/HomePage.jsx' },
        { path: '/resume', element: <ResumePage />, entry: 'src/pages/ResumePage.jsx' },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ],
})
