import { isExternal } from 'vitepress/dist/client/shared'

export * from './colors'

export { isActive, isExternal } from 'vitepress/dist/client/shared'
export { ensureStartingSlash } from 'vitepress/dist/client/theme-default/support/utils'

const endingSlashRE = /\/$/
export function utoa(data: string): string {
  return btoa(unescape(encodeURIComponent(data)))
}

export function throttleAndDebounce(fn: () => any, delay: number) {
  let timeout: ReturnType<typeof setTimeout>
  let called = false
  return () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    if (called) {
      timeout = setTimeout(fn, delay)
    }
    else {
      fn()
      called = true
      setTimeout(() => {
        called = false
      }, delay)
    }
  }
}

export function createGitHubUrl(
  docsRepo: string,
  docsDir: string,
  docsBranch: string,
  path: string,
  folder = 'examples/',
  ext = '.vue',
) {
  const base = isExternal(docsRepo)
    ? docsRepo
    : `https://github.com/${docsRepo}`
  return `${base.replace(endingSlashRE, '')}/edit/${docsBranch}/${
    docsDir ? `${docsDir.replace(endingSlashRE, '')}/` : ''
  }${folder || ''}${path}${ext || ''}`
}

export function createCrowdinUrl(targetLang: string) {
  let translateLang = ''
  // for zh-CN zh-HK zh-TW, maybe later we will have cases like Chinese lang
  // for now we just keep it as simple as possible.
  translateLang = targetLang.startsWith('zh-') ? targetLang.split('-').join('').toLocaleLowerCase() : targetLang.split('-').shift()!.toLocaleLowerCase()
  return `https://crowdin.com/translate/element-plus/all/en-${translateLang}`
}
