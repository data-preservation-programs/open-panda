/*
 *
 * 📦 [module] ls
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'

// ///////////////////////////////////////////////////////////////////// Plugins
const LsPlugin = Path.resolve(__dirname, 'plugins/index.js')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////////////// registerPlugin
const registerPlugin = (ctx, next) => {
  return new Promise((next) => {
    const plugins = [
      { src: LsPlugin, fileName: 'ls/plugin-ls.js' }
    ]
    plugins.forEach((plugin) => {
      ctx.addPlugin({
        src: plugin.src,
        fileName: plugin.fileName,
        mode: 'client',
        options: JSON.stringify(ctx.options.ls)
      })
    })
    next()
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function () {
  await registerPlugin(this)
}
