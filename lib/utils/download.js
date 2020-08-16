const download = require('download-git-repo')

module.exports = function (repository, dist) {
  return new Promise((resolve, reject) => {
    download(repository, dist, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}