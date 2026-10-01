import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 以 /chaosheng/ 子路径托管，使用相对 base 保证本地与线上一致
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    // 构建产物放 static/，避免与 public/assets（产品图片等静态资源）混淆
    assetsDir: 'static',
    chunkSizeWarningLimit: 1200,
  },
})
