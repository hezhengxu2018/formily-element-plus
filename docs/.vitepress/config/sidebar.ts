import componentLocale from '../i18n/pages/component.json'
import guideLocale from '../i18n/pages/guide.json'
import { ensureLang } from '../utils/lang'

function getGuideSidebar(locale: string = 'zh-CN') {
  return Object.fromEntries(
    Object.entries(guideLocale).map(([lang, val]) => [
      lang,
      Object.values(val).map(item => mapPrefix(item, lang)),
    ]),
  )[locale]
}

function getComponentsSideBar(locale: string = 'zh-CN') {
  return Object.fromEntries(
    Object.entries(componentLocale).map(([lang, val]) => [
      lang,
      Object.values(val).map(item => mapPrefix(item, lang, '/component')),
    ]),
  )[locale]
}

// return sidebar with language configs.
// this might create duplicated data but the overhead is ignorable
function getsidebar() {
  return {
    '/guide/': getGuideSidebar(),
    '/component/': getComponentsSideBar(),
  }
}

interface Item {
  text: string
  children?: Item[]
  link?: string
}

function mapPrefix(item: Item, lang: string, prefix = '') {
  if (item.children && item.children.length > 0) {
    return {
      ...item,
      children: item.children.map(child => mapPrefix(child, lang, prefix)),
    }
  }
  return {
    ...item,
    link: `${ensureLang(lang)}${prefix}${item.link}`,
  }
}

export const sidebar = getsidebar()
