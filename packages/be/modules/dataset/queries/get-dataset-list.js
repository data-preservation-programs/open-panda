// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////// matchFilterIfFilterExists
const matchFilterIfFilterExists = (categories, fileExtensions, licenses, datasetSizeMin, datasetSizeMax) => {
  const $match = {
    ...((categories || fileExtensions || licenses || datasetSizeMin || datasetSizeMax) && { $expr: { $or: [] } })
  }
  if (categories) {
    $match.$expr.$or.push({ $eq: ['$category_matched', true] })
  }
  if (fileExtensions) {
    $match.$expr.$or.push({ $eq: ['$file_extensions_matched', true] })
  }
  if (licenses) {
    $match.$expr.$or.push({ $eq: ['$license_tag_matched', true] })
  }
  if (datasetSizeMin !== undefined && datasetSizeMax !== undefined) {
    $match.$expr.$or.push({
      $and: [
        { $gte: ['$data_size', datasetSizeMin] },
        { $lte: ['$data_size', datasetSizeMax] }
      ]
    })
  }
  return { $match }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = (search = '', page = 1, limit = 10, sort = {}, filters = {}) => {
  const skip = (page - 1) * limit
  const categories = filters.categories
  const fileExtensions = filters.fileExtensions
  const licenses = filters.licenses
  const datasetSizeMin = filters.datasetSizeMin
  const datasetSizeMax = filters.datasetSizeMax
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
      $addFields: {
        /**
         * Concatenate all the categories ['Healthcare', 'Astronomy'] into a
         * string with output: ',Healthcare,Atronomy'
         */
        categories_concatenated_to_string: {
          $reduce: {
            input: '$categories',
            initialValue: '',
            in: {
              $concat: ['$$value', ',', '$$this']
            }
          }
        },
        /**
         * Concatenate all the fileExtensions ['.csv', '.html'] into a
         * string with output: ',.csv,.html'
         */
        file_extensions_concatenated_to_string: {
          $reduce: {
            input: '$file_extensions',
            initialValue: '',
            in: {
              $concat: ['$$value', ',', '$$this']
            }
          }
        }
      }
    },

    {
      $addFields: {
        category_matched: {
          /**
           * Loop filters.fileExtensions, which is an array of strings and attempt to
           * partially match each value to the concatenated string from the db.
           * If the returned filtered array size is > 0, then return true
           */
          $cond: {
            if: categories && categories.length > 0,
            then: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: categories || [],
                      cond: {
                        $eq: [
                          {
                            $regexMatch: {
                              input: '$categories_concatenated_to_string',
                              regex: '$$this',
                              options: 'i'
                            }
                          },
                          true
                        ]
                      }
                    }
                  }
                },
                0
              ]
            },
            else: false
          }
        },
        file_extensions_matched: {
          /**
           * Loop filters.categories, which is an array of strings and attempt to
           * partially match each value to the concatenated string from the db.
           * If the returned filtered array size is > 0, then return true
           */
          $cond: {
            if: fileExtensions && fileExtensions.length > 0,
            then: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: fileExtensions || [],
                      cond: {
                        $eq: [
                          {
                            $regexMatch: {
                              input: '$file_extensions_concatenated_to_string',
                              regex: '$$this',
                              options: 'i'
                            }
                          },
                          true
                        ]
                      }
                    }
                  }
                },
                0
              ]
            },
            else: false
          }
        },
        license_tag_matched: {
          /**
           * Loop filters.licenses, which is an array of strings and attempt to
           * partially match each value to the string from the db.
           * If the returned filtered array size is > 0, then return true
           */
          $cond: {
            if: licenses && licenses.length > 0,
            then: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: licenses || [],
                      cond: {
                        $eq: [
                          {
                            $regexMatch: {
                              input: '$license_tag',
                              regex: '$$this',
                              options: 'i'
                            }
                          },
                          true
                        ]
                      }
                    }
                  }
                },
                0
              ]
            },
            else: false
          }
        }
      }
    },

    matchFilterIfFilterExists(categories, fileExtensions, licenses, datasetSizeMin, datasetSizeMax),

    {
      $project: {
        category_matched: 1,
        file_extensions_matched: 1,
        license_tag_matched: 1,
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
        license_tag: 1,
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
