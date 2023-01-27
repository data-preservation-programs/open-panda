console.log('💡 [endpoint] /get-dataset-list')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, ParseQuerySearch, ParseQuerySort } = require('@Module_Utilities')
const GetDatasetListQuery = require('@Module_Dataset/queries/get-dataset-list')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ----------------------------------------------------------------- parseNumber
const parseNumber = (page) => {
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
const findDatasets = async (search = '', page = 1, limit = 10, sort = {}) => {
  try {
    return process(
      await MC.model.Dataset.aggregate(
        GetDatasetListQuery(search, page, limit, sort)
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
    console.log(query)
    const search = await ParseQuerySearch(query.search)
    const page = await parseNumber(query.page)
    const limit = await parseNumber(query.limit)
    const sort = await ParseQuerySort(query.sort)
    const payload = await findDatasets(search, page, limit, sort)
    SendData(res, 200, 'Datasets retrieved succesfully', payload)
  } catch (e) {
    console.log('=============================== [Endpoint: /get-dataset-list]')
    console.log(e)
    SendData(res, 404, 'Can\'t find what you\'re looking for.', { metadata: {}, results: [] })
  }
})
