import path from 'node:path'
// import fs from 'fs-extra'
// import glob from 'fast-glob'
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

async function buildPackage() {
  await buildRootStyle()
  await copyStyleFiles()
  await buildLibrary()
  // await buildUmd()
  // await fixDepsPaths()
}

async function buildPackages() {
  await buildPackage()
}

export async function build() {
  await cleanupPackage('.')
  await buildPackages()
}

build()
