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
const Spawn = require('child_process').spawn
const argv = require('minimist')(process.argv.slice(2))
require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

const MC = require('../config')

const CID_TMP_DIR = Path.resolve(`${MC.packageRoot}/tmp/cid-files`)

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
const { GetFileFromDisk, SecondsToHms } = require('@Module_Utilities')

// /////////////////////////////////////////////////////////////////// Functions
// ------------------------------------------------------------ retrieveCidFiles
const retrieveCidFile = async (line, retryNo = 0) => {
  try {
    if (retryNo > 0) {
      console.log(`Retry number ${retryNo}`)
    }
    const upload = JSON.parse(line)
    // fetch file using upload cid
    const response = await Axios.get(`https://${upload.cid}.ipfs.w3s.link/`, {
      responseType: 'stream'
    })
    // if a file already exists with this name in the temp folder,
    // delete it to make way for an updated version
    await deleteTemporaryFile(upload.name)
    // write file data to new zst file in the temp folder
    await Pipeline(response.data, Fs.createWriteStream(`${CID_TMP_DIR}/${upload.name}`))
    // unpack the zst and return the inner json
    return await unpackRetrievedFile({
      cid: upload.cid,
      name: upload.name,
      updated: upload.updated,
      created: upload.created
    })
  } catch (e) {
    console.log('====================================== [Function: unpackCids]')
    console.log(e)
    if (retryNo < 10) {
      console.log(`Error retrieving CID ${JSON.parse(line).cid}. Retrying retrieval...`)
      await retrieveCidFile(line, retryNo + 1)
    } else {
      const cid = JSON.parse(line).cid
      console.log(`Could not retrieve CID ${cid}. Max retries reached.`)
      await cacheFailedCID(cid)
    }
  }
}

// --------------------------------------------------------------- unpackZstFile
const unpackZstFile = (file) => {
  return new Promise((resolve, reject) => {
    const unzstd = Spawn('unzstd', [`../tmp/cid-files/${file.name}`])
    const errors = []
    unzstd.stderr.on('data', (msg) => {
      errors.push(`Error unpacking ${file.name}: ${msg.toString()}`)
    })
    unzstd.on('exit', (code) => {
      const err = errors.length > 0 && code !== 0
      if (err) {
        console.log(errors.join('\n'))
      }
      resolve()
    })
  })
}

// --------------------------------------------------------- unpackRetrievedFile
const unpackRetrievedFile = async (file) => {
  try {
    const jsonFilename = file.name.substring(0, file.name.length - 4)
    await deleteTemporaryFile(jsonFilename)
    await unpackZstFile(file)
    await deleteTemporaryFile(file.name)
    const json = await GetFileFromDisk(`${CID_TMP_DIR}/${jsonFilename}`, true)
    const fileMetadata = {
      piece_cid: json.piece_cid,
      payload_cid: json.payload_cid,
      raw_car_file_size: json.raw_car_file_size,
      dataset_slug: json.dataset,
      filename: jsonFilename,
      web3storageCreatedAt: file.created,
      web3storageUpdatedAt: file.updated
    }
    await deleteTemporaryFile(jsonFilename)
    return fileMetadata
  } catch (e) {
    console.log('============================ [Function: unpackRetrievedFiles]')
    console.log(e)
  }
}

// ------------------------------------------------- writeFileMetadataToDatabase
const writeFileMetadataToDatabase = async (retrievedFiles) => {
  try {
    const operations = []
    const len = retrievedFiles.length
    for (let i = 0; i < len; i++) {
      const file = retrievedFiles[i]
      operations.push({
        updateOne: {
          filter: { payload_cid: file.payload_cid },
          update: { $set: file },
          upsert: true
        }
      })
    }
    const response = await MC.model.Cidtemp.bulkWrite(operations, { ordered: false })
    return response.result
  } catch (e) {
    console.log('========================= [Function: writeCidFilesToDatabase]')
    console.log(e)
  }
}

// -------------------------------------------------------------- cacheFailedCid
const cacheFailedCID = async (cid) => {
  try {
    await Pipeline(`${cid}\n`, Fs.createWriteStream(`${CID_TMP_DIR}/failed-cid-retrievals.txt`, { flags: 'a' }))
  } catch (e) {
    console.log('================================= [Function: cacheFailedCID ]')
    console.log(e)
  }
}

// --------------------------------------------------------- deleteTemporaryFile
const deleteTemporaryFile = async (filename) => {
  try {
    if (Fs.existsSync(`${CID_TMP_DIR}/${filename}`)) {
      Fs.unlinkSync(`${CID_TMP_DIR}/${filename}`)
    }
  } catch (e) {
    console.log('============================ [Function: deleteTemporaryFile ]')
    console.log(e)
  }
}

// ------------------------------------------------- getCidFilesFromManifestList
const getCidFilesFromManifestList = async (importMax) => {
  try {
    if (Fs.existsSync(`${CID_TMP_DIR}/cid-manifest.txt`)) {
      const manifest = Fs.createReadStream(`${CID_TMP_DIR}/cid-manifest.txt`)
      const rl = readline.createInterface({
        input: manifest,
        crlfDelay: Infinity
      })
      // import all lines from the manifest to an array
      const manifestCidLines = []
      for await (const line of rl) {
        manifestCidLines.push(line)
      }
      // reverse the array to import oldest CIDs first
      // begin writing to the database in batches
      manifestCidLines.reverse()
      let retrievedFiles = []
      let total = 0
      const batchSize = argv.pagesize || 1000
      const len = manifestCidLines.length
      for (let i = 0; i < len; i++) {
        if (i < importMax) {
          const line = manifestCidLines[i]
          console.log(`Retrieving file ${i + 1} from the CID manifest list.`)
          const retrieved = await retrieveCidFile(line)
          if (retrieved) { retrievedFiles.push(retrieved) }
          // write retrieved file data to the database in batches of 1000
          if ((i + 1) % batchSize === 0) {
            const result = await writeFileMetadataToDatabase(retrievedFiles)
            total = total + result.nUpserted + result.nModified
            console.log(`${result.nUpserted} new CIDs imported in this batch | ${result.nModified} CIDs updated in this batch | A total of ${total} CIDs imported/updated so far.`)
            retrievedFiles = []
          }
        } else {
          break
        }
      }
      const result = await writeFileMetadataToDatabase(retrievedFiles)
      console.log(`${result.nUpserted} new CIDs imported in this batch | ${result.nModified} CIDs updated in this batch | A total of ${total + result.nUpserted + result.nModified} CIDs were imported/updated to the database.`)
    }
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
    const start = process.hrtime()[0]
    const limit = argv.pagesize || 1000
    const maxPages = argv.maxpages || Infinity
    console.log(`📖 CID import started | page size of ${limit} and page maximum ${maxPages}.`)
    // Get the latest upload entry from the database
    const mostRecentCid = await MC.model.Cidtemp.find().sort({ web3storageCreatedAt: -1 }).limit(1)
    const mostRecentDocument = mostRecentCid[0]
    console.log('Most recent CID imported:')
    console.log(mostRecentDocument)
    const lastSavedDate = mostRecentDocument ? new Date(mostRecentDocument.web3storageCreatedAt).getTime() : 0
    // Delete the outdated manifest file if it exists
    await deleteTemporaryFile('cid-manifest.txt')
    /**
     * Build a manifest list of all cids not yet uploaded to the database:
     * args:
     *  params passed to the initial api upload list request
     *  limit number of pages retrieved. Set to Infinity to retrieve all CIDs since the most recently uploaded saved in the db
     *  the most recent upload saved to our database (so as to request only more newer uploads)
     */
    await createManifestFromWeb3StorageCids({
      size: limit,
      page: 1,
      sortBy: 'Date',
      sortOrder: 'Desc'
    }, maxPages, lastSavedDate)
    /**
     * Retrieve and unpack files one by one from the manifest list and bulkWrite contents to the database
     * args:
     *  limit number of entries to the database (this will only be used for test)
     */
    await getCidFilesFromManifestList(limit * maxPages)
    const end = process.hrtime()[0]
    console.log(`📒 CID import finished | took ${SecondsToHms(end - start)}`)
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
