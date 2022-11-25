console.log('💡 [endpoint] /authenticate')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/authenticate', (req, res) => {
  const identifier = req.session.identifier
  if (identifier) { return SendData(res, 200, 'Authenticated', identifier) }
  SendData(res, 403, 'You are not logged in')
})
