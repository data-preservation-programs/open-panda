/*
 *
 * 📦 [module] search
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'

// ///////////////////////////////////////////////////////////////////// Plugins
const IndexPlugin = Path.resolve(__dirname, 'plugins/index.js')
const SearchPlugin = Path.resolve(__dirname, 'plugins/search.js')
const FilterPlugin = Path.resolve(__dirname, 'plugins/filter.js')
const SortPlugin = Path.resolve(__dirname, 'plugins/sort.js')
const LimitPlugin = Path.resolve(__dirname, 'plugins/limit.js')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////////////// registerPlugin
const registerPlugin = (instance, next) => {
  return new Promise((next) => {
    const plugins = [
      { src: IndexPlugin, fileName: 'search/plugin-index.js' },
      { src: SearchPlugin, fileName: 'search/plugin-search.js' },
      { src: FilterPlugin, fileName: 'search/plugin-filter.js' },
      { src: SortPlugin, fileName: 'search/plugin-sort.js' },
      { src: LimitPlugin, fileName: 'search/plugin-limit.js' }
    ]
    plugins.forEach((plugin) => {
      const dst = instance.addTemplate({ src: plugin.src, fileName: plugin.fileName }).dst
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
