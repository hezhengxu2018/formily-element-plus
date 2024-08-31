import path from 'node:path'
import { cwd } from './constants'

export async function getConfigs(name: string) {
  try {
    const module = await import(path.resolve(cwd, name))
    return module.default
  }
  catch {
    return {} as any
  }
}
