const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const ora = require('ora')
const spinner = ora()
const { confirmPrompt } = require('./prompt')

// async function removing(removePromise, dist) {}

module.exports = async function (projectName) {
  const isCurrentDir = projectName === '.' || projectName === './'
  const dist = path.resolve(process.cwd(), projectName)
  let answer
  if (isCurrentDir) {
    answer = await confirmPrompt('Generate project in current directory?')
    if (!answer) process.exit(0)
  } else if (fs.existsSync(dist)) {
    answer = await confirmPrompt(
      `Target directory ${chalk.cyan(dist)} already exists. Continue?`
    )
    if (answer) {
      spinner.start(`Removing ${chalk.cyan(dist)}...`)
      await fs.remove(dist)
      spinner.stop()
    } else {
      process.exit(0)
    }
  }
  return dist
}
