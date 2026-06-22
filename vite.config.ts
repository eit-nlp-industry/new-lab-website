import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // 本地开发默认走内网测试 Directus（HTTP），避免 idt.eitech.edu.cn HTTPS 证书校验失败
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://10.37.0.21:7000'

  return {
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    port: 3001,
    proxy: {
      '/nlp-api': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  }
})
