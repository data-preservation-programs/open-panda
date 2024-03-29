console.log('🚀️ [app] liftoff')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
const Cors = require('cors')
const BodyParser = require('body-parser')
const ExpressSession = require('express-session')
const MongoStore = require('connect-mongo')
const Fs = require('fs-extra')
require('mongoose')

const MC = require('@Root/config')

// /////////////////////////////////////////////////// Add CORS response headers
// -----------------------------------------------------------------------------
MC.app.use(Cors(MC.cors))

// ////////////////////////////////////////////////////// Initialize Body Parser
// -----------------------------------------------------------------------------
MC.app.use(BodyParser.urlencoded({ extended: true, limit: '25mb' }))
MC.app.use(BodyParser.json({ limit: '25mb' }))

// ////////////////////////////////////////////////// Initialize Express Session
// -----------------------------------------------------------------------------
MC.expressSessionOptions.store = MongoStore.create({
  client: MC.mongooseConnection
})
MC.expressSession = ExpressSession(MC.expressSessionOptions)
MC.app.use(MC.expressSession)

// ////////////////////////////////////////////////////////// Import all Modules
// -----------------------------------------------------------------------------
try {
  const excluded = ['database', 'utilities']
  const modulesRoot = `${MC.packageRoot}/modules`
  const items = Fs.readdirSync(modulesRoot)
  let modulePath
  items.forEach((name) => {
    if (!excluded.includes(name)) {
      modulePath = `${modulesRoot}/${name}`
      if (Fs.statSync(modulePath).isDirectory()) {
        const moduleName = (name[0].toUpperCase() + name.substring(1)).replace(/-./g, x => x[1].toUpperCase())
        require(`@Module_${moduleName}`)
      }
    }
  })
} catch (e) {
  console.log(e)
}

// ///////////////////////////////////////////////////////////// Test operations
// -----------------------------------------------------------------------------
const loopDatasets = async () => { /* eslint-disable-line */
  const datasets = await MC.model.Dataset.find({ new: false, file_extensions: { $in: ['.pdf'] } })
  console.log(datasets.length)
  console.log(datasets.map(dataset => (dataset.name)))
  // const len = datasets.length
  // for (let i = 0; i < len; i++) {
  //   const dataset = datasets[i]
  //   console.log(dataset.name)
  //   console.log(dataset.categories)
  // }
} // loopDatasets()

// const dropCidDatabaseCollection = async () => {
//   try {
//     // delete all documents from the Cid table in the database
//     await MC.model.Cid.collection.drop()
//     const cids = await MC.model.Cid.find()
//     console.log(cids)
//   } catch (e) {
//     console.log(e)
//   }
// }
// dropCidDatabaseCollection()

// const logCidFromDatabase = async () => {
//   const datasets = await MC.model.Cid.collection.distinct('dataset_slug')
//   const len = datasets.length
//   const datasetCounts = []
//   for (let i = 0; i < len; i++) {
//     const slug = datasets[i]
//     const count = await MC.model.Cid.collection.find({ dataset_slug: slug }).count()
//     datasetCounts.push({
//       dataset: slug,
//       count
//     })
//   }
//   console.log(datasetCounts)
// }

// logCidFromDatabase()
