const os = require('os')
const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { confirmPrompt, selectFeaturesPrompt } = require('./prompt')

const configPath = path.resolve(os.homedir(), '.yssclirc')

async function saveAsPreset (features) {
  const confirm = await confirmPrompt(
    'Save this as a preset for future projects?',
    false
  )

  if (confirm) {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Save preset as:',
        validate: val => !!val
      }
    ])

    let configObj = {}
    try {
      const configStr = await fs.readFile(configPath)
      configObj = JSON.parse(configStr)
      if (configObj.presets) {
        configObj.presets[name] = features
      } else {
        configObj.presets = {
          [name]: features
        }
      }
    } catch (error) {
      configObj.presets = {
        [name]: features
      }
    }
    await fs.writeFile(configPath, JSON.stringify(configObj, null, '\t'))
  }
}

module.exports = async () => {
  let features
  try {
    const configStr = await fs.readFile(configPath)
    const configObj = JSON.parse(configStr)
    if (configObj.presets) {
      const presets = []
      Object.keys(configObj.presets).forEach(key => {
        const feat = chalk.yellowBright(`(${configObj.presets[key].join(', ')})`)
        presets.push({
          name: `${key} ${feat}`,
          value: configObj.presets[key]
        })
      })

      presets.push({
        name: 'Manually select features',
        value: false
      })

      const { preset } = await inquirer.prompt({
        type: 'list',
        name: 'preset',
        message: 'Please pick a preset:',
        choices: presets
      })

      if ( preset ) {
        features = preset
      }
    }
  } catch (error) {}

  if (!features) {
    const answer = await selectFeaturesPrompt()
    features = [answer.template, ...answer.features]
    await saveAsPreset(features)
  }
  return features
}