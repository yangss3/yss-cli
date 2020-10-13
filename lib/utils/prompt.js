const inquirer = require('inquirer')

exports.confirmPrompt = async function (msg, dft = true) {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      default: dft,
      message: msg
    }
  ])
  return confirm
}

exports.selectFeaturesPrompt = async function () {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Please select a template:',
      choices: [
        {
          name: 'mobile',
          value: 'mobile'
        },
        {
          name: 'pc',
          value: 'pc'
        }
      ]
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'Check the features needed for your project:',
      choices: [
        {
          name: 'TypeScript',
          value: 'ts'
        },
        {
          name: 'Tailwind CSS',
          value: 'tailwindcss'
        },
        {
          name: 'Mock HTTP request',
          value: 'mock'
        },
        {
          name: 'I18n',
          value: 'i18n'
        }
      ]
    }
  ])
  return answer
}
