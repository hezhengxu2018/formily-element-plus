import path from 'node:path'
// import fs from 'fs-extra'
// import glob from 'glob'
import { rimraf } from 'rimraf'
// import { execa } from 'execa'
// import { cwd } from './constants'
import { buildRootStyle } from './build-root-style'
import { copyStyleFiles } from './copy-style-files'
import { buildLibrary } from './build-library'
// import { buildUmd } from './build-umd'
// import { fixDepsPaths } from './fix-deps-paths'

async function cleanupPackage(pattern: string) {
  return await rimraf(path.resolve(`${pattern}/{esm,lib,dist}`))
}

const buildPackage = async () => {
  await buildRootStyle()
  await copyStyleFiles()
  await buildLibrary()
  // await buildUmd()
  // await fixDepsPaths()
}

const buildPackages = async () => {
  await buildPackage()
}

export const build = async () => {
  await cleanupPackage('.')
  await buildPackages()
}

build()
