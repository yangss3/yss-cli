#!/usr/bin/env node
const { program } = require('commander')

program
  .version(`yss-cli v${require('../package.json').version}`, '-v, --version')
  .name('yss')
  .usage('<command> [options]')

program
  .command('create <projectName>')
  .description('Create a project template')
  .action(projectName => {
    require('../lib/create')(projectName)
  })

require('../lib/utils/enhanceErrorMessages')()

program.parse(process.argv)
