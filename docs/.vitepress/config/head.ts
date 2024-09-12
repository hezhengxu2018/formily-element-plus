import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { HeadConfig } from 'vitepress'
import { languages } from '../utils/lang'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const head: HeadConfig[] = [
  ['link', { rel: 'icon', href: '/favicon.svg' }],
  [
    'meta',
    {
      name: 'theme-color',
      content: '#ffffff',
    },
  ],
  [
    'meta',
    {
      name: 'msapplication-TileColor',
      content: '#409eff',
    },
  ],
  [
    'meta',
    {
      property: 'og:description',
      content: 'A Vue 3 based component library for designers and developers',
    },
  ],
  [
    'script',
    {},
    `;(() => {
      window.supportedLangs = ${JSON.stringify(languages)}
    })()`,
  ],

  ['script', {}, fs.readFileSync(path.resolve(__dirname, '..', 'lang.js'), 'utf8')],
]

head.push([
  'script',
  {},
  fs.readFileSync(path.resolve(__dirname, '..', 'dark-mode.js'), 'utf8'),
])
