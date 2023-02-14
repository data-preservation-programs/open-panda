module.exports = (search = '', page = 1, limit = 10, sort = {}, filters = {}) => {
  const skip = (page - 1) * limit
  const categories = filters.categories
  const fileTypes = filters.fileTypes
  const licenses = filters.licenses
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
         * Concatenate all the fileTypes ['.csv', '.html'] into a
         * string with output: ',.csv,.html'
         */
        filetypes_concatenated_to_string: {
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
           * Loop filters.fileTypes, which is an array of strings and attempt to
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
                      input: filters.categories || [],
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
        filetypes_matched: {
          /**
           * Loop filters.categories, which is an array of strings and attempt to
           * partially match each value to the concatenated string from the db.
           * If the returned filtered array size is > 0, then return true
           */
          $cond: {
            if: fileTypes && fileTypes.length > 0,
            then: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: filters.fileTypes || [],
                      cond: {
                        $eq: [
                          {
                            $regexMatch: {
                              input: '$filetypes_concatenated_to_string',
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
                      input: filters.licenses || [],
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
            else: true
          }
        }
      }
    },

    {
      $match: {
        $expr: {
          $or: [
            { $eq: ['$category_matched', true] },
            { $eq: ['$filetypes_matched', true] },
            { $eq: ['$license_tag_matched', true] }
          ]
        }
      }
    },

    {
      $project: {
        licenses_matched: 1,
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
