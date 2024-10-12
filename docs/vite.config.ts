import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { type Alias, defineConfig } from 'vite'
import VueMacros from 'unplugin-vue-macros/vite'
import UnoCSS from 'unocss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { MarkdownTransform } from './.vitepress/plugins/markdown-transform'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const alias: Alias[] = [
  {
    find: '~/',
    replacement: `${path.resolve(__dirname, './.vitepress/theme')}/`,
  },
  {
    find: '@sliver/formily-element-plus',
    replacement: `${path.resolve(__dirname, '../src')}/`,
  },
  {
    find: /^.*\/VPNav\.vue$/,
    replacement: fileURLToPath(
      new URL('.vitepress/theme/components/vp-nav.vue', import.meta.url),
    ),
  },
  {
    find: /^.*\/VPNavBar\.vue$/,
    replacement: fileURLToPath(
      new URL('.vitepress/theme/components/vp-navbar.vue', import.meta.url),
    ),
  },
  {
    find: /^.*\/VPLocalNav\.vue$/,
    replacement: fileURLToPath(
      new URL('.vitepress/theme/components/vp-subnav.vue', import.meta.url),
    ),
  },
  {
    find: /^.*\/VPDocAside\.vue$/,
    replacement: fileURLToPath(
      new URL('.vitepress/theme/components/doc-content/vp-table-of-content.vue', import.meta.url),
    ),
  },
  // {
  //   find: /^.*\/VPContent\.vue$/,
  //   replacement: fileURLToPath(
  //     new URL('.vitepress/theme/components/vp-content.vue', import.meta.url),
  //   ),
  // },
  {
    find: /^.*\/VPSidebar\.vue$/,
    replacement: fileURLToPath(
      new URL('.vitepress/theme/components/vp-sidebar.vue', import.meta.url),
    ),
  },
]

export default defineConfig(async () => {
  // const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      host: true,
      // https: !!env.HTTPS,
      // fs: {
      //   allow: [projRoot],
      // },
    },
    resolve: {
      alias,
    },
    plugins: [
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        hoistStatic: {
          exclude: ['./**/*.vue'],
        },
        plugins: {
          vueJsx: vueJsx(),
        },
      }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        dirs: ['.vitepress/vitepress/components'],

        allowOverrides: true,

        // custom resolvers
        resolvers: [
          // auto import icons
          // https://github.com/antfu/unplugin-icons
          IconsResolver(),
        ],

        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      }),

      // https://github.com/antfu/unplugin-icons
      Icons({
        autoInstall: true,
      }),
      UnoCSS(),
      MarkdownTransform(),
    ],
  }
})
