/**
 *
 * ⏱️️ [Script] Failed CID Import Scraper
 *
 * Temporary script to scrape pm2 logs from the CID Importer cron and find any failed CID retrievals
 * These CIDs are saved to a txt file in the tmp folder called failed-cid-retrievals.txt
 */

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const Path = require('path')
const Fs = require('fs-extra')
const Util = require('util')
const Stream = require('stream')
const Pipeline = Util.promisify(Stream.pipeline)
const readline = require('node:readline')
require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

const MC = require('../config')

const CID_TMP_DIR = Path.resolve(`${MC.packageRoot}/tmp/cid-files`)

// /////////////////////////////////////////////////////////////////// Functions
// --------------------------------------------- ParseLogsForFailedCidRetrievals
const ParseLogsForFailedCidRetrievals = async () => {
  try {
    console.log('Starting search for failed CID retrievals.')
    if (Fs.existsSync(`${CID_TMP_DIR}/cid-importer-pm2-logs.txt`)) {
      const pm2log = Fs.createReadStream(`${CID_TMP_DIR}/cid-importer-pm2-logs.txt`)
      const rl = readline.createInterface({
        input: pm2log,
        crlfDelay: Infinity
      })
      const failedCids = []
      for await (const line of rl) {
        if (line.includes('Max retries reached')) {
          const terms = line.split(' ').filter(item => item.endsWith('.'))
          const cid = terms[0].replace('.', '')
          failedCids.push(cid)
        }
      }
      console.log(failedCids)
      const len = failedCids.length
      for (let i = 0; i < len; i++) {
        const newline = failedCids[i]
        await Pipeline(`${newline}\n`, Fs.createWriteStream(`${CID_TMP_DIR}/failed-cid-retrievals.txt`, { flags: 'a' }))
      }
    } else {
      console.log('Could not find file cid-importer-pm2-logs.txt.')
    }
    console.log('Finished parsing logs for failed CID retrievals. CIDs stored to the temp folder in failed-cid-retrievals.txt.')
    process.exit(0)
  } catch (e) {
    console.log('================= [Function: ParseLogsForFailedCidRetrievals]')
    console.log(e)
    process.exit(0)
  }
}; ParseLogsForFailedCidRetrievals()
