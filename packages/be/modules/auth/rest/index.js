// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Fs = require('fs')
const Path = require('path')

// ///////////////////////////////////////////// Import SubModule REST Endpoints
// -----------------------------------------------------------------------------
try {
  const submodules = ['github']
  const submodulePath = Path.resolve(__dirname, '..')
  submodules.forEach((submodule) => {
    const endpointsPath = Path.resolve(submodulePath, submodule, 'rest')
    if (Fs.existsSync(endpointsPath)) {
      const endpoints = Fs.readdirSync(endpointsPath)
      endpoints.forEach((name) => {
        if (name.split('.js').length === 2) {
          require(Path.resolve(endpointsPath, name))
        }
      })
    }
  })
} catch (e) {
  console.log(e)
}
