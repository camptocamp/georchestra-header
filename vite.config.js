import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: `assets/header.js`,
      },
    },
  },
  server: {
    proxy: {
      '^/(whoami|\\?login|logout)': {
        target: 'https://demo.georchestra.org',
        changeOrigin: true,
      },
    },
  },
})
