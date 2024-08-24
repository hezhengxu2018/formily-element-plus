import { glob } from 'glob'
import path from 'node:path'
import fs from 'fs-extra'
import { cwd } from './constants'

const createStyleFile = (files: string[]) => {
  return `// auto generated code
${files
  .map((path) => {
    return `import '${path}'\n`
  })
  .join('')}`
}

export const buildRootStyle = () => {
  return new Promise((resolve, reject) => {
    glob('./**/*/style.{less,scss,sass}', {
      cwd: path.resolve(cwd, './src'),
    })
      .then(async (files) => {
        if (files.length === 0) return resolve(0)
        await fs.writeFile(
          path.resolve(cwd, './src/style.ts'),
          createStyleFile(files),
          'utf8',
        )
        resolve(0)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
