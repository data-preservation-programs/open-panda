/*
 *
 * ⏱️️ [Cron | every 5 mins] Sl3DatasetImporter
 *
 */

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const ModuleAlias = require('module-alias')
const Path = require('path')
const Axios = require('axios')
const Fs = require('fs-extra')
const Express = require('express')
require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

const MC = require('../config')

// ////////////////////////////////////////////////////////////////// Initialize
MC.app = Express()

// ///////////////////////////////////////////////////////////////////// Aliases
ModuleAlias.addAliases({
  '@Root': MC.packageRoot,
  '@Modules': `${MC.packageRoot}/modules`
})

try {
  const modulesRoot = `${MC.packageRoot}/modules`
  const items = Fs.readdirSync(modulesRoot)
  items.forEach((name) => {
    const path = `${modulesRoot}/${name}`
    if (Fs.statSync(path).isDirectory()) {
      const moduleName = `${name[0].toUpperCase() + name.substring(1)}`
      ModuleAlias.addAlias(`@Module_${moduleName}`, path)
    }
  })
} catch (e) {
  console.log(e)
}

// ///////////////////////////////////////////////////////////////////// Modules
require('@Module_Database')
require('@Module_Dataset')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////// fetchDatasetsFromSl3
const fetchDatasetsFromSl3 = async () => {
  try {
    const response = await Axios.get('https://slingshot.filecoin.io/api/modify/get-dataset-list?limit=10000')
    return response.data.payload.results
  } catch (e) {
    console.log('============================ [Function: fetchDatasetsFromSl3]')
    throw e
  }
}

// ///////////////////////////////////////////////////// writeDatasetsToDatabase
const writeDatasetsToDatabase = async (datasetList) => {
  try {
    const operations = []
    const len = datasetList.length
    for (let i = 0; i < len; i++) {
      const dataset = datasetList[i]
      delete dataset._id
      delete dataset.new
      delete dataset.locked
      delete dataset.priority
      operations.push({
        updateOne: {
          filter: { slug: dataset.slug },
          update: { $set: dataset },
          upsert: true
        }
      })
    }
    const response = await MC.model.Dataset.bulkWrite(operations, { ordered: false })
    const result = response.result
    console.log(`→ Total: ${len} | New: ${result.nUpserted} | Updated: ${result.nModified}`)
  } catch (e) {
    console.log('========================= [Function: writeDatasetsToDatabase]')
    throw e
  }
}

// ////////////////////////////////////////////////////////// Sl3DatasetImporter
const Sl3DatasetImporter = async () => {
  console.log('🤖 SL3 dataset importing started')
  try {
    const datasetList = await fetchDatasetsFromSl3()
    await writeDatasetsToDatabase(datasetList)
    console.log('🏁 SL3 dataset importing complete')
    process.exit(0)
  } catch (e) {
    console.log('============================== [Function: Sl3DatasetImporter]')
    console.log(e)
    process.exit(0)
  }
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
MC.app.on('mongoose-connected', Sl3DatasetImporter)
