const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const ora = require('ora')
const spinner = ora()
const { confirmPrompt } = require('./prompt')

async function removing(removePromise) {
  spinner.start('removing...')
  await removePromise
  spinner.stop()
}

module.exports = async function (projectName) {
  const isCurrentDir = ['.', './'].includes(projectName)
  const dist = path.resolve(process.cwd(), projectName)
  if (isCurrentDir) {
    const files = await fs.readdir(dist)
    if (files.length) {
      await confirmPrompt('Current directory is not empty, continue?')
        ? await removing(Promise.all(files.map(f => fs.remove(path.join(dist, f)))))
        : process.exit(1)
    }
  } else if (fs.existsSync(dist)) {
    await confirmPrompt(`${chalk.yellow(dist)} already exists, continue?`)
      ? await removing(fs.remove(dist))
      : process.exit(1)
  }
  return dist
}