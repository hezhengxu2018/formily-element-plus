import { defineConfig } from 'vitepress'
import { sidebar } from './config/sidebar'
import { mdPlugin } from './config/markdown-plugin'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Formily Element Plus',
  description: 'Element Plus 的 Formily 封装',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  locales: {
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
    },
  },
  markdown: {
    config: md => mdPlugin(md),
  },
})
