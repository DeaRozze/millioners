
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  base: '/',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
           @use "@/assets/styles/variables" as *;
        `,
      },
    },
  },
})
