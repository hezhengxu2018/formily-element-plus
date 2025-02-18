import ElementPlus, {
  ID_INJECTION_KEY,
  ZINDEX_INJECTION_KEY,
} from 'element-plus'
import vitepressNprogress from 'vitepress-plugin-nprogress'
import DefaultTheme from 'vitepress/theme'
import NotFound, { globals } from './app'
import VPSponsors from './components/vp-sponsors.vue'
import 'vitepress-plugin-nprogress/lib/css/index.css'
import 'normalize.css'
import 'element-plus/theme-chalk/src/reset.scss'
import 'element-plus/theme-chalk/src/index.scss'
import 'element-plus/theme-chalk/src/dark/css-vars.scss'
import './styles/css-vars.scss'
import './styles/app.scss'
import 'uno.css'

export default {
  extends: DefaultTheme,
  NotFound,
  enhanceApp(ctx) {
    vitepressNprogress(ctx)
    const app = ctx.app
    app.use(ElementPlus)
    app.component('VPSponsors', VPSponsors)
    app.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 })
    app.provide(ZINDEX_INJECTION_KEY, { current: 0 })

    for (const [name, Comp] of globals) {
      app.component(name, Comp)
    }
  },
}
