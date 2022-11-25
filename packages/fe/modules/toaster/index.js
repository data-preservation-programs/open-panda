/*
 *
 * 📦 [module] toaster
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'

// ///////////////////////////////////////////////////////////////////// Plugins
const ToasterPlugin = Path.resolve(__dirname, 'plugins/index.js')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////// performStartupChecks
const performStartupChecks = (instance) => {
  // Check for existence of config variables
  return new Promise((next) => {
    const Config = instance.options
    if (!Config.hasOwnProperty('toaster')) { throw new Error('"toaster" configuration block is missing from nuxt.config.js') }
    if (!Config.toaster.hasOwnProperty('display')) { throw new Error('"toaster.display" parameter is missing from nuxt.config.js') }
    if (!Config.toaster.hasOwnProperty('timeout')) { throw new Error('"toaster.timeout" parameter is missing from nuxt.config.js') }
    next()
  })
}

// ////////////////////////////////////////////////////////////// registerPlugin
const registerPlugin = (instance, next) => {
  return new Promise((next) => {
    const ToasterPluginDst = instance.addTemplate({
      src: ToasterPlugin,
      fileName: 'toaster/plugin-toaster.js'
    }).dst
    instance.options.plugins.push({
      src: Path.join(instance.options.buildDir, ToasterPluginDst),
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
  await registerPlugin(this)
}
