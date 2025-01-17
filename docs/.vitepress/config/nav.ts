import navLocale from '../i18n/pages/sidebar.json'
import { ensureLang } from '../utils/lang'

// Mapping the first sub link to the nav link to avoid 404 error.

function getNav(locale = 'zh-CN') {
  return Object.fromEntries(
    Object.entries(navLocale).map(([lang, locales]) => {
      const item: {
        link: string
        text: string
        activeMatch?: string
      }[] = Object.values(locales).map(item => ({
        ...item,
        link: `${ensureLang(lang)}${item.link}`,
      }))

      return [lang, item]
    }),
  )[locale]
}

export const nav = getNav()
