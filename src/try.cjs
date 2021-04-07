const pkgDir = require('pkg-dir')
const fs = require('fs')

;(async () => {
  const rootDir = await pkgDir(__dirname)
  fs.writeFileSync('serves.json', JSON.stringify([{a: 1}]))
})()
