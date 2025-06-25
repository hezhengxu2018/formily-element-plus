import path from 'node:path'

export const languages = ['zh-CN']

export const ensureLang = (lang: string) => `/${lang}`

export function getLang(id: string) {
  return path.relative('..', id).split(path.sep)[2]
}
