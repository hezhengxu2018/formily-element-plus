import { defineConfig } from 'vitepress'
import { sidebar } from './config/sidebar'
import { nav } from './config/nav'
import { head } from './config/head'
import { mdPlugin } from './config/markdown-plugin'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Formily Element Plus',
  description: 'Element Plus 的 Formily 封装',
  head,
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
    },
  },
  locales: {
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        sidebar,
        nav,
      },
    },
  },
  markdown: {
    config: md => mdPlugin(md),
  },
})
