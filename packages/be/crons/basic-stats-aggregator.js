/*
 *
 * ⏱️️ [Cron | every 5 mins] BasicStatsAggregator
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
// ///////////////////////////////////////////////////////////// getDatasetCount
const getDatasetCount = async () => {
  try {
    return await MC.model.Dataset.countDocuments()
  } catch (e) {
    console.log('================================= [Function: getDatasetCount]')
    throw e
  }
}

// ///////////////////////////////////////////////////////////////// writeToDisc
const writeToDisc = async (data) => {
  try {
    return new Promise((resolve) => {
      Fs.writeFileSync(`${MC.cacheRoot}/basic-stats.json`, JSON.stringify(data))
      resolve()
    })
  } catch (e) {
    console.log('===================================== [Function: writeToDisc]')
    throw e
  }
}

// //////////////////////////////////////////////////////// BasicStatsAggregator
const BasicStatsAggregator = async () => {
  console.log('🤖 Basic stats aggregation started')
  try {
    const count = await getDatasetCount()
    await writeToDisc({
      count__datasets__total: count
    })
    console.log('🏁 Basic stats aggregation complete')
    process.exit(0)
  } catch (e) {
    console.log('============================ [Function: BasicStatsAggregator]')
    console.log(e)
    process.exit(0)
  }
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
MC.app.on('mongoose-connected', BasicStatsAggregator)
