/*
 *
 * 📦 [module] form
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'

// ///////////////////////////////////////////////////////////////////// Plugins
const FormPlugin = Path.resolve(__dirname, 'plugins/index.js')
const HelpersPlugin = Path.resolve(__dirname, 'plugins/helpers.js')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////////////// registerPlugin
const registerPlugin = (instance, next) => {
  return new Promise((next) => {
    const FormPluginDst = instance.addTemplate({
      src: FormPlugin,
      fileName: 'form/plugin-index.js'
    }).dst
    const HelpersPluginDst = instance.addTemplate({
      src: HelpersPlugin,
      fileName: 'form/plugin-helpers.js'
    }).dst
    instance.options.plugins.push({
      src: Path.join(instance.options.buildDir, FormPluginDst),
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
  await registerPlugin(this)
}
