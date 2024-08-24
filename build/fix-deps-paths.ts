import fs from 'fs-extra'
import path from 'node:path'
import { glob } from 'glob'
import { cwd, builderConfigs } from './constants'

const cjsToEs = (contents: string) => {
  return contents.replaceAll(
    new RegExp(
      `${builderConfigs.targetLibName}\\/${builderConfigs.targetLibCjsDir}\\/`,
      'g',
    ),
    `${builderConfigs.targetLibName}/${builderConfigs.targetLibEsDir}/`,
  )
}

const esToCjs = (contents: string) => {
  return contents.replaceAll(
    new RegExp(
      `${builderConfigs.targetLibName}\\/${builderConfigs.targetLibEsDir}\\/`,
      'g',
    ),
    `${builderConfigs.targetLibName}/${builderConfigs.targetLibCjsDir}/`,
  )
}

export const fixDepsPaths = async () => {
  if (
    !builderConfigs.targetLibName ||
    !builderConfigs.targetLibCjsDir ||
    !builderConfigs.targetLibEsDir
  )
    return
  return new Promise((resolve, reject) => {
    glob('{esm,lib}/**/*.{js,ts,less,scss}', { cwd })
      .then((files) => {
        for (const filename of files) {
          const isCjsPath = filename.includes(`lib/`)
          const isEsPath = filename.includes(`esm/`)
          const filepath = path.resolve(cwd, filename)
          const contents = fs.readFileSync(filepath, 'utf8')
          const replaced = isCjsPath
            ? esToCjs(contents)
            : isEsPath
              ? cjsToEs(contents)
              : contents
          fs.writeFileSync(filepath, replaced, 'utf8')
        }
        resolve(0)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
