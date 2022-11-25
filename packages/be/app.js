console.log('🖥️  [app] initialization')

// //////////////////////////////////////////////////// Imports + variable setup
// -----------------------------------------------------------------------------
const ModuleAlias = require('module-alias')
const Helmet = require('helmet')
const Fs = require('fs-extra')
const Express = require('express')
require('dotenv').config()

const MC = require('./config')

MC.server = {
  https: require('https'),
  instance: false
}

// ///////////////////////////////////////////////////////////////////// Aliases
ModuleAlias.addAliases({
  '@Root': MC.packageRoot,
  '@Static': `${MC.packageRoot}/static`,
  '@Public': `${MC.packageRoot}/public`,
  '@Cache': `${MC.packageRoot}/cache`,
  '@Modules': `${MC.packageRoot}/modules`
})

try {
  const modulesRoot = `${MC.packageRoot}/modules`
  const items = Fs.readdirSync(modulesRoot)
  items.forEach((name) => {
    const path = `${modulesRoot}/${name}`
    if (Fs.statSync(path).isDirectory()) {
      const moduleName = (name[0].toUpperCase() + name.substring(1)).replace(/-./g, x => x[1].toUpperCase())
      ModuleAlias.addAlias(`@Module_${moduleName}`, path)
    }
  })
} catch (e) {
  console.log(e)
}

// ------------------------------------------------------------ Directory Checks
MC.autocreateEntities.forEach((entity) => {
  const path = entity.path
  const full = `${MC.packageRoot}/${path}`
  if (!Fs.existsSync(full)) {
    if (entity.type === 'dir') {
      Fs.mkdirSync(full)
    } else if (entity.type === 'file') {
      Fs.writeFileSync(full, JSON.stringify(entity.data))
    }
  }
})

// ///////////////////////////////////////////////////////// Initialize Database
// -----------------------------------------------------------------------------
/*
 * Database Module is the only module that must be imported in app.js
*/
require('@Module_Database')

// ////////////////////////////////////////////////////////////// Initialize App
// -----------------------------------------------------------------------------
MC.app = Express()
MC.app.use(Helmet({
  contentSecurityPolicy: (process.env.SERVER_ENV !== 'development') ? undefined : false
}))

// //////////////////////////////////////////////////// Serve static directories
// -----------------------------------------------------------------------------
MC.serveStaticDirectories.forEach((path) => {
  const full = `${MC.packageRoot}/${path}`
  if (Fs.existsSync(full)) {
    MC.app.use(Express.static(full))
  }
})

// ///////////////////////////////////////////////////////////////////// Liftoff
// -----------------------------------------------------------------------------
const liftoff = () => {
  console.log(`🤖 [server] ${MC.backendUrl}`)
  require('@Root/liftoff')
}

MC.app.on('mongoose-connected', () => {
  // Create server instance
  MC.server.instance = process.env.SERVER_ENV === 'development'
    // -- development
    ? MC.server.https.createServer({
      key: Fs.readFileSync(`${MC.repoRoot}/localhost_key.pem`, 'ascii'),
      cert: Fs.readFileSync(`${MC.repoRoot}/localhost_cert.pem`, 'ascii')
    }, MC.app).listen(MC.port, liftoff)
    // -- production
    : MC.app.listen(MC.port, liftoff)
})
