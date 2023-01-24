console.log('💿 [model] op_datasets')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

// ////////////////////////////////////////////////////////////////////// Schema
// -----------------------------------------------------------------------------
const DatasetSchema = new Schema({
  name: {
    type: String,
    required: allowEmptyIfNew
  },
  description: {
    type: String,
    required: allowEmptyIfNew
  },
  description_short: {
    type: String,
    required: allowEmptyIfNew
  },
  data_size: {
    type: Number,
    required: true,
    default: 0
  },
  preparation_progress: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3, 4, 5, 6],
    default: 0
  },
  documentation_url: {
    type: String,
    required: false
  },
  file_count: {
    type: Number,
    required: false
  },
  web_3_storage_token: {
    type: String,
    required: allowEmptyIfNew
  },
  slug: {
    type: String,
    required: false
  },
  bucket: {
    type: String,
    required: false
  },
  license: {
    type: String,
    required: false
  },
  region: {
    type: String,
    required: false
  },
  file_extensions: {
    type: String,
    required: false
  },
  categories: [{
    type: String,
    required: false
  }],
  resources: [{
    type: String,
    required: false
  }],
  authors: [{
    type: String,
    required: false
  }],
  funders: [{
    type: String,
    required: false
  }]
}, {
  timestamps: true
})

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
function allowEmptyIfNew () {
  return !this.new
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = Mongoose.model('op_datasets', DatasetSchema)
