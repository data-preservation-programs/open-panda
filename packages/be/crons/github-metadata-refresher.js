/**
 *
 * ⏱️️ [Cron | every 1 day] GithubMetadataRefresher
 *
 */

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const ModuleAlias = require('module-alias')
const Path = require('path')
const Axios = require('axios')
const Fs = require('fs-extra')
const Express = require('express')
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
require('@Module_User')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////////////// match
const match = (incoming, original) => {
  let changed
  if (incoming.githubUsername && incoming.githubUsername !== original.githubUsername) {
    original.githubUsername = incoming.githubUsername
    changed = true
  }
  if (incoming.githubAvatarUrl && incoming.githubAvatarUrl !== original.githubAvatarUrl) {
    original.githubAvatarUrl = incoming.githubAvatarUrl
    changed = true
  }
  if (incoming.githubHtmlUrl && incoming.githubHtmlUrl !== original.githubHtmlUrl) {
    original.githubHtmlUrl = incoming.githubHtmlUrl
    changed = true
  }
  return { changed, original }
}

// ///////////////////////////////////////////////////// getAndUpdateGithubUsers
const getAndUpdateGithubUsers = async (databaseUsers) => {
  const len = databaseUsers.length
  for (let i = 0; i < len; i++) {
    let user
    try {
      user = databaseUsers[i]
      const options = { headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}` } }
      const response = await Axios.get(`https://api.github.com/users/${user.githubUsername}`, options)
      const { changed, original } = match(response.data, databaseUsers[i])
      if (changed) {
        await original.save()
      }
    } catch (e) {
      if (e.response.status === 404) {
        console.log(`❗️ Missing user: ${e.config.url.split('/').pop()}`)
        user.disabled = true
        await user.save()
      } else {
        console.log('===================== [Function: getAndUpdateGithubUsers]')
        console.log(e)
      }
      continue
    }
  }
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
MC.app.on('mongoose-connected', async () => {
  console.log('🤖 Github metadata refresher started')
  const databaseUsers = await MC.model.User.find({}).select('githubUsername githubAvatarUrl githubHtmlUrl email')
  await getAndUpdateGithubUsers(databaseUsers)
  console.log('🏁 Github metadata refresher complete')
  process.exit(0)
})
