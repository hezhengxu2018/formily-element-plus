import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    css: true,
    browser: {
      provider: 'playwright', // or 'webdriverio'
      enabled: true,
      name: 'chromium', // browser name is required
    },
  },
})
