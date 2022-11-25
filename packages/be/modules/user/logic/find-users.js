// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const MC = require('@Root/config')

// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
module.exports = async (query = {}, projections = {}, select = '-_id firstName') => {
  return await MC.model.User.find(query, projections).lean().select(select)
}
