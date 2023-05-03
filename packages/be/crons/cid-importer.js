/**
 *
 * ⏱️️ [Cron | weekly] CID Importer
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
const Util = require('util')
const Stream = require('stream')
const Pipeline = Util.promisify(Stream.pipeline)
const readline = require('node:readline')
const argv = require('minimist')(process.argv.slice(2))
const WorkerPool = require('workerpool')

require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

const MC = require('../config')

const CID_TMP_DIR = Path.resolve(`${MC.packageRoot}/tmp/cid-files`)

const numThreads = argv.threads || 16
const Pool = WorkerPool.pool(Path.resolve(__dirname, './cid-batch-import.js'), { 
  maxWorkers: numThreads,
  workerType: 'thread'
})

let startTime

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
require('@Module_Cidtemp')
const { SecondsToHms } = require('@Module_Utilities')

// /////////////////////////////////////////////////////////////////// Functions
// --------------------------------------------------- performCidBatchOperations
const performCidBatchOperations = (manifest, batchNo, tasks, results) => {
  try {
    const batchSize = argv.pagesize || 1000
    const batch = manifest.slice(0, batchSize)
    tasks.push(
      Pool.exec('processManifestBatch', [batch, batchNo]).then((result) => {
        results.push(result)
        imported = result.databaseWriteResult.nUpserted + result.databaseWriteResult.nModified
        console.log(`Batch ${result.batch} finished | ${imported} CIDs were imported to the database in this batch`)
      }).catch((err) => {
        console.log('================================ Error returned by worker')
        console.error(err)
      })
    )
    manifest.splice(0, batchSize)
    if (manifest.length) {
      performCidBatchOperations(manifest, ++batchNo, tasks, results)
    } else {
      Promise.all(tasks).catch((e) => {
        console.log('=========================== Error returned by worker pool')
        console.log(e)
      }).then(() => {
        Pool.terminate()
        const len = results.length
        console.log(results)
        let dbTotalImported = 0
        let dbTotalModified = 0
        for (let i = 0; i < len; i++) {
          const result = results[i]
          dbTotalImported = dbTotalImported + result.databaseWriteResult.nUpserted
          dbTotalModified = dbTotalModified + result.databaseWriteResult.nModified
        }
        const endTime = process.hrtime()[0]
        console.log(`📒 CID import finished | took ${SecondsToHms(endTime - startTime)}`)
        console.log(`A total of ${dbTotalImported + dbTotalModified} CIDs were processed by the database | ${dbTotalImported} imported | ${dbTotalModified} modified`)
        process.exit(0)
      })
    }
  } catch (e) {
    console.log('======================= [Function: performCidBatchOperations]')
    console.log(e)
  }
}

// ------------------------------------------------- getCidFilesFromManifestList
const getCidFilesFromManifestList = async () => {
  try {
    const manifestList = Fs.createReadStream(`${CID_TMP_DIR}/cid-manifest.txt`)
    const rl = readline.createInterface({
      input: manifestList,
      crlfDelay: Infinity
    })
    // import all lines from the manifest to an array
    const manifest = []
    for await (const line of rl) {
      manifest.push(line)
    }
    // reverse the array to import oldest CIDs first
    manifest.reverse()
    // pass manifest on to the worker pool
    performCidBatchOperations(manifest, 1, [], [])
  } catch (e) {
    console.log('===================== [Function: getCidFilesFromManifestList]')
    console.log(e)
  }
}

// ------------------------------------------- createManifestFromWeb3StorageCids
const createManifestFromWeb3StorageCids = async (searchParams, maxPages, lastSavedDate, count) => {
  try {
    const options = { headers: { Accept: 'application/json', Authorization: `Bearer ${process.env.WEB3STORAGE_TOKEN}` } }
    const params = Object.keys(searchParams).map((item) => `${item}=${searchParams[item]}`).join('&')
    const url = `https://api.web3.storage/user/uploads?${params}`
    const response = await Axios.get(url, options)
    const uploads = response.data
    const len = uploads.length
    let skipCount = 0
    let total = 0
    let lastSavedDateReached = false
    for (let i = 0; i < len; i++) {
      const upload = uploads[i]
      const uploadDate = new Date(upload.created).getTime()
      if (uploadDate > lastSavedDate) {
        if (upload.name.endsWith('.zst')) {
          const newline = JSON.stringify({ cid: upload.cid, name: upload.name, created: upload.created, updated: upload.updated })
          await Pipeline(`${newline}\n`, Fs.createWriteStream(`${CID_TMP_DIR}/cid-manifest.txt`, { flags: 'a' }))
        } else {
          skipCount++
        }
      } else {
        lastSavedDateReached = true
        break
      }
      total = i + 1
    }
    total = total - skipCount
    const lineWriteCount = count ? count + total : total
    console.log(`${total} new CID(s) saved to the manifest in this batch | ${skipCount} file(s) were skipped due to filetype mismatch | total of ${lineWriteCount} new CID(s) saved so far`)
    if (uploads.length === searchParams.size && !lastSavedDateReached && searchParams.page < maxPages) {
      searchParams.page += 1
      await createManifestFromWeb3StorageCids(searchParams, maxPages, lastSavedDate, lineWriteCount)
    } else {
      console.log(`Finished writing CID manifest file - a total of ${lineWriteCount} new CID(s) will be imported to the database.`)
    }
  } catch (e) {
    console.log('=============== [Function: createManifestFromWeb3StorageCids]')
    console.log(e)
    if (e.response && e.response.status === 500) {
      await createManifestFromWeb3StorageCids(searchParams, maxPages, lastSavedDate, count)
      console.log(`Retrying fetching uploads on page ${searchParams.page}`)
    }
  }
}

// ///////////////////////////////////////////////////////////////// CidImporter
const CidImporter = async () => {
  try {
    startTime = process.hrtime()[0]
    const limit = argv.pagesize || 1000
    const maxPages = argv.maxpages || Infinity
    // console.log(`📖 CID import started | page size of ${limit} and page maximum ${maxPages}.`)
    // // Get the latest upload entry from the database
    // // const mostRecentCid = await MC.model.Cidtemp.find().sort({ web3storageCreatedAt: -1 }).limit(1) // TODO : uncomment line and replace with override option
    // const mostRecentDocument = false // mostRecentCid[0]
    // console.log('Most recent CID imported:')
    // console.log(mostRecentDocument)
    // const lastSavedDate = mostRecentDocument ? new Date(mostRecentDocument.web3storageCreatedAt).getTime() : 0
    // // Delete the outdated manifest file if it exists
    // // await deleteTemporaryFile('cid-manifest.txt')
    // if (Fs.existsSync(`${CID_TMP_DIR}/cid-manifest.txt`)) {
    //   Fs.unlinkSync(`${CID_TMP_DIR}/cid-manifest.txt`)
    // }
    // /**
    //  * Build a manifest list of all cids not yet uploaded to the database:
    //  * args:
    //  *  params passed to the initial api upload list request
    //  *  limit number of pages retrieved. Set to Infinity to retrieve all CIDs since the most recently uploaded saved in the db
    //  *  the most recent upload saved to our database (so as to request only more newer uploads)
    //  */
    // await createManifestFromWeb3StorageCids({
    //   size: limit,
    //   page: 1,
    //   sortBy: 'Date',
    //   sortOrder: 'Desc'
    // }, maxPages, lastSavedDate)
    // /**
    //  * Retrieve and unpack files one by one from the manifest list and bulkWrite contents to the database
    //  * args:
    //  *  limit number of entries to the database (this will only be used for test)
    //  */
    await getCidFilesFromManifestList()
  } catch (e) {
    console.log('===================================== [Function: CidImporter]')
    console.log(e)
    process.exit(0)
  }
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
MC.app.on('mongoose-connected', CidImporter)
