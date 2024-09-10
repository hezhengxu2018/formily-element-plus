import { computed } from 'vue'
import { useData } from 'vitepress'

import { useLang } from './lang'

export function useNav() {
  const { theme } = useData()
  const lang = useLang()

  return computed(() => {
    return theme.value.nav[lang.value]
  })
}
