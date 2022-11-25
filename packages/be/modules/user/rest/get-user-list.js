console.log('💡 [endpoint] /get-user-list')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const FindUsers = require('@Module_User/logic/find-users')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-user-list', async (req, res) => {
  const select = req.query.select
  try {
    const users = await FindUsers({}, {}, select)
    if (users.length === 0) { return SendData(res, 403, 'Something went wrong. Try logging in again.') }
    SendData(res, 200, 'User list retrieved succesfully', users)
  } catch (e) {
    console.log('================================== [Endpoint: /get-user-list]')
    console.log(e)
    SendData(res, 403, 'Something went wrong. Try logging in again.')
  }
})
