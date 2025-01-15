import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/rollup'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { pkg } from './build/constants'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: (format, fileName) => {
        const extension = format === 'cjs' ? 'js' : 'mjs'
        return `${fileName}.${extension}`
      },
    },
    outDir: './esm',
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      external: Object.keys(pkg.peerDependencies).concat(Object.keys(pkg.dependencies)),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        assetFileNames: 'styles/[name][extname]',
      },
      treeshake: {
        moduleSideEffects: (id) => {
          if (id.includes('@formily/shared')) {
            return false
          }
          return true
        },
      },
    },
  },
  plugins: [
    libInjectCss(),
    dts({
      outDir: ['./esm'],
    }),
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vue: vue({
          isProduction: true,
        }),
        vueJsx: vueJsx(),
      },
    }),
  ],
})
