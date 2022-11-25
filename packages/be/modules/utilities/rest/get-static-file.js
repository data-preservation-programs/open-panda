console.log('💡 [endpoint] /get-static-file')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, GetFileFromDisk } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-static-file', async (req, res) => {
  try {
    const file = await GetFileFromDisk(`${MC.staticRoot}/${req.query.path}`, true)
    if (!file) {
      return SendData(res, 404, 'Can\'t find what you\'re looking for.')
    }
    SendData(res, 200, 'Static file retrieved succesfully', file)
  } catch (e) {
    console.log('================================ [Endpoint: /get-static-file]')
    console.log(e)
    SendData(res, 404, 'Can\'t find what you\'re looking for.')
  }
})
