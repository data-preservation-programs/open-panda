/**
 *
 * ⏱️️ [Cron | every 10 seconds] Cacher
 *
 * Caches data
 *
 */

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const ModuleAlias = require('module-alias')
const Path = require('path')
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
const { SecondsToHms } = require('@Module_Utilities')
const GetFilters = require('@Module_Dataset/logic/get-filters')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// getBasicStats
const getBasicStats = async () => {
  try {
    return {
      count__datasets__total: await MC.model.Dataset.countDocuments()
    }
  } catch (e) {
    console.log('=================================== [Function: getBasicStats]')
    throw e
  }
}

// /////////////////////////////////////////////// getTypeaheadDatasetSearchData
const getTypeaheadDatasetSearchData = async () => {
  try {
    return await MC.model.Dataset.find({}).select('-_id name slug')
  } catch (e) {
    console.log('=================== [Function: getTypeaheadDatasetSearchData]')
    throw e
  }
}

// ///////////////////////////////////////////////////////////////// writeToDisc
const writeToDisc = async (files) => {
  try {
    return new Promise((resolve) => {
      files.forEach((item) => {
        Fs.writeFileSync(`${MC.cacheRoot}/${item.filename}`, JSON.stringify(item.data))
      })
      resolve()
    })
  } catch (e) {
    console.log('===================================== [Function: writeToDisc]')
    throw e
  }
}

// ////////////////////////////////////////////////////////////////////// Cacher
const Cacher = async () => {
  console.log('🤖 Caching started')
  try {
    const start = process.hrtime()[0]
    await writeToDisc([
      { filename: 'basic-stats.json', data: await getBasicStats() },
      { filename: 'filters.json', data: await GetFilters() },
      { filename: 'typeahead-dataset-search-data.json', data: await getTypeaheadDatasetSearchData() }
    ])
    const end = process.hrtime()[0]
    console.log(`🏁 Caching complete | took ${SecondsToHms(end - start)}`)
    process.exit(0)
  } catch (e) {
    console.log('========================================== [Function: Cacher]')
    console.log(e)
    process.exit(0)
  }
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
MC.app.on('mongoose-connected', Cacher)
