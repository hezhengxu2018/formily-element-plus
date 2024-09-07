import fs from 'node:fs'
import path from 'node:path'

export const languages = fs.readdirSync(path.resolve(__dirname, '../crowdin'))

export const ensureLang = (lang: string) => `/${lang}`

export function getLang(id: string) {
  return path.relative('..', id).split(path.sep)[2]
}
