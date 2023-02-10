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
const Util = require('util')
const Stream = require('stream')
const Pipeline = Util.promisify(Stream.pipeline)
const Spawn = require('child_process').spawn
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
require('@Module_Cid')
const { GetFileFromDisk } = require('@Module_Utilities')

// /////////////////////////////////////////////////////////////////// Functions
// ------------------------------------------------------------ retrieveCidFiles
const retrieveCidFiles = async (uploads) => {
  try {
    const len = uploads.length
    const cidFileRefs = []
    for (let i = 0; i < len; i++) {
      const upload = uploads[i]
      // if a file already exists with this name in the temp folder, 
      // delete it to make way for an updated version
      await deleteTemporaryFile(upload.name) 
      // fetch file using upload cid
      const response = await Axios.get(`https://${upload.cid}.ipfs.w3s.link/`, {
        responseType: 'stream'
      })
      await Pipeline(response.data, Fs.createWriteStream(`${MC.packageRoot}/tmp/cid-files/${upload.name}`))
      cidFileRefs.push({
        cid: upload.cid,
        name: upload.name
      })
    }
    return await unpackRetrievedFiles(cidFileRefs)
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
        console.log(errors.join('\n\n'))
      }
      resolve()
    })
  })
}

// -------------------------------------------------------- unpackRetrievedFiles
const unpackRetrievedFiles = async (cidFileRefs) => {
  try {
    let len = cidFileRefs.length
    const unpacked = []
    for (let i = 0; i < len; i++) {
      const file = cidFileRefs[i]
      if (file.name.endsWith('.zst')) {
        const jsonFilename = file.name.substring(0, file.name.length - 4)
        await deleteTemporaryFile(jsonFilename)
        await unpackZstFile(file)
        unpacked.push(jsonFilename)
      }
      await deleteTemporaryFile(file.name)
    }
    len = unpacked.length
    const filesMetadata = []
    for (let i = 0; i < len; i++) {
      const jsonFilename = unpacked[i]
      const json = await GetFileFromDisk(`${MC.packageRoot}/tmp/cid-files/${jsonFilename}`, true)
      filesMetadata.push({
        piece_cid: json.piece_cid,
        payload_cid: json.payload_cid,
        raw_car_file_size: json.raw_car_file_size,
        dataset_slug: json.dataset
      })
      await deleteTemporaryFile(jsonFilename)
    }
    return filesMetadata
    process.exit(0)
  } catch (e) {
    console.log('============================ [Function: unpackRetrievedFiles]')
    console.log(e)
    process.exit(0)
  }
}

// ------------------------------------------------- writeFileMetadataToDatabase
const writeFileMetadataToDatabase = async (files) => {
  try {
    const operations = []
    const len = files.length
    for (let i = 0; i < len; i++) {
      const file = files[i]
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
    if (Fs.existsSync(`${MC.packageRoot}/tmp/cid-files/${filename}`)) {
      Fs.unlinkSync(`${MC.packageRoot}/tmp/cid-files/${filename}`)
    }
  } catch (e) {
    console.log('============================ [Function: deleteTemporaryFile ]')
    console.log(e)
    process.exit(0)
  }
}

// ------------------------------------------------------ GetCidsFromWeb3Storage
const getCidsFromWeb3Storage = async (searchParams, incrementPage, pageLimit) => {
  try {
    if (incrementPage) {
      searchParams.page = searchParams.page + 1
    }
    const params = Object.keys(searchParams).map((item) => `${item}=${searchParams[item]}`).join('&')
    const options = { 
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.WEB3STORAGE_TOKEN}` 
      }
    }
    const url = `https://api.web3.storage/user/uploads?${params}`
    const response = await Axios.get(url, options)
    const retrievedFileMetadata = await retrieveCidFiles(response.data)
    const completed = await writeFileMetadataToDatabase(retrievedFileMetadata)
    if (completed && response.data.length === searchParams.size) {
      if (pageLimit) {
        if (searchParams.page < pageLimit) {
          await getCidsFromWeb3Storage(searchParams, true, pageLimit)
        }
      } else {
        await getCidsFromWeb3Storage(searchParams, true, null)
      }
    }
    process.exit(0)
  } catch (e) {
    console.log('========================== [Function: getCidsFromWeb3Storage]')
    console.log(e)
    process.exit(0)
  }
}

// ///////////////////////////////////////////////////////////////// CidImporter
const CidImporter = async () => {
  console.log('📖 CID import started')
  try {
    /*
     * args: 
     *  params passed to the initial api upload list request
     *  increment the page param by 1 - true | false
     *  limit number of pages retrieved. If null, all CIDs will be retrieved
     */
    await getCidsFromWeb3Storage({ size: 100, page: 1, sortBy: 'Date', sortOrder: 'Desc' }, false, 5)
    console.log('📒 CID import finished')
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
