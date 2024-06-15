const simpleGit = require('simple-git')
const fs = require('fs')
const { promisify } = require('util')
const path = require('path')
const semver = require('semver')
const json = require(packagePath)

const packagePath = path.join(process.cwd(), 'package.json')

const gitOptions = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
}

const git = simpleGit(gitOptions)
const writeFile = promisify(fs.writeFile)

function savePackage() {
  writeFile(packagePath, JSON.stringify(json, null, 2))
}

function updateVersion() {
  try {
    if (json.version) {
      const version = semver.parse(json.version)
      version.inc('minor')
      json.version = version.toString()
      savePackage()
      git.add('package.json')
      process.exit(0)
    }
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

updateVersion()
