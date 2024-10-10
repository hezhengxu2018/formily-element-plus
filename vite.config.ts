/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  base: '.',
  plugins: [vue(), vueJsx()],
  test: {
    css: true,
    browser: {
      provider: 'playwright', // or 'webdriverio'
      enabled: true,
      name: 'chromium', // browser name is required
    },
  },
})
