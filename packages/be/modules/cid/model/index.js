console.log('💿 [model] op_cids')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

// ////////////////////////////////////////////////////////////////////// Schema
// -----------------------------------------------------------------------------
const CIDSchema = new Schema({
	cid: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	}
}, {
  timestamps: true
})
