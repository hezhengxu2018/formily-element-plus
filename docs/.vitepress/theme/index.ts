import ElementPlus, {
  ID_INJECTION_KEY,
  ZINDEX_INJECTION_KEY,
} from 'element-plus'

import type { Theme } from 'vitepress'
import { define } from '../utils/types'
import VPApp, { NotFound, globals } from './app'
import 'uno.css'
import './style.css'

export default define<Theme>({
  NotFound,
  Layout: VPApp,
  enhanceApp: ({ app }) => {
    app.use(ElementPlus)
    app.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 })
    app.provide(ZINDEX_INJECTION_KEY, { current: 0 })

    for (const [name, Comp] of globals) {
      app.component(name, Comp)
    }
  },
})
