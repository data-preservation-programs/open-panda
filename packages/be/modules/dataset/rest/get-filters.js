console.log('💡 [endpoint] /get-filters')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, GetFileFromDisk } = require('@Module_Utilities')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
const processCategories = async (datasets) => {
  const nonUniqueCategories = datasets.map(dataset => dataset.categories).flat()
  const categories = [...new Set(nonUniqueCategories)].map(category => ({
    value: category,
    label: category
  }))
  categories.forEach((category) => {
    const categoryName = category.value
    const len = nonUniqueCategories.length
    let count = 0
    for (let i = 0; i < len; i++) {
      if (nonUniqueCategories[i] === categoryName) {
        count++
      }
    }
    category.count = count
  })
  return categories
}

const processFileExtensions = async (datasets) => {
  let extensions = datasets.map(dataset => dataset.file_extensions)
  extensions = extensions.map(string => string.split(','))
    .flat()
    .map(ext => ext.trim().toLowerCase())
    .filter(ext => !ext.includes('various'))
  return [...new Set(extensions)].map(filetype => ({
    value: filetype,
    label: filetype
  }))
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-filters', async (req, res) => {
  try {
    const staticSorts = await GetFileFromDisk(`${MC.staticRoot}/sort.json`, true)
    const staticLimits = await GetFileFromDisk(`${MC.staticRoot}/limit.json`, true)
    const staticFilters = await GetFileFromDisk(`${MC.staticRoot}/fully-stored.json`, true)
    const staticLicenses = await GetFileFromDisk(`${MC.staticRoot}/licenses.json`, true)
    const staticLocation = await GetFileFromDisk(`${MC.staticRoot}/location.json`, true)
    const datasets = await MC.model.Dataset
      .find({})
      .select('categories file_extensions license location')
    const categories = await processCategories(datasets)
    const fileType = await processFileExtensions(datasets)
    const filters = {
        categories,
        fileType,
        fullyStored: staticFilters.fullyStored,
        licenses: staticLicenses.licenses,
        location: staticLocation.location
      }
    const data = { sort: staticSorts.sort, limit: staticLimits.limit, filters }
    SendData(res, 200, 'Static file retrieved succesfully', data)
  } catch (e) {
    console.log('==================================== [Endpoint: /get-filters]')
    console.log(e)
    SendData(res, 500, 'Something went wrong. Please try again.')
  }
})
