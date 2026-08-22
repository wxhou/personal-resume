import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  ssgOptions: {
    // 简历暂时隐藏：SSG 不再生成 /resume 静态页。
    // 恢复时改回 ['/', '/resume'] 并按 src/main.jsx 注释恢复路由与 import
    includedRoutes: async () => ['/'],
    dirStyle: 'nested',
  },
})
