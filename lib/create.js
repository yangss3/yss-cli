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
const { selectPrompt } = require('./utils/prompt')

module.exports = async function create(projectName) {
  const isCurrentDir = ['.', './'].includes(projectName)
  try {
    const dist = await initDistDir(projectName)

    const template = await selectPrompt()

    log(`  Creating project in ${chalk.yellowBright(dist)}.`)
    spinner.start('Generating project template...')
    await download(template, dist)
    spinner.succeed('Generate project template')

    const packageJson = path.join(dist, 'package.json')
    const jsonObj = await fs.readJson(packageJson)
    jsonObj.name = dist.split(path.sep).pop()
    jsonObj.version = '0.1.0'
    await fs.outputJson(packageJson, jsonObj)

    spinner.start('Installing dependencies. This might take a while... ')
    const { stdout } = await exec(`cd ${dist} & npm install`)
    spinner.succeed('Install dependencies')
    log()
    log(stdout)

    spinner.start('Initializing git repository... ')
    await exec(`cd ${dist} & git init & git add . & git commit -m 'init'`)
    spinner.succeed('Initialize git repository')

    log()
    log(`  Get started:\n`)
    if (!isCurrentDir) {
      log(`     ${chalk.whiteBright(`cd ${projectName}`)}`)
    }
    log(`     ${chalk.whiteBright('npm run serve')}`)
    log()
  } catch (error) {
    log(`\n${chalk.bgRedBright(' ERROR ')} ${chalk.redBright(error)}`)
    spinner.stop()
    process.exit(1)
  }
}
