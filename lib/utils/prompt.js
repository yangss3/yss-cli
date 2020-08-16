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
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Please select a template?',
      choices: [
        {
          name: 'mobile',
          value: 'github:yangss3/vue-project-template#mobile'
        },
        {
          name: 'pc',
          value: 'github:yangss3/vue-project-template#pc'
        }
      ]
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'Check the features needed for your project',
      choices: [
        {
          name: 'Mock HTTP request',
          value: 'mock'
        },
        {
          name: 'MPA',
          value: 'mpa'
        }
      ]
    }
  ])
  return answer
}
