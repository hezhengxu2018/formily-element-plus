import path from 'node:path'
import { cwd } from './constants'

export const getConfigs = async (name: string) => {
  try {
    const module = await import(path.resolve(cwd, name))
    return module.default
  } catch {
    return {} as any
  }
}
