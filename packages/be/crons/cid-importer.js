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
const Axios = require('axios')
const Fs = require('fs-extra')
const Express = require('express')
const IPFSCar = require('ipfs-car/unpack/fs')
const unpackToFs = IPFSCar.unpackToFs
const unpackStreamToFs = IPFSCar.unpackStreamToFs
require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

const MC = require('../config')
console.log(IPFSCar)
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
// ////////////////////////////////////////////////////////////////// unpackCids
const retrieveCidCarFiles = async (uploads) => {
  try {
    const len = uploads.length
    const data = []
    for (let i = 0; i < len; i++) {
      const cid = uploads[i].cid
      const url = `https://api.web3.storage/car/${cid}`
      const upload = await Axios.get(url, {
        headers: {
          Accept: 'application/vnd.ipld.car',
          Authorization: `Bearer ${process.env.WEB3STORAGE_TEST_TOKEN}`
        }
      })
      const tmpCarPath = `${MC.packageRoot}/tmp/cid-files/${cid}.json.zst.car`
      await Fs.writeFile(tmpCarPath, upload.data)

      const input = Fs.createReadStream(tmpCarPath)
      await unpackStreamToFs({
        input: input,
        output: `${MC.packageRoot}/tmp/cid-files/${cid}`
      })
      // console.log(upload.data)
      // console.log(i)
      // files.push(upload.data)
    }
    return data.flat()
  } catch (e) {
    console.log('====================================== [Function: unpackCids]')
    console.log(e)
    process.exit(0)
  }
}

// ////////////////////////////////////////////////////// GetCidsFromWeb3Storage
const getCidsFromWeb3Storage = async (search) => {
  try {
    const params = Object.keys(search).map((item) => `${item}=${search[item]}`).join('&')
    const options = { 
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WEB3STORAGE_TEST_TOKEN}` 
      } 
    }
    const url = `https://api.web3.storage/user/uploads?${params}` // 
    // console.log(url)
    const response = await Axios.get(url, options)
    // console.log(response.data)
    const unpackedCidListChunk = await retrieveCidCarFiles(response.data)
    // console.log(unpackedCidListChunk)
    // console.log(unpackedCidListChunk.length)
  } catch (e) {
    console.log('========================== [Function: getCidsFromWeb3Storage]')
    console.log(e)
    process.exit(0)
  }
}

// const writeDatasetsToDatabase = async (datasetList) => {
//   try {
//     const operations = []
//     const len = datasetList.length
//     for (let i = 0; i < len; i++) {
//       const dataset = datasetList[i]
//       delete dataset._id
//       delete dataset.new
//       delete dataset.locked
//       delete dataset.priority
//       operations.push({
//         updateOne: {
//           filter: { slug: dataset.slug },
//           update: { $set: dataset },
//           upsert: true
//         }
//       })
//     }
//     const response = await MC.model.Dataset.bulkWrite(operations, { ordered: false })
//     const result = response.result
//     console.log(`→ Total: ${len} | New: ${result.nUpserted} | Updated: ${result.nModified}`)
//   } catch (e) {
//     console.log('========================= [Function: writeDatasetsToDatabase]')
//     throw e
//   }
// }

// ///////////////////////////////////////////////////////////////// CidImporter
const CidImporter = async () => {
  console.log('CID import started')
  try {
    await getCidsFromWeb3Storage({ size: 10, page: 1, sortBy: 'Date', sortOrder: 'Asc' })
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
