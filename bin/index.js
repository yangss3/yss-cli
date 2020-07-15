#!/usr/bin/env node
const { program } = require('commander')

program
  .version(require('../package.json').version)
  .usage('<command> [options]')

program
  .command('create <projectName>')
  .description('Create a project template')
  .action((projectName) => {
    require('../lib/create')(projectName)
  })


program.parse(process.argv)