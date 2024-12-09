import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'

export const cwd = process.cwd()
export const pkg = fs.readJSONSync(path.resolve(cwd, 'package.json'))
