// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
module.exports = async (incoming, populate = false) => {
  try {
    const dataset = await MC.model.Dataset.findById(incoming._id)
    if (dataset) {
      const schema = Object.keys(MC.model.Dataset.schema.paths)
      schema.forEach((path) => {
        if (incoming.hasOwnProperty(path)) {
          dataset[path] = incoming[path]
        }
      })
      const saved = await dataset.save()
      if (populate) { return await saved.populate(populate) }
      return saved
    }
    return false
  } catch (e) {
    console.log('====================================== [Logic: UpdateDataset]')
    throw e
  }
}
