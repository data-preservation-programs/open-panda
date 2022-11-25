console.log('📦 [module] rest')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Fs = require('fs')

const MC = require('@Root/config')

// ///////////////////////////////////////////////////////// Import REST Modules
// -----------------------------------------------------------------------------
try {
  const modulesRoot = `${MC.packageRoot}/modules`
  const items = Fs.readdirSync(modulesRoot)
  let modulePath
  let restPath
  items.forEach((name) => {
    modulePath = `${modulesRoot}/${name}`
    if (Fs.statSync(modulePath).isDirectory()) {
      restPath = `${modulePath}/rest`
      if (Fs.existsSync(restPath) && Fs.statSync(restPath).isDirectory()) {
        const endpoints = Fs.readdirSync(restPath)
        endpoints.forEach((name) => {
          if (name.includes('.js')) {
            require(`${restPath}/${name}`)
          }
        })
      }
    }
  })
} catch (e) {
  console.log(e)
}
