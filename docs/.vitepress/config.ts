import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import mdContainer from 'markdown-it-container'
import type MarkdownIt from 'markdown-it'
import externalLinkIcon from './plugins/external-link-icon'
import tableWrapper from './plugins/table-wrapper'
import tooltip from './plugins/tooltip'
import tag from './plugins/tag'
import headers from './plugins/headers'
import createDemoContainer from './plugins/demo'
import { ApiTableContainer } from './plugins/api-table'

export function mdPlugin(md: MarkdownIt) {
  md.use(headers)
  md.use(externalLinkIcon)
  md.use(tableWrapper)
  md.use(tooltip)
  md.use(tag)
  md.use(mdContainer, 'demo', createDemoContainer(md))
  md.use(ApiTableContainer)
}

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

    sidebar: generateSidebar({
      documentRootPath: 'docs',
      scanStartPath: './zh-CN/guide/',
      resolvePath: '/zh-CN/guide/',
      rootGroupLink: '/zh-CN/guide/',
      rootGroupText: 'Guide',
      includeFolderIndexFile: true,
      useTitleFromFileHeading: true,
    }),

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
