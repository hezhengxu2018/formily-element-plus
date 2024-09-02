import { computed } from 'vue'
import { useData } from 'vitepress'
import { ensureStartingSlash } from '../utils'
// import { useLang } from './lang'

export function useSidebar() {
  // const route = useRoute()
  const { theme, page } = useData()
  // const lang = useLang()
  if (!page.value) {
    return {
      sidebar: computed(() => []),
      hasSidebar: computed(() => false),
    }
  }
  const sidebar = computed(() => {
    if (page.value.frontmatter.sidebar === false)
      return []
    return theme.value.sidebar
  })

  return {
    sidebar: sidebar.value['/guide/'],
    hasSidebar: sidebar.value,
  }
}

export function isSideBarConfig(sidebar) {
  return sidebar === false || sidebar === 'auto' || Array.isArray(sidebar)
}
export function isSideBarGroup(item) {
  return item.children !== undefined
}
export function isSideBarEmpty(sidebar) {
  return Array.isArray(sidebar) ? sidebar.length === 0 : !sidebar
}

interface SidebarItem {
  text: string
  link: string
}

type SidebarConfig = SidebarItem[]

type Sidebar =
  | {
    [key: string]: SidebarConfig
  }
  | false
  | 'auto'

export function getSidebarConfig(sidebar: Sidebar, path: string, lang: string) {
  if (sidebar === false || Array.isArray(sidebar) || sidebar === 'auto') {
    return []
  }

  path = ensureStartingSlash(path)
  for (const dir in sidebar) {
    // make sure the multi sidebar key starts with slash too
    if (path.startsWith(ensureStartingSlash(`${lang}${dir}`))) {
      return sidebar[dir][lang]
    }
  }
  return []
}

export function getFlatSideBarLinks(sidebar) {
  let links: SidebarItem[] = []
  for (const item of sidebar) {
    if (item.link) {
      links.push({ text: item.text, link: item.link })
    }
    if (isSideBarGroup(item)) {
      links = [...links, ...getFlatSideBarLinks(item.children)]
    }
  }
  return links
}
