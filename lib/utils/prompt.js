const inquirer = require('inquirer')

exports.confirmPrompt = async function (msg) {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: msg
    }
  ])
  return confirm
}

exports.selectPrompt = async function () {
  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Please select a template?',
      choices: [
        {
          name: 'mobile',
          value: 'github:yangss3/weather-cli'
        },
        {
          name: 'pc',
          value: 'github:yangss3/echarts-vue-components'
        }
      ],
    }
  ])
  return template
}

