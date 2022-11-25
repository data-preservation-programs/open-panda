console.log('📦 [module] database')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Mongoose = require('mongoose')
const MongooseSlugUpdater = require('mongoose-slug-updater')

const MC = require('@Root/config')

// ///////////////////////////////////////////////////////// Mongoose & DB Setup
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// Plugins
Mongoose.plugin(MongooseSlugUpdater)

// ////////////////////////////////////////////// Initialize Mongoose Connection
Mongoose
  .connect(MC.databaseUrl, MC.mongoConnectionOptions)
  .then(res => {
    console.log(`💽 [mongo] ${MC.databaseUrl}`)
    MC.mongooseConnection = res.mongoose.connection.getClient()
    MC.app.emit('mongoose-connected')
  }).catch((err) => {
    console.log(err)
  })
