/**
 *
 * ⏱️️ [Cron | every 1 day] Backerupper
 *
 */

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const ModuleAlias = require('module-alias')
const Path = require('path')
const Fs = require('fs-extra')
const Spawn = require('child_process').spawn
const Archiver = require('archiver')('zip')
const Moment = require('moment-timezone')

require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

const MC = require('../config')

const BACKUP_PATH = Path.resolve(MC.serverRoot, 'backups')
const BACKUP_TMP_PATH = Path.resolve(MC.serverRoot, 'backups', 'tmp')

// ///////////////////////////////////////////////////////////////////// Aliases
ModuleAlias.addAliases({
  '@Root': MC.packageRoot,
  '@Static': `${MC.packageRoot}/static`,
  '@Public': `${MC.packageRoot}/public`,
  '@Cache': `${MC.packageRoot}/cache`,
  '@Modules': `${MC.packageRoot}/modules`
})

try {
  const modulesRoot = `${MC.packageRoot}/modules`
  const items = Fs.readdirSync(modulesRoot)
  items.forEach((name) => {
    const path = `${modulesRoot}/${name}`
    if (Fs.statSync(path).isDirectory()) {
      const moduleName = (name[0].toUpperCase() + name.substring(1)).replace(/-./g, x => x[1].toUpperCase())
      ModuleAlias.addAlias(`@Module_${moduleName}`, path)
    }
  })
} catch (e) {
  console.log(e)
}

// ///////////////////////////////////////////////////////////////////// Modules
const { SecondsToHms, DateIsToday } = require('@Module_Utilities')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////////////// autoCreateDirs
const autoCreateDirs = async () => {
  try {
    const dirs = [BACKUP_PATH, BACKUP_TMP_PATH]
    const len = dirs.length
    for (let i = 0; i < len; i++) {
      const path = dirs[i]
      const exists = await Fs.exists(path)
      if (!exists) {
        await Fs.mkdir(path)
      }
    }
  } catch (e) {
    console.log('================================== [Function: autoCreateDirs]')
    throw e
  }
}

// ////////////////////////////////////////////////////////////////// getBackups
const getBackups = async () => {
  try {
    let backups = await Fs.readdir(BACKUP_PATH)
    backups = backups.filter(filename => filename.includes('zip'))
    if (backups.length === 0) { return [] }
    backups.sort((backup1, backup2) => {
      const date1 = new Date(backup1.split('T')[0])
      const date2 = new Date(backup2.split('T')[0])
      return date2 - date1
    })
    return backups
  } catch (e) {
    console.log('====================================== [Function: getBackups]')
    throw e
  }
}

// /////////////////////////////////////////////////// checkIfTodaysBackupExists
const checkIfTodaysBackupExists = async () => {
  try {
    const backups = await getBackups()
    if (backups.length === 0) { return false }
    const latest = backups[0]
    const date = new Date(Moment(latest.split('T')[0]).tz('UTC').toISOString())
    return DateIsToday(date)
  } catch (e) {
    console.log('======================= [Function: checkIfTodaysBackupExists]')
    throw e
  }
}

// ////////////////////////////////////////////////////////////// backupDatabase
const backupDatabase = () => {
  console.log('→ Database backup started')
  return new Promise((resolve, reject) => {
    const mongodump = Spawn('mongodump', [
      '--ssl',
      `--host=${process.env.DATABASE_HOST}`,
      `--port=${process.env.DATABASE_PORT}`,
      `--sslPEMKeyFile=${Path.resolve(process.env.MONGODB_CLIENT_PEM)}`,
      `--sslCAFile=${Path.resolve(process.env.DPP_CA_PATH)}`,
      `--authenticationMechanism=${process.env.DATABASE_AUTHENTICATION_MECHANISM}`,
      `--authenticationDatabase=${process.env.DATABASE_AUTHENTICATION_DATABASE}`,
      `--db=${process.env.DATABASE_NAME}`,
      // '--collection=sl2_clients', // uncomment for testing to make payload smaller
      `--out=${BACKUP_TMP_PATH}`
    ])
    const errors = []
    mongodump.stderr.on('data', (msg) => {
      errors.push(msg.toString())
    })
    mongodump.on('exit', (code) => {
      const err = errors.length > 0 && code !== 0
      console.log(`${err ? '✕' : '✓'} Database backup ${err ? 'ERROR' : 'complete'}`)
      err ? reject(errors.join('\n\n')) : resolve()
    })
  })
}

// ////////////////////////////////////////////////////////////// backupDiskData
/*
 *
 * Keeping this code in case of wanting future re-use. Function allows for manual
 * selection of files and directories to be copied from anywhere on the server
 * into a specific BACKUP_TMP_PATH
 *
 */

// const backupDiskData = async () => {
//   try {
//     const items = [
//       'dpp:openpanda/.gitignore', // development testing FILE
//       'dpp:openpanda/packages/be/static', // development testing DIR
//       // 'apps/de-fe/.env',
//       // 'apps/ev-fe/.env',
//       // 'apps/re-fe/.env',
//       // 'apps/sl2-fe/.env',
//       // 'apps/sl2-data',
//       // 'apps/sl3/packages/be/cache',
//       // 'apps/sl3/packages/be/public',
//       // 'apps/sl3/packages/be/tmp',
//       // 'apps/sl3/packages/be/.env',
//       // 'apps/sl3/packages/fe/.env',
//       // 'apps/sl3-st/packages/be/.env',
//       // 'apps/sl3-st/packages/fe/.env',
//       // 'apps/pm2_restart.sh',
//       // 'apps/resources'
//     ]
//     const lenI = items.length
//     for (let i = 0; i < lenI; i++) {
//       const item = items[i]
//       const breadcrumbs = item.split('/')
//       const lenJ = breadcrumbs.length
//       let step = ''
//       for (let j = 0; j < lenJ; j++) {
//         step += `${breadcrumbs[j]}/`
//         const src = Path.resolve(MC.serverRoot, step)
//         const path = Path.resolve(MC.serverRoot, BACKUP_TMP_PATH, step)
//         const exists = await Fs.exists(path)
//         if (!exists && Fs.statSync(src).isDirectory()) {
//           await Fs.mkdir(path)
//         }
//       }
//       await Fs.copy(
//         Path.resolve(MC.serverRoot, item),
//         Path.resolve(
//           BACKUP_TMP_PATH,
//           item
//         )
//       )
//     }
//   } catch (e) {
//     console.log('================================== [Function: backupDiskData]')
//     throw e
//   }
// }

// ///////////////////////////////////////////////////////////////////// archive
const archive = async () => {
  console.log('→ Archiving started')
  return new Promise((resolve, reject) => {
    const date = Moment().tz('UTC')
    const zipname = `${date.toISOString().split('T')[0]}T${date.hours()}-${date.minutes()}`
    const output = Fs.createWriteStream(Path.resolve(BACKUP_PATH, `${zipname}.zip`))
    output.on('close', () => {
      console.log('✓ Archiving complete')
      resolve()
    })
    Archiver.pipe(output)
    Archiver.directory(BACKUP_TMP_PATH, zipname)
    Archiver.finalize()
  })
}

// ////////////////////////////////////////////////////////////// clearTmpBackup
const clearTmpBackup = async () => {
  try {
    const files = await Fs.readdir(BACKUP_TMP_PATH)
    const len = files.length
    for (let i = 0; i < len; i++) {
      const itemPath = `${BACKUP_TMP_PATH}/${files[i]}`
      if (Fs.statSync(itemPath).isDirectory()) {
        await Fs.rm(itemPath, { recursive: true })
      } else {
        await Fs.unlink(itemPath)
      }
    }
  } catch (e) {
    console.log('================================== [Function: clearTmpBackup]')
    throw e
  }
}

// ///////////////////////////////////////////////////////////// clearOldBackups
const clearOldBackups = async () => {
  try {
    const backups = await getBackups()
    const backupsToKeep = backups.slice(0, 30)
    const len = backups.length
    for (let i = 0; i < len; i++) {
      const filename = backups[i]
      if (!backupsToKeep.includes(filename)) {
        await Fs.unlink(Path.resolve(BACKUP_PATH, filename))
      }
    }
  } catch (e) {
    console.log('================================= [Function: clearOldBackups]')
    throw e
  }
}

// /////////////////////////////////////////////////////////////// backupOffsite
const backupOffsite = () => {
  console.log('→ B2 offsite backup started')
  return new Promise((resolve, reject) => {
    const rclone = Spawn('rclone', [
      'copy',
      MC.serverRoot,
      process.env.BACKUP_BUCKET,
      '--filter-from',
      process.env.BACKUP_FILTER
    ])
    const errors = []
    rclone.stderr.on('data', (msg) => {
      errors.push(msg.toString())
    })
    rclone.on('exit', (code) => {
      const err = errors.length > 0 && code !== 0
      console.log(`${err ? '✕' : '✓'} B2 offsite backup ${err ? 'ERROR' : 'complete'}`)
      err ? reject(errors.join('\n\n')) : resolve()
    })
  })
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
const Backerupper = async () => {
  console.log('🤖 General backup started')
  try {
    const start = process.hrtime()[0]
    await autoCreateDirs()
    const todaysBackupExists = await checkIfTodaysBackupExists()
    if (!todaysBackupExists) {
      await backupDatabase()
      // await backupDiskData()
      await archive()
      await clearTmpBackup()
      await clearOldBackups()
      if (process.env.SERVER_ENV === 'production') {
        await backupOffsite()
      }
      const end = process.hrtime()[0]
      console.log(`🏁 General backup complete | took ${SecondsToHms(end - start)}`)
    } else {
      console.log('🏁 General backup complete | today\'s backup already exists, new backup not generated')
    }
    process.exit(0)
  } catch (e) {
    console.log('========================================= [Cron: Backerupper]')
    console.log(e)
    process.exit(0)
  }
}; Backerupper()
