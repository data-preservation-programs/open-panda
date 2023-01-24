console.log('💡 [endpoint] /get-dataset')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const GetDatasetQuery = require('@Module_Dataset/queries/get-dataset')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ----------------------------------------------------------------- findDataset
const findDataset = async (datasetId, userId) => {
  try {
    const dataset = await MC.model.Dataset.aggregate(GetDatasetQuery(datasetId, userId))
    return dataset[0]
  } catch (e) {
    console.log('===================================== [Function: findDataset]')
    console.log(e)
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-dataset', async (req, res) => {
  try {
    const datasetId = req.query.dataset_id
    const dataset = await findDataset(datasetId)
    SendData(res, 200, 'Dataset retrieved successfully', dataset)
  } catch (e) {
    console.log('==================================== [Endpoint: /get-dataset]')
    console.log(e)
    SendData(res, 500, 'Something went wrong. Please try again.')
  }
})
