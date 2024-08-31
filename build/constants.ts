import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
import type { IBuilderConfig } from './types'
import { getConfigs } from './shared'

export const cwd = process.cwd()

export const entry = path.resolve(cwd, 'src/index.ts')

const configs = await getConfigs('builder.config')

export const builderConfigs: IBuilderConfig
  = configs?.BuilderConfig ?? configs ?? {}

const pkg = fs.readJSONSync(path.resolve(cwd, 'package.json'))

export { pkg }
