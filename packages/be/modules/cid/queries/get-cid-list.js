// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = (dataset, search = '', page = 1, limit = 12) => {
  const skip = (page - 1) * limit
  return [

    {
      $match: {
        dataset_slug: dataset
      }
    },

    {
      $match: {
        $expr: {
          $and: [
            {
              $or: [
                { $regexMatch: { input: '$filename', regex: search, options: 'i' } },
                { $regexMatch: { input: '$payload_cid', regex: search, options: 'i' } }
              ]
            }
          ]
        }
      }
    },

    {
      $project: {
        payload_cid: 1,
        raw_car_file_size: 1,
        filename: 1
      }
    },

    {
      $facet: {
        metadata: [
          { $count: 'count' },
          {
            $addFields: {
              page,
              limit,
              totalPages: {
                $ceil: { $divide: ['$count', limit] }
              }
            }
          }
        ],
        results: [
          { $skip: skip },
          { $limit: limit }
        ]
      }
    },

    {
      $project: {
        metadata: { $first: '$metadata' },
        results: '$results'
      }
    }

  ]
}
