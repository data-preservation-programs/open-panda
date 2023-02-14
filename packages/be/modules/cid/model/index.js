console.log('💿 [model] op_cids')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

// ////////////////////////////////////////////////////////////////////// Schema
// -----------------------------------------------------------------------------
const CIDSchema = new Schema({
	piece_cid: {
		type: String,
		required: true
	},
	payload_cid: {
		type: String,
		required: true,
		index: true
	},
	raw_car_file_size: {
		type: Number,
		required: true
	},
	dataset_slug: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		required: true
	},
	updated: {
		type: Date,
		required: true
	},
	name: {
		type: String,
		required: true
	}
}, {
	timestamps: false
})

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = Mongoose.model('op_cids', CIDSchema)
