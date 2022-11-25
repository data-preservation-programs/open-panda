console.log('💡 [endpoint] /logout')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/logout', async (req, res) => {
  const identifier = req.session.identifier
  try {
    if (identifier) {
      req.session.destroy((err) => {
        if (err) { return SendData(res, 403, 'Looks like you are already logged out') }
        res.clearCookie('connect.sid')
        SendData(res, 200, 'You are now logged out')
      })
    } else {
      SendData(res, 403, 'Looks like you are already logged out')
    }
  } catch (e) {
    console.log('====================================================== LOGOUT')
    console.log(e)
    SendData(res, 403, 'Looks like you are already logged out')
  }
})
