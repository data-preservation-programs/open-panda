console.log('💡 [endpoint] /get-dataset-list')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, ParseQuerySearch } = require('@Module_Utilities')
const GetDatasetListQuery = require('@Module_Dataset/queries/get-dataset-list')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ------------------------------------------------------------------- parsePage
const parsePage = (page) => {
  return new Promise((resolve) => {
    const parsed = parseInt(page)
    resolve(isNaN(parsed) ? 1 : parsed)
  })
}

// --------------------------------------------------------------------- process
const process = async (data) => {
  const response = data[0]
  // .................................................. metadata when no results
  if (!response.hasOwnProperty('metadata')) {
    response.metadata = {
      totalPages: 1
    }
  }
  return response
}

// ---------------------------------------------------------------- findDatasets
const findDatasets = async (search = '', page = 1, limit = 10) => {
  try {
    return process(
      await MC.model.Dataset.aggregate(
        GetDatasetListQuery(search, page, limit)
      )
    )
  } catch (e) {
    console.log('==================================== [Function: findDatasets]')
    console.log(e)
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-dataset-list', async (req, res) => {
  try {
    const query = req.query
    const search = await ParseQuerySearch(query.search)
    const page = await parsePage(query.page)
    const limit = 50
    const payload = await findDatasets(search, page, limit)
    SendData(res, 200, 'Datasets retrieved succesfully', payload)
  } catch (e) {
    console.log('=============================== [Endpoint: /get-dataset-list]')
    console.log(e)
    SendData(res, 404, 'Can\'t find what you\'re looking for.', { metadata: {}, results: [] })
  }
})
