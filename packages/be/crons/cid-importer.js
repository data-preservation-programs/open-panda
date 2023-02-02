/**
 *
 * ⏱️️ [Cron | every 10 seconds] CID Importer
 *
 * Caches CID data
 *
 */

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const ModuleAlias = require('module-alias')
const Path = require('path')
const Fs = require('fs-extra')
const Express = require('express')
const Web3 = require('web3.storage')
require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

const MC = require('../config')
const Web3Storage = Web3.Web3Storage
const getFilesFromPath = Web3.getFilesFromPath
const apiToken = process.env.WEB3STORAGE_TOKEN
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

// ///////////////////////////////////////////////////////////////// CidImporter
const CidImporter = async () => {
  console.log('CID import started')
  try {
    const client = new Web3Storage({ token: apiToken })
    // console.log(client.list())
    // const res = await client.list() // Web3Response
    // console.log(res.cid)
    // const cids = client.list()
    const d = new Date()
    const before = d.toISOString()
    const maxResults = 10
    for await (const upload of client.list({ before, maxResults })) {
      console.log(upload)
    }
    process.exit(0)
  } catch (e) {
    console.log('===================================== [Function: CidImporter]')
    console.log(e)
    process.exit(0)
  }
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
MC.app.on('mongoose-connected', CidImporter)
