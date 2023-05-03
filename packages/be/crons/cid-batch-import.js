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
const WorkerPool = require('workerpool')
const Mongoose = require('mongoose')
const MongooseSlugUpdater = require('mongoose-slug-updater')

require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

const MC = require('../config')

const CID_TMP_DIR = Path.resolve(`${MC.packageRoot}/tmp/cid-files`)

// ////////////////////////////////////////////////////////////////// Initialize
MC.app = Express()
Mongoose.plugin(MongooseSlugUpdater)

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
    await deleteTemporaryFile(CID_TMP_DIR, upload.name)
    // write file data to new zst file in the temp folder
    await Pipeline(response.data, Fs.createWriteStream(`${CID_TMP_DIR}/${upload.name}`))
    // unpack the zst and return the inner json
    return await unpackRetrievedFile(CID_TMP_DIR, {
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
      await retrieveCidFile(CID_TMP_DIR, line, retryNo + 1)
    } else {
      const cid = JSON.parse(line).cid
      console.log(`Could not retrieve CID ${cid}. Max retries reached.`)
      await cacheFailedCID(CID_TMP_DIR, cid)
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
    // await deleteTemporaryFile(file.name) // TODO : don't delete zst file in tmp directory
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
    await deleteTemporaryFile(jsonFilename) // TODO : do delete unpacked json file in tmp directory
    return fileMetadata
  } catch (e) {
    console.log('============================ [Function: unpackRetrievedFiles]')
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

// ------------------------------------------------ writeBatchMetadataToDatabase
const writeBatchMetadataToDatabase = async (retrievedFiles) => {
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
    console.log('==================== [Function: writeBatchMetadataToDatabase]')
    console.log(e)
  }
}

// ------------------------------------------------ backupFilesToBackblazeBucket
const backupFilesToBackblazeBucket = async (retrievedFiles) => {
  try {
    console.log('backup started')
  } catch (e) {
    console.log('==================== [Function: backupFilesToBackblazeBucket]')
    console.log(e)
  }
}

// ////////////////////////////////////////////////////////////////////// Worker
// -------------------------------------------------------- processManifestBatch
const processManifestBatch = async (batch, batchNo) => {
  try {
    const len = batch.length
    const uploaded = Math.floor(Math.random() * len)
    const modified = len - uploaded
    console.log(len, uploaded, modified)
    // const retrievedFiles = []
    // for (let i = 0; i < len; i++) {
    //   const cidManifestItem = batch[i] 
    //   const retrieved = await retrieveCidFile(cidManifestItem)
    //   if (retrieved) { retrievedFiles.push(retrieved) }
    // }
    // console.log(retrievedFiles)
    // const databaseWriteResult = await writeBatchMetadataToDatabase(retrievedFiles)
    // const batchBackupResult = await backupFilesToBackblazeBucket(retrievedFiles)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = new WorkerPool.Transfer({ 
          batch: batchNo, 
          databaseWriteResult: {
            nUpserted: uploaded,
            nModified: modified
          }, 
          batchBackupResult: false 
        })
        resolve(result)
      }, 3000)
    })
  } catch (e) {
    console.log('============================ [Function: processManifestBatch]')
    console.log(e)
  }
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
WorkerPool.worker({
  processManifestBatch: processManifestBatch
})
