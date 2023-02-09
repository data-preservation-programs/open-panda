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
const Zstd = require ('node-zstandard')
// const { GetFileFromDisk } = require('@Module_Utilities')
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

// /////////////////////////////////////////////////////////////////// Functions
// ------------------------------------------------------------ retrieveCidFiles
const retrieveCidFiles = async (uploads) => {
  try {
    const len = uploads.length
    const cidFileRefs = []
    for (let i = 0; i < len; i++) {
      const upload = uploads[i]
      console.log(upload)
      Axios({
          method: 'get',
          url: `https://${upload.cid}.ipfs.w3s.link/`,
          responseType: 'stream'
      }).then(function (response) {
          response.data.pipe(Fs.createWriteStream(`${MC.packageRoot}/tmp/cid-files/${upload.name}`))
      })
      // const file = await Axios.get(`https://${upload.cid}.ipfs.w3s.link/`, { responseType: 'blob' })
      // await Fs.writeFile(`${MC.packageRoot}/tmp/cid-files/${upload.name}`, file.data)
      // return await 
    }
    // cidFileRefs.push({
    //         cid: upload.cid,
    //         name: upload.name
    //       })
    //       unpackRetrievedFiles(cidFileRefs)
  } catch (e) {
    console.log('====================================== [Function: unpackCids]')
    console.log(e)
    process.exit(0)
  }
}

// -------------------------------------------------------- unpackRetrievedFiles
const unpackRetrievedFiles = async (cidFileRefs) => {
  try {
    const len = cidFileRefs.length
    const jsonFileNames = []
    for (let i = 0; i < len; i++) {
      const cid = cidFileRefs[i].cid
      // await Zstd.decompressFileToFile(`${MC.packageRoot}/tmp/cid-files/${cid}.json.zst`, `${MC.packageRoot}/tmp/cid-files/${cid}.json`, (err, result) => {
      //   if (err) { throw err }
      //     console.log (result)
      //   }
      // )
      // if (Fs.existsSync(`${MC.packageRoot}/tmp/cid-files/${cid}.json.zst`)) {
      //   Fs.unlink(`${MC.packageRoot}/tmp/cid-files/${cid}.json.zst`)
      // }
      jsonFileNames.push(`${cid}.json`)
    }
    /* 
     *
     * DO SOMETHING WITH JSON FILES HERE AND REPLACE CIDFILEREFS RETURN STATEMENT
     *
     */
    return cidFileRefs
    process.exit(0)
  } catch (e) {
    console.log('================================== [Function: unpackZstFiles]')
    console.log(e)
    process.exit(0)
  }
}

// ----------------------------------------------- deleteJsonFilesFromTempFolder
const deleteJsonFilesFromTempFolder = async (files) => {
  try {
    const len = files.length
    for (let i = 0; i < len; i++) {
      const file = files[i]
      if (Fs.existsSync(`${MC.packageRoot}/tmp/cid-files/${file.cid}.json`)) {
        Fs.unlink(`${MC.packageRoot}/tmp/cid-files/${file.cid}.json`)
      }
    }
  } catch (e) {
    console.log('=================== [Function: deleteJsonFilesFromTempFolder]')
    console.log(e)
    process.exit(0)
  }
}

// ----------------------------------------------------- writeCidFilesToDatabase
const writeCidFilesToDatabase = async (files) => {
  try {
    const operations = []
    const len = files.length
    for (let i = 0; i < len; i++) {
      const file = files[i]
      operations.push({
        updateOne: {
          filter: { cid: file.cid },
          update: { $set: file },
          upsert: true
        }
      })
    }
    console.log(operations)
    // const response = await MC.model.Cid.bulkWrite(operations, { ordered: false })
    // const result = response.result
    const result = { nUpserted: len, nModified: len }
    console.log(`→ Total: ${len} | New: ${result.nUpserted} | Updated: ${result.nModified}`)
    // if (result) {
    //   await deleteJsonFilesFromTempFolder(files)
    // }
    return result
  } catch (e) {
    console.log('========================= [Function: writeCidFilesToDatabase]')
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
    await retrieveCidFiles(response.data)
    // const retrievedFiles = await retrieveCidFiles(response.data)
    // const completed = await writeCidFilesToDatabase(retrievedFiles)
    // if (completed && response.data.length === searchParams.size) {
    //   if (pageLimit) {
    //     if (searchParams.page < pageLimit) {
    //       await getCidsFromWeb3Storage(searchParams, true, pageLimit)
    //     }
    //   }
    // }
    process.exit(0)
  } catch (e) {
    console.log('========================== [Function: getCidsFromWeb3Storage]')
    console.log(e)
    process.exit(0)
  }
}

// ///////////////////////////////////////////////////////////////// CidImporter
const CidImporter = async () => {
  console.log('CID import started')
  try {
    await getCidsFromWeb3Storage({ size: 3, page: 1, sortBy: 'Date', sortOrder: 'Desc' }, false, 1)
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
