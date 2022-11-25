// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const CloneDeep = require('lodash/cloneDeep')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const UpdateUser = async (incoming) => {
  try {
    const userId = incoming._id
    const user = await MC.model.User.findById(userId)
    const historyBefore = CloneDeep(user)
    if (!user) { return false }
    const schema = Object.keys(MC.model.User.schema.paths)
    schema.forEach((path) => {
      if (incoming.hasOwnProperty(path)) {
        user[path] = incoming[path]
      }
    })
    const saved = await user.save()
    await MC.model.History.create({
      bucket: 'user',
      event: 'update',
      initiator: userId,
      client: userId,
      subject: userId,
      initiator_ref: 'sl3_users',
      client_ref: 'sl3_users',
      subject_ref: 'sl3_users',
      before: historyBefore,
      after: saved
    })
    return saved
  } catch (e) {
    console.log('========================================= [Logic: UpdateUser]')
    throw e
  }
}

// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
module.exports = UpdateUser
