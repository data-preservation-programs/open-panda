console.log('💡 [endpoint] /get-cid-list')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const GetCidListQuery = require('@Module_Cid/queries/get-cid-list')
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

// -------------------------------------------------------------------- findCids
const findCids = async (dataset, page = 1, limit = 10) => {
  try {
    return process(
      await MC.model.Cid.aggregate(GetCidListQuery(dataset, page, limit))
    )
  } catch (e) {
    console.log('======================================== [Function: findCids]')
    console.log(e)
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-cid-list', async (req, res) => {
  try {
    const query = req.query
    const dataset = query.slug
    const page = await parseNumber(query.page)
    const limit = await parseNumber(query.limit)
    // console.log(query)
    const payload = await findCids(dataset, page, limit)
    // console.log(payload)
    SendData(res, 200, 'Cids retrieved succesfully', payload)
  } catch (e) {
    console.log('=================================== [Endpoint: /get-cid-list]')
    console.log(e)
    SendData(res, 404, 'Can\'t find what you\'re looking for.', {})
  }
})
