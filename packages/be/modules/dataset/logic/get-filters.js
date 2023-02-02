// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { GetFileFromDisk } = require('@Module_Utilities')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////// processCategories
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

// /////////////////////////////////////////////////////// processFileExtensions
const processFileExtensions = async (datasets) => {
  const extensions = datasets.map(dataset => dataset.file_extensions)
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
module.exports = async () => {
  try {
    const staticFilters = await GetFileFromDisk(`${MC.staticRoot}/filters.json`, true)
    const datasets = await MC.model.Dataset
      .find({})
      .select('categories file_extensions license location')
    return {
      sort: staticFilters.sort,
      limit: staticFilters.limit,
      filters: Object.assign({
        categories: await processCategories(datasets),
        fileTypes: await processFileExtensions(datasets)
      }, staticFilters.filters)
    }
  } catch (e) {
    console.log('========================================= [Logic: GetFilters]')
    console.log(e)
  }
}
