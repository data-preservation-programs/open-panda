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
const plugins = ['index', 'form', 'field']

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////////////// registerPlugin
const registerPlugin = (instance, next) => {
  return new Promise((next) => {
    plugins.forEach((plugin) => {
      const dst = instance.addTemplate({
        src: Path.resolve(__dirname, `plugins/${plugin}.js`),
        fileName: `form/plugin-${plugin}.js`
      }).dst
      instance.options.plugins.push({
        src: Path.join(instance.options.buildDir, dst),
        ssr: undefined,
        mode: undefined
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
