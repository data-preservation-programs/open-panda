/*
 *
 * 📦 [module] uploader
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'

// ///////////////////////////////////////////////////////////////////// Plugins
const UploaderPlugin = Path.resolve(__dirname, 'plugins/index.js')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////////////// registerPlugin
const registerPlugin = (instance, next) => {
  return new Promise((next) => {
    const UploaderPluginDst = instance.addTemplate({
      src: UploaderPlugin,
      fileName: 'uploader/plugin-index.js'
    }).dst
    instance.options.plugins.push({
      src: Path.join(instance.options.buildDir, UploaderPluginDst),
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
