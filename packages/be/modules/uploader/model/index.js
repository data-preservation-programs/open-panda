console.log('💿 [model] op_uploads')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

// ////////////////////////////////////////////////////////////////////// Schema
// -----------------------------------------------------------------------------
const UploadSchema = new Schema({
  filename: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  filesize: {
    type: Number,
    required: true
  },
  file_ext: {
    type: String,
    required: true
  },
  upload_status: { // 0 = in progress, 1 = complete, 2 = error
    type: Number,
    required: true,
    enum: [0, 1, 2],
    default: 0
  },
  form_metadata: {
    type: Schema.Types.Mixed,
    required: false,
    default: null
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'op_users',
    required: true
  }
}, {
  timestamps: true,
  minimize: false
})

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = Mongoose.model('op_uploads', UploadSchema)
