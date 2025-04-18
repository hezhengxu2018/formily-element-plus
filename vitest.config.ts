import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    css: true,
    coverage: {
      provider: 'istanbul',
      reporter: ['clover', 'json', 'html'],
      include: ['src'],
    },
    browser: {
      provider: 'playwright', // or 'webdriverio'
      enabled: true,
      name: 'chromium', // browser name is required
    },
  },
}))
