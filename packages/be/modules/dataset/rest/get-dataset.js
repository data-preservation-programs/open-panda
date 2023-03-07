console.log('💡 [endpoint] /get-dataset')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-dataset', async (req, res) => {
  try {
    const datasetSlug = req.query.slug
    const dataset = await MC.model.Dataset.findOne({ slug: datasetSlug })
    SendData(res, 200, 'Dataset retrieved successfully', dataset)
  } catch (e) {
    console.log('==================================== [Endpoint: /get-dataset]')
    console.log(e)
    SendData(res, 500, 'Something went wrong. Please try again.')
  }
})
