#!/usr/bin/env node
const { program } = require('commander')
const enhanceErrorMessages = require('../lib/utils/enhanceErrorMessages')
program
  .version(`yss-cli v${require('../package.json').version}`)
  .name('yss')
  .usage('<command> [options]')

program
  .command('create <projectName>')
  .description('Create a project template')
  .action(projectName => {
    require('../lib/create')(projectName)
  })

enhanceErrorMessages()

program.parse(process.argv)
