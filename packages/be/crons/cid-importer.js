/**
 *
 * ⏱️️ [Cron | every week] CID Importer
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
require('@Module_Cid')
const { GetFileFromDisk, SecondsToHms } = require('@Module_Utilities')

// /////////////////////////////////////////////////////////////////// Functions
// ------------------------------------------------------------ retrieveCidFiles
const retrieveCidFile = async (obj) => {
  try {
    const upload = JSON.parse(obj)
    // fetch file using upload cid
    const response = await Axios.get(`https://${upload.cid}.ipfs.w3s.link/`, {
      responseType: 'stream'
    })
    // if a file already exists with this name in the temp folder,
    // delete it to make way for an updated version
    await deleteTemporaryFile(upload.name)
    // write file data to new zst file in the temp folder
    await Pipeline(response.data, Fs.createWriteStream(`${CID_TMP_DIR}/${upload.name}`))
    return await unpackRetrievedFile({
      cid: upload.cid,
      name: upload.name,
      updated: upload.updated,
      created: upload.created
    })
  } catch (e) {
    console.log('====================================== [Function: unpackCids]')
    console.log(e)
    process.exit(0)
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
    fileMetadata = {
      piece_cid: json.piece_cid,
      payload_cid: json.payload_cid,
      raw_car_file_size: json.raw_car_file_size,
      dataset_slug: json.dataset,
      name: jsonFilename,
      created: file.created,
      updated: file.updated
    }
    await deleteTemporaryFile(jsonFilename)
    return fileMetadata
  } catch (e) {
    console.log('============================ [Function: unpackRetrievedFiles]')
    console.log(e)
    process.exit(0)
  }
}

// ------------------------------------------------- writeFileMetadataToDatabase
const writeFileMetadataToDatabase = async (filelist) => {
  try {
    const operations = []
    const len = filelist.length
    for (let i = 0; i < len; i++) {
      const file = filelist[i]
      operations.push({
        updateOne: {
          filter: { payload_cid: file.payload_cid },
          update: { $set: file },
          upsert: true
        }
      })
    }
    const response = await MC.model.Cid.bulkWrite(operations, { ordered: false })
    const result = response.result
    console.log(`${len} CIDs imported/updated | New: ${result.nUpserted} | Updated: ${result.nModified}`)
    return result
  } catch (e) {
    console.log('========================= [Function: writeCidFilesToDatabase]')
    console.log(e)
    process.exit(0)
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
    process.exit(0)
  }
}

// ------------------------------------------------------ GetCidsFromWeb3Storage
const getCidFilesFromManifestList = async (params) => {
  try {
    const manifest = Fs.createReadStream(`${CID_TMP_DIR}/cid-manifest.txt`)
    const rl = readline.createInterface({
      input: manifest,
      crlfDelay: Infinity
    })
    let i = 1
    const retrieved = []
    for await (const line of rl) {
      if (i <= params.limitEntries) {
        console.log(`Retrieving file ${i} from the CID manifest list.`)
        retrieved.push(await retrieveCidFile(line))
        i++
      } else {
        break;
      }
    }
    const completed = await writeFileMetadataToDatabase(retrieved)
    return completed
  } catch (e) {
    console.log('========================== [Function: getCidsFromWeb3Storage]')
    console.log(e)
    process.exit(0)
  }
}

// ------------------------------------------------------ GetCidsFromWeb3Storage
const createManifestFromWeb3StorageCids = async (searchParams, pageLimit, mostRecentDocument) => {
  try {
    const page = searchParams.page
    let lastSavedDateReached = false
    const lastSavedDate = mostRecentDocument ? new Date(mostRecentDocument.created) : 0
    const options = { headers: { Accept: 'application/json', Authorization: `Bearer ${process.env.WEB3STORAGE_TOKEN}` } }
    const params = Object.keys(searchParams).map((item) => `${item}=${searchParams[item]}`).join('&')
    const url = `https://api.web3.storage/user/uploads?${params}`
    const response = await Axios.get(url, options)
    const uploads = response.data
    const len = uploads.length
    let skipCount = 0
    let total = 0
    for (let i = 0; i < len; i++) {
      const upload = uploads[i]
      const uploadDate = new Date(upload.created)
      if (uploadDate > lastSavedDate) {
        if (upload.name.endsWith('.zst')) {
          const newline = JSON.stringify({ cid: upload.cid, name: upload.name, created: upload.created, updated: upload.updated })
          await Pipeline(`${newline}\n`, Fs.createWriteStream(`${CID_TMP_DIR}/cid-manifest.txt`, { flags: 'a' }))
        } else {
          skipCount++
        }
      } else {
        lastSavedDateReached = true
        break;
      }
      total = i + 1
    }
    console.log(`${total - skipCount} new CIDs of unimported files were saved to the manifest | ${skipCount} files were skipped due to filetype mismatch`)
    const limit = pageLimit ? pageLimit : Infinity
    if (uploads.length === searchParams.size && !lastSavedDateReached) {
      if (page < limit) {
        searchParams.page = page + 1
        await createManifestFromWeb3StorageCids(searchParams, pageLimit)
      }
    }
  } catch (e) {
    console.log('========================== [Function: getCidsFromWeb3Storage]')
    console.log(e)
    if (e.response.status === 500) {
      await createManifestFromWeb3StorageCids(searchParams, pageLimit)
      console.log(`Retrying fetching uploads on page ${page}`)
    }
  }
}

// ///////////////////////////////////////////////////////////////// CidImporter
const CidImporter = async () => {
  console.log('📖 CID import started')
  try {
    const start = process.hrtime()[0]
    const resultsPerPage = 10
    const maxPages = 2
    // Get the latest upload entry from the database
    const mostRecent = await MC.model.Cid.find().sort({ 'created': -1 }).limit(1)
    // Delete the outdated manifest file if it exists
    await deleteTemporaryFile('cid-manifest.txt')
    /**
     * Build a manifest list of all cids not yet uploaded to the database:
     * args:
     *  params passed to the initial api upload list request
     *  limit number of pages retrieved. If null, all CIDs will be retrieved
     *  the most recent upload saved to our database (so as to request only more newer uploads)
     */
    await createManifestFromWeb3StorageCids({ size: resultsPerPage, page: 1, sortBy: 'Date', sortOrder: 'Desc' }, maxPages, mostRecent[0])
    /**
     * Retrieve and unpack files one by one from the manifest list and bulkWrite contents to the database
     * args:
     *  limit number of entries to the database (this will only be used for test)
     */
    await getCidFilesFromManifestList({ limitEntries: resultsPerPage * maxPages })
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
