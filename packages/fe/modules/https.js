// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'
import Fs from 'fs'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////////////////// runHttps
const runHttps = (instance, next) => {
  if (process.env.NODE_ENV === 'development' && typeof instance.options.server === 'object') {
    const rootPath = instance.options.alias['@']
    instance.options.server.https = {
      key: Fs.readFileSync(Path.resolve(instance.options.rootDir, '../../', 'localhost_key.pem')),
      cert: Fs.readFileSync(Path.resolve(instance.options.rootDir, '../../', 'localhost_cert.pem'))
    }
  }
  if (next) { return next() }
}

// ///////////////////////////////////////////////////////////////////// Liftoff
// -----------------------------------------------------------------------------
export default function () {
  runHttps(this)
}
