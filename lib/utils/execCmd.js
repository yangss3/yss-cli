const path = require('path')
const childProcess = require('child_process')
const util = require('util')
const exec = util.promisify(childProcess.exec)

module.exports = function (cmd, execPath = '') {
  execPath = path.resolve(process.env.DIST, execPath)
  return exec(`cd ${execPath} & ${cmd}`)
}
