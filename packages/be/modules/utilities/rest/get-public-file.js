console.log('💡 [endpoint] /get-public-file')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, GetFileFromDisk } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-public-file', async (req, res) => {
  try {
    const path = `${MC.publicRoot}/${req.query.path}`
    const download = req.query.hasOwnProperty('download')
    const file = await GetFileFromDisk(path, !download)
    if (download) {
      return res.download(path, req.query.rename)
    }
    if (!file) {
      return SendData(res, 404, 'Can\'t find what you\'re looking for.')
    }
    SendData(res, 200, 'Static file retrieved succesfully', file)
  } catch (e) {
    console.log('================================ [Endpoint: /get-public-file]')
    console.log(e)
    SendData(res, 404, 'Can\'t find what you\'re looking for.')
  }
})
