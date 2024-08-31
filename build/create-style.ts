import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import fs from 'fs-extra'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const files = await glob('../src/*/style.scss', {
  cwd: path.resolve(__dirname, '../src'),
})

fs.writeFile(
  path.resolve(__dirname, '../src/style.ts'),
  `// auto generated code
${files
    .map((path) => {
      return `import '${path}'\n`
    })
    .join('')}`,
  'utf8',
)
