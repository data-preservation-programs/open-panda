/*
 *
 * 📦 [Module] Auth
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'

// ///////////////////////////////////////////////////////////////////// Plugins
const AuthPlugin = Path.resolve(__dirname, 'plugins/index.js')
const HelpersPlugin = Path.resolve(__dirname, 'plugins/helpers.js')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////// performStartupChecks
const performStartupChecks = (instance) => {
  // Check for existence of config variables
  return new Promise((next) => {
    const Config = instance.options
    if (!Config.hasOwnProperty('auth')) { throw new Error('"auth" configuration block is missing from nuxt.config.js') }
    if (!Config.auth.hasOwnProperty('redirectAfterLogin')) { throw new Error('"auth.redirectAfterLogin" parameter is missing from nuxt.config.js') }
    if (!Config.auth.redirectAfterLogin.hasOwnProperty('registered')) { throw new Error('"auth.redirectAfterLogin.registered" parameter is missing from nuxt.config.js') }
    if (!Config.auth.redirectAfterLogin.registered.hasOwnProperty('path')) { throw new Error('"auth.redirectAfterLogin.registered.path" parameter is missing from nuxt.config.js') }
    if (!Config.auth.redirectAfterLogin.registered.hasOwnProperty('key')) { throw new Error('"auth.redirectAfterLogin.registered.key" parameter is missing from nuxt.config.js') }
    if (!Config.auth.redirectAfterLogin.hasOwnProperty('unregistered')) { throw new Error('"auth.redirectAfterLogin.unregistered" parameter is missing from nuxt.config.js') }
    if (!Config.auth.redirectAfterLogin.unregistered.hasOwnProperty('path')) { throw new Error('"auth.redirectAfterLogin.unregistered.path" parameter is missing from nuxt.config.js') }
    if (!Config.auth.redirectAfterLogin.unregistered.hasOwnProperty('key')) { throw new Error('"auth.redirectAfterLogin.unregistered.key" parameter is missing from nuxt.config.js') }
    if (!Config.auth.hasOwnProperty('redirectAfterLogout')) { throw new Error('"auth.redirectAfterLogout" parameter is missing from nuxt.config.js') }
    if (!Config.publicRuntimeConfig.hasOwnProperty('githubOAuthLink')) {
      throw new Error('"publicRuntimeConfig.githubOAuthLink" parameter is missing from nuxt.config.js')
    }
    next()
  })
}

// ////////////////////////////////////////////////////////// registerMiddleware
const registerMiddleware = (instance, next) => {
  return new Promise((next) => {
    // The functionality of the middleware below is imported in the Authentication Plugin
    instance.options.router.middleware.push('github')
    next()
  })
}

// ////////////////////////////////////////////////////////////// registerPlugin
const registerPlugin = (instance, next) => {
  return new Promise((next) => {
    const AuthPluginDst = instance.addTemplate({
      src: AuthPlugin,
      fileName: 'auth/plugin-auth.js'
    }).dst
    const HelpersPluginDst = instance.addTemplate({
      src: HelpersPlugin,
      fileName: 'auth/plugin-helpers.js'
    }).dst
    instance.options.plugins.push({
      src: Path.join(instance.options.buildDir, AuthPluginDst),
      ssr: undefined,
      mode: undefined
    })
    instance.options.plugins.push({
      src: Path.join(instance.options.buildDir, HelpersPluginDst),
      ssr: undefined,
      mode: undefined
    })
    next()
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function () {
  await performStartupChecks(this)
  await registerMiddleware(this)
  await registerPlugin(this)
}
