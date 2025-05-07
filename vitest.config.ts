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
      provider: 'playwright',
      enabled: true,
      instances: [{ browser: 'chromium' }],
    },
  },
}))
