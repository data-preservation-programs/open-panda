let startTime
let manifestLength = 0

const logBatchResults = (result, options, batchNo) {
  if (!result) {
    throw new Error(`An issue occured with batch ${batchNo}`)
  }
  if (Array.isArray(options.batchResultKeys) && typeof result === 'object') {
    let batchResults = ''
    options.batchResultKeys.forEach((key) => {
      if (result.hasOwnProperty(key)) {
        batchResults = batchResults + `${key}: ${result[key]}. `
      }
    })
  }
  const activeTasks = `${Pool.stats().activeTasks} batches currently being processed`
  const pendingTasks = `${Pool.stats().pendingTasks} pending batches remaining`
  console.log(`Batch ${batchNo} finished | ${activeTasks} | ${pendingTasks} | ${options.batchResultsMessage} ${batchResults}`)
}

const logFinalResults = (results, manifestLength) => {
  // const finalResults = await getCurrentImportTotal(results)
  console.log(`📒 CID import finished | took ${SecondsToHms(endTime - startTime)}`)
  console.log(`A total of ${finalResults.total} CIDs were processed by the database | ${finalResults.imported} imported | ${finalResults.modified} modified` | `${finalResults.total} total CIDs successfully backed up`)
  console.log(`${manifestLength - finalResults.total} CIDs either already existed in the database or could not be retrieved and have been cached for the next import.`)
}

const scheduleBatchOperation = (
  manifest,
  operation,
  options = {},
  batchNo = 1,
  tasks = [],
  results = [],
  retryQueue = [],
  inRetryLoop = false,
  retry = false
) => {
  try {
    if (batchNo === 1) {
      startTime = process.hrtime()[0]
      manifestLength = manifest.length
    }
    if (inRetryLoop) {
      console.log('The following batch previously failed and is being retried:')
    }
    const batchSize = options.batchSize
    const batch = manifest.slice(0, batchSize)
    tasks.push(
      Pool.exec(operation, [batch, batchNo]).then(async (result) => {
        logBatchResults(result, options, batchNo)
        results.push(result)
      }).catch((e) => {
        if (retry) { retryQueue.push(batch) }
        console.log('================================ Error returned by worker')
        console.error(e)
      })
    )
    // remove batch from the manifest list
    manifest.splice(0, batchSize)
    // If there are items remaining in the manifest list, schedule a next batch
    // If no items remain but retry is enabled and some tasks failed, schedule retries
    // Otherwise proceed with compiling final results
    if (manifest.length) {
      scheduleBatchOperation(manifest, operation, options, ++batchNo, tasks, results, retryQueue, inRetryLoop, retry)
    } else if (retryQueue.length) {
      scheduleBatchOperation(retryQueue, operation, options, 1, tasks, results, [], true)
    } else {
      Promise.all(tasks).catch((e) => {
        console.log('=========================== Error returned by worker pool')
        console.log(e)
        process.exit(0)
      }).then(async () => {
        logFinalResults(results, manifestLength)
        const endTime = process.hrtime()[0]
        Pool.terminate()
        process.exit(0)
      })
    }
  } catch (e) {
    console.log('======================= [Function: performCidBatchOperations]')
    console.log(e)
  }
}

// ================================================================== Initialize
// -----------------------------------------------------------------------------
const initializeWorkerPool = async (manifest, options) => {
  try {
    scheduleBatchOperation(manifest, options)
  } catch (e) {
    console.log('=========================== [Function: Initialize Worker Pool')
    console.log(e)
  }
}
