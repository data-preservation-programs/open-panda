module.exports = (search = '', page = 1, limit = 10, sort = {}) => {
  const skip = (page - 1) * limit
  return [

    {
      $match: {
        $expr: {
          $and: [
            {
              $or: [
                { $regexMatch: { input: '$name', regex: search, options: 'i' } },
                { $regexMatch: { input: '$description', regex: search, options: 'i' } }
              ]
            }
          ]
        }
      }
    },

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
    },

    { $sort: Object.assign({ createdAt: -1 }, sort) },

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
