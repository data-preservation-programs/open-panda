console.log('🚗 [script] app version checker')

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const ModuleAlias = require('module-alias')
const Path = require('path')
const Fs = require('fs-extra')
const Spawn = require('child_process').spawn
const Moment = require('moment-timezone')

require('dotenv').config({ path: Path.resolve(__dirname, '../../.env') })

const MC = require('../../config')

// ///////////////////////////////////////////////////////////////////// Aliases
ModuleAlias.addAliases({
  '@Root': MC.packageRoot,
  '@Static': `${MC.packageRoot}/static`,
  '@Public': `${MC.packageRoot}/public`,
  '@Cache': `${MC.packageRoot}/cache`,
  '@Modules': `${MC.packageRoot}/modules`
})

// ///////////////////////////////////////////////////////////////////// Modules
const {
  GenerateWebsocketClient
} = require(`${MC.packageRoot}/modules/utilities`)

/// ////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ======================================================================== fire
const fire = (socket) => {
  const date = Moment().tz('UTC')
  console.log(`🚀 | ${date.toISOString().split('T')[0]}T${date.hours()}:${date.minutes()}:${date.seconds()}`)
  const manifestPath = `${MC.tmpRoot}/app-version.json`
  const manifest = JSON.parse(Fs.readFileSync(manifestPath))
  const recordedVersion = manifest.version
  const git = Spawn('git', [
    'rev-parse',
    '--short',
    'HEAD'
  ])
  const errors = []
  let currentVersion
  git.stdout.on('data', (msg) => { currentVersion = msg.toString() })
  git.stderr.on('data', msg => errors.push(msg.toString()))
  git.on('exit', async (code) => {
    const err = errors.length > 0 && code !== 0
    if (err) { socket.emit('cron|app-version-changed|initialize', false); return }
    const changed = recordedVersion !== currentVersion
    if (changed) {
      console.log(`   changed | ${currentVersion}`)
      manifest.version = currentVersion
      Fs.writeFileSync(manifestPath, JSON.stringify(manifest))
    }
    socket.emit('cron|app-version-changed|initialize', changed)
  })
}

/// ///////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
const AppVersionChecker = async () => {
  try {
    let interval
    await GenerateWebsocketClient((socket) => {
      if (interval) { clearInterval(interval) }
      interval = setInterval(() => {
        fire(socket)
      }, 1000)
    })
  } catch (e) {
    console.log('================================= [Script: AppVersionChecker]')
    console.log(e)
    process.exit(0)
  }
}; AppVersionChecker()
