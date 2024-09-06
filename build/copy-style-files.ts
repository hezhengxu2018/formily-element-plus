import path from 'node:path'
import glob from 'fast-glob'
import fs from 'fs-extra'
import { cwd } from './constants'

export function copyStyleFiles() {
  return new Promise((resolve, reject) => {
    glob('src/**/*.{less,scss,sass,css}')
      .then((files) => {
        for (const filename of files) {
          const filepath = path.resolve(cwd, filename)
          const distPathEs = filepath
            .replace(/src\//, 'esm/')
            .replace(/src\\/, 'esm\\')
          fs.copySync(filepath, distPathEs)
        }
        resolve(0)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
