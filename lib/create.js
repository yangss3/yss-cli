const fs = require('fs-extra')
const path = require('path')
const ora = require('ora')
const chalk = require('chalk')
const spinner = ora()
const download = require('./utils/download')
const initDistDir = require('./utils/initDistDir')
const childProcess = require('child_process')
const util = require('util')
const exec = util.promisify(childProcess.exec)
const { log } = console

module.exports = async function create(projectName) {
  const isCurrentDir = ['.', './'].includes(projectName)
  try {
    const dist = await initDistDir(projectName)

    log(`Creating project in ${chalk.yellow(dist)}.`)
    spinner.start('Generating project template...')
    await download('yangss3/weather-cli', dist)
    spinner.succeed('Generate template completed!')

    const packageJson = path.join(dist, 'package.json')
    const jsonObj = await fs.readJson(packageJson)
    jsonObj.name = dist.split(path.sep).pop()
    jsonObj.version = '0.1.0'
    await fs.outputJson(packageJson, jsonObj)

    spinner.start('Install dependencies... ')
    await exec(`cd ${dist} & npm install`)
    spinner.succeed('Install dependencies Completed!')

    log()
    log(`Get started:\n`)
    if (!isCurrentDir) {
      log(`     ${chalk.whiteBright(`cd ${projectName}`)}`)
    }
    log(`     ${chalk.whiteBright('npm run serve')}`)
    log()

  } catch (error) {
    spinner.fail('failed')
    process.exit(1)
  }
}