import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  ssgOptions: {
    includedRoutes: async () => ['/', '/resume'],
    dirStyle: 'nested',
  },
})
