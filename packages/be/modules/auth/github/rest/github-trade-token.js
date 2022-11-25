console.log('💡 [endpoint] /github-trade-token')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const { TradeTokenAndGetUser } = require('@Module_Auth/github/logic/trade-token')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/github-trade-token', async (req, res) => {
  const tempToken = req.query.token
  if (!tempToken) { return SendData(res, 422, 'GitHub OAuth Token is missing') }
  try {
    const session = await TradeTokenAndGetUser(req, tempToken)
    SendData(res, 200, 'You are now logged in', session)
  } catch (e) {
    console.log(e.message)
    SendData(res, 422, 'Something went wrong, please try logging in again')
  }
})
