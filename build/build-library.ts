import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
import { execa } from 'execa'
import { cwd } from './constants'

async function hasBuildConfig() {
  try {
    await fs.access(path.resolve(cwd, 'tsconfig.build.json'))
    return true
  }
  catch {
    return false
  }
}

async function buildDefault(params: string[] = []) {
  const hasProjects = await hasBuildConfig()
  if (hasProjects) {
    params.push('--project', 'tsconfig.build.json', '--sourceRoot', 'lib')
  }
  execa('tsc', params).stdout.pipe(process.stdout)
}

async function buildEsm() {
  await buildDefault([
    '--module',
    'es2015',
    '--outDir',
    'esm',
    '--sourceRoot',
    'esm',
  ])
}

export async function buildLibrary() {
  await buildEsm()
}
