// ////////////////////////////////////////////////////////////////////// Import
// -----------------------------------------------------------------------------
const Path = require('path')
const exec = require('child_process').exec

const { SendData } = require('@Module_Utilities')
const MC = require('@Root/config')
require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

const REMOTE_EXEC_ENPOINT = process.env.REMOTE_EXEC_ENDPOINT
const REMOTE_EXEC_PATH = process.env.REMOTE_EXEC_PATH
const REMOTE_EXEC_FILENAME = process.env.REMOTE_EXEC_FILENAME

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const executeRemoteProcess = (params = {}) => {
  return new Promise((resolve, reject) => {
    let command = REMOTE_EXEC_PATH + REMOTE_EXEC_FILENAME
    Object.keys(params).forEach((key) => {
      command = `${command} --${key} ${params[key]}`
    })
    const executed = exec(command)
    const results = []
    const errors = []
    executed.stdout.on('data', (msg) => {
      results.push(msg.toString())
    })
    executed.stderr.on('data', msg => {
      errors.push(msg.toString())
    })
    executed.on('exit', (code) => {
      const err = errors.length > 0 && code !== 0
      if (err) {
        reject(errors.join('\n'))
      }
      resolve(results.join('\n'))
    })
  })
}
// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get(REMOTE_EXEC_ENPOINT, async (req, res) => {
  executeRemoteProcess(req.query)
    .then((result) => {
      console.log(result)
      SendData(res, 200, 'Successfully executed remote script')
    })
    .catch((err) => {
      console.log('================================ [Endpoint: /exec-remote]')
      console.log(err)
      SendData(res, 404, 'An error occured')
    })
})
