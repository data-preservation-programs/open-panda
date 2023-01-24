// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const ObjectId = require('mongoose').Types.ObjectId

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
module.exports = (datasetId) => {
  return [

    { $match: { _id: ObjectId(datasetId) } },

    {
      $project: {
        name: 1,
        description: 1,
        description_short: 1,
        data_size: 1,
        preparation_progress: 1,
        documentation_url: 1,
        file_count: 1,
        web_3_storage_token: 1,
        slug: 1,
        bucket: 1,
        license: 1,
        region: 1,
        file_extensions: 1,
        categories: 1,
        resources: 1,
        authors: 1,
        funders: 1
      }
    }

  ]
}
