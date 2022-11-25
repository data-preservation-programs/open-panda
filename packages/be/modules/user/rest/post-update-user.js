console.log('💡 [endpoint] /post-update-user')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const UpdateUser = require('@Module_User/logic/update-user')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/post-update-user', async (req, res) => {
  try {
    const incoming = req.body
    const user = await UpdateUser(incoming)
    if (!user) {
      throw new Error('We could not update your Account information. Please try again.')
    }
    SendData(res, 200, 'User updated succesfully', user)
  } catch (e) {
    console.log('=============================== [Endpoint: /post-update-user]')
    console.log(e)
    SendData(res, 500, 'Something went wrong. Please try again.')
  }
})
