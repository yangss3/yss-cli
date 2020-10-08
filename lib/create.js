const fs = require('fs-extra')
const path = require('path')
const spinner = require('ora')()
const chalk = require('chalk')
const download = require('./utils/download')
const initDistDir = require('./utils/initDistDir')
const execCmd = require('./utils/execCmd')
const { log } = console
const getFeatures = require('./utils/presets')

module.exports = async function create(projectName) {
  const isCurrentDir = projectName === '.' || projectName === './'
  try {
    // 初始化目标目录
    const dist = await initDistDir(projectName)
    process.env.DIST = dist

    // 选择 features
    const features = await getFeatures()
    const repo = `github:yangss3/vue-project-template#${features.join('-')}`

    // 生成模板
    log(`  Creating project in ${chalk.yellowBright(dist)}.`)
    spinner.start('Generating project template...')
    await download(repo, dist)
    spinner.succeed('Generate project template complete.')

    const packageJson = path.join(dist, 'package.json')
    const jsonObj = await fs.readJson(packageJson)
    jsonObj.name = dist.split(path.sep).pop()
    jsonObj.version = '0.1.0'
    await fs.outputJson(packageJson, jsonObj)

    // 初始化 git 仓库
    spinner.start('Initializing git repository... ')
    await execCmd('git init')
    spinner.succeed('Initialize git repository complete.')

    // 安装依赖包
    spinner.start('Installing dependencies. This might take a while... ')
    const { stdout } = await execCmd('npm install')
    await execCmd('npm run lint')
    spinner.succeed('Install dependencies complete.')

    log()
    log(stdout)

    log()
    log('  Get started:')
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
