module.exports = async function (features, dist) {
  const tasks = []
  if (features.includes('mock')) {
    // configure http mocking
    tasks.push(require('./mockHttp')(dist))
  }
  if (features.includes('mpa')) {
    // configure MPA
  }
  await Promise.all(tasks)
}
