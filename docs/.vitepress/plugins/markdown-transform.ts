import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { camelize } from 'vue'
import glob from 'fast-glob'
import type { Plugin } from 'vite'
import { getLang, languages } from '../utils/lang'
import footerLocale from '../i18n/component/footer.json'

type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>

let compPaths: string[]

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projRoot = path.resolve(__dirname, '..', '..', '..')
const docsDirName = 'docs'
const docRoot = path.resolve(projRoot, docsDirName)
export function MarkdownTransform(): Plugin {
  return {
    name: 'element-plus-md-transform',

    enforce: 'pre',

    async buildStart() {
      const pattern = `{${[...languages, languages[0]].join(',')}}/component`

      compPaths = await glob(pattern, {
        cwd: docRoot,
        absolute: true,
        onlyDirectories: true,
      })
    },

    async transform(code, id) {
      if (!id.endsWith('.md'))
        return

      const componentId = path.basename(id, '.md')
      const append: Append = {
        headers: [],
        footers: [],
        scriptSetups: getExampleImports(componentId),
      }

      code = transformVpScriptSetup(code, append)

      if (compPaths.some(compPath => id.startsWith(compPath))) {
        code = transformComponentMarkdown(id, componentId, code, append)
      }

      return combineMarkdown(
        code,
        [combineScriptSetup(append.scriptSetups), ...append.headers],
        append.footers,
      )
    },
  }
}

function combineScriptSetup(codes: string[]) {
  return `\n<script setup>
${codes.join('\n')}
</script>
`
}

function combineMarkdown(code: string, headers: string[], footers: string[]) {
  const frontmatterEnds = code.indexOf('---\n\n')
  const firstHeader = code.search(/\n#{1,6}\s.+/)
  const sliceIndex
    = firstHeader < 0
      ? frontmatterEnds < 0
        ? 0
        : frontmatterEnds + 4
      : firstHeader

  if (headers.length > 0) {
    code
      = code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex)
  }
  code += footers.join('\n')

  return `${code}\n`
}

// eslint-disable-next-line regexp/no-super-linear-backtracking
const vpScriptSetupRE = /<vp-script\s(.*\s)?setup(\s.*)?>([\s\S]*)<\/vp-script>/

function transformVpScriptSetup(code: string, append: Append) {
  const matches = code.match(vpScriptSetupRE)
  if (matches)
    code = code.replace(matches[0], '')
  const scriptSetup = matches?.[3] ?? ''
  if (scriptSetup)
    append.scriptSetups.push(scriptSetup)
  return code
}

function transformComponentMarkdown(id: string, componentId: string, code: string, append: Append) {
  const lang = getLang(id)
  const docUrl = `/${docsDirName}/en-US/component/${componentId}.md`
  const componentUrl = `/packages/components/${componentId}`
  const styleUrl = `/packages/theme-chalk/src/${componentId}.scss`

  const componentPath = path.resolve(
    projRoot,
    `packages/components/${componentId}`,
  )
  const stylePath = path.resolve(
    projRoot,
    `packages/theme-chalk/src/${componentId}.scss`,
  )

  const isComponent = fs.existsSync(componentPath)
  const isHaveComponentStyle = fs.existsSync(stylePath)

  const links = [[footerLocale[lang].docs, docUrl]]

  if (isComponent && isHaveComponentStyle)
    links.unshift([footerLocale[lang].style, styleUrl])

  if (isComponent)
    links.unshift([footerLocale[lang].component, componentUrl])

  const linksText = links
    .filter(Boolean)
    .map(([text, link]) => `[${text}](${link})`)
    .join(' • ')

  const sourceSection = `
## ${footerLocale[lang].source}

${linksText}`

  append.footers.push(sourceSection)

  return code
}

function getExampleImports(componentId: string) {
  const examplePath = path.resolve(docRoot, 'zh-CN/demos/', componentId)
  if (!fs.existsSync(examplePath))
    return []
  const files = fs.readdirSync(examplePath)
  const imports: string[] = []

  for (const item of files) {
    if (!/\.vue$/.test(item))
      continue
    const file = item.replace(/\.vue$/, '')
    const name = camelize(`formily-ep-${componentId}-${file}`)

    imports.push(
      `import ${name} from '../demos/${componentId}/${file}.vue'`,
    )
  }

  return imports
}
