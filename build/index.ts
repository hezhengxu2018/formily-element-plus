import path from 'node:path'
import { rimraf } from 'rimraf'
import { buildLibrary } from './build-library'
import { copyStyleFiles } from './copy-style-files'

async function cleanupPackage(pattern: string) {
  return await rimraf(path.resolve(`${pattern}/{esm,lib,dist}`))
}

async function buildPackage() {
  await copyStyleFiles()
  await buildLibrary()
}

export async function build() {
  await cleanupPackage('.')
  await buildPackage()
}

await build()
