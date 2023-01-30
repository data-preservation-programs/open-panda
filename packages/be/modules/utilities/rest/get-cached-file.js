console.log('💡 [endpoint] /get-cached-file')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, GetFileFromDisk } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-cached-file', async (req, res) => {
  try {
    const file = await GetFileFromDisk(`${MC.cacheRoot}/${req.query.path}`, true)
    if (!file) {
      return SendData(res, 404, 'Can\'t find what you\'re looking for.')
    }
    SendData(res, 200, 'Static file retrieved succesfully', file)
  } catch (e) {
    console.log('================================ [Endpoint: /get-cached-file]')
    console.log(e)
    SendData(res, 404, 'Can\'t find what you\'re looking for.')
  }
})
