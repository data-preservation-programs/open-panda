// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Axios = require('axios')
const FindUser = require('@Module_User/logic/find-user')
const CreateUser = require('@Module_User/logic/create-user')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////////////// getAccessToken
const getAccessToken = async (req, tempToken) => {
  const body = {
    client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
    client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    code: tempToken
  }
  const options = { headers: { Accept: 'application/json' } }
  try {
    const response = await Axios.post('https://github.com/login/oauth/access_token', body, options)
    const data = response.data
    if (!data.hasOwnProperty('error')) { return data.access_token }
    if (req.session.identifier) { req.session.destroy() }
    throw new Error(data.error_description || 'Generate a new token by logging in again')
  } catch (e) {
    console.log('================================== [Function: getAccessToken]')
    throw e
  }
}

// /////////////////////////////////////////////////////////// getUserFromGithub
const getUserFromGithub = async (token) => {
  const options = { headers: { Accept: 'application/json', Authorization: `token ${token}` } }
  try {
    const response = await Axios.get('https://api.github.com/user', options)
    const data = response.data
    return {
      githubUsername: data.login,
      githubAvatarUrl: data.avatar_url,
      githubHtmlUrl: data.html_url,
      email: data.email
    }
  } catch (e) {
    console.log('=============================== [Function: getUserFromGithub]')
    throw e
  }
}

// /////////////////////////////////////////////////////////////// createNewUser
const createNewUser = async (githubUser, projections, token) => {
  try {
    if (typeof githubUser.email === 'object') {
      const email = await getEmails(token)
      if (email) { githubUser.email = email }
    }
    const select = projections.split(' ')
    let created = await CreateUser(githubUser)
    if (!created) { throw new Error('Something went wrong') }
    created = created.toJSON()
    const compiled = {}
    const len = select.length
    for (let i = 0; i < len; i++) {
      const key = select[i]
      compiled[key] = created[key]
    }
    delete compiled._id
    return compiled
  } catch (e) {
    console.log('=================================== [Function: createNewUser]')
    throw e
  }
}

// /////////////////////////////////////////////////////////////////// getEmails
const getEmails = async (token) => {
  const options = { headers: { Accept: 'application/json', Authorization: `token ${token}` } }
  try {
    const response = await Axios.get('https://api.github.com/user/emails', options)
    const found = response.data.find(obj => obj.verified && obj.visibility === 'public')
    if (found) { return found.email }
    return false
  } catch (e) {
    console.log('======================================= [Function: getEmails]')
    throw e
  }
}

// /////////////////////////////////////////////////////////////// createSession
const createSession = (req, user) => {
  return new Promise((resolve) => {
    req.session.identifier = user
    resolve()
  })
}

// //////////////////////////////////////////////////////////////// populateUser
const populateUser = (user, existingUser) => {
  return new Promise((resolve) => {
    if (existingUser) {
      const isAdmin = existingUser.isAdmin
      user.email = existingUser.email
      user.registered = existingUser.registered
      if (isAdmin) {
        user.isAdmin = isAdmin
      }
    }
    resolve(user)
  })
}

// //////////////////////////////////////////////////////// TradeTokenAndGetUser
const TradeTokenAndGetUser = async (req, tempToken) => {
  try {
    const token = await getAccessToken(req, tempToken)
    let user = await getUserFromGithub(token)
    // Find existing user
    const query = { $or: [{ githubUsername: user.githubUsername }, { email: user.email }] }
    const projections = '_id githubUsername githubAvatarUrl githubHtmlUrl email isAdmin registered'
    const existingUser = await FindUser(query, projections)
    // If none exists, create new user
    if (!existingUser) {
      user = await createNewUser(user, projections, token) // user gets turned into an "identifier" here
    }
    await populateUser(user, existingUser)
    // Create session
    await createSession(req, user)
    return user
  } catch (e) {
    console.log('============================ [Function: TradeTokenAndGetUser]')
    throw e
  }
}

// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
module.exports = {
  TradeTokenAndGetUser
}
