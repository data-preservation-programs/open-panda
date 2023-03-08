// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { GetFileFromDisk } = require('@Module_Utilities')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////// processCategories
// -----------------------------------------------------------------------------
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
// -----------------------------------------------------------------------------
const processFileExtensions = async (datasets) => {
  const extensions = datasets.map(dataset => dataset.file_extensions)
    .flat()
    .map(ext => ext.trim().toLowerCase())
    .filter(ext => !ext.includes('various'))
  return [...new Set(extensions)].map(fileExtension => ({
    value: fileExtension,
    label: fileExtension
  }))
}

// /////////////////////////////////////////////////////// exponentialThroughMax
// -----------------------------------------------------------------------------
const exponentialThroughMax = (x, max, start) => {
  const a = start || 1000000000
  const b = Math.exp(Math.log(max / a) / max)
  return a * Math.pow(b, x)
}

// ////////////////////////////////////////////////// processHistogramSizeRanges
// -----------------------------------------------------------------------------
// the second argument, bars, determines the number of segments in the histogram graph
const processHistogramSizeRanges = async (datasets, bars) => {
  const segments = []
  const datasetSizes = datasets.map(dataset => dataset.data_size)
  const maxDatasetSize = Math.max(...datasetSizes) * 1.5
  const stepSize = maxDatasetSize / bars
  for (let i = 0; i < bars; i++) {
    segments.push({
      min: exponentialThroughMax(i * stepSize, maxDatasetSize),
      max: exponentialThroughMax((i + 1) * stepSize, maxDatasetSize)
    })
  }
  segments.unshift({
    min: 0,
    max: exponentialThroughMax(0, maxDatasetSize)
  })
  segments.forEach((segment) => {
    const datasetsInSegment = datasets.filter(dataset => dataset.data_size >= segment.min && dataset.data_size < segment.max)
    segment.count = datasetsInSegment.length
  })
  return { segments }
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
module.exports = async () => {
  try {
    const staticFilters = await GetFileFromDisk(`${MC.staticRoot}/filters.json`, true)
    const datasets = await MC.model.Dataset
      .find({})
      .select('categories file_extensions license location data_size')
    return {
      sort: staticFilters.sort,
      limit: staticFilters.limit,
      filters: Object.assign({
        categories: await processCategories(datasets),
        fileExtensions: await processFileExtensions(datasets)
      }, staticFilters.filters),
      histogram: await processHistogramSizeRanges(datasets, 40)
    }
  } catch (e) {
    console.log('========================================= [Logic: GetFilters]')
    console.log(e)
  }
}
