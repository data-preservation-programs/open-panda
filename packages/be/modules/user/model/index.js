console.log('💿 [model] sl3_users')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

// ////////////////////////////////////////////////////////////////////// Schema
// -----------------------------------------------------------------------------
const UserSchema = new Schema({
  githubUsername: {
    type: String,
    required: true,
    unique: true
  },
  githubAvatarUrl: {
    type: String,
    required: false
  },
  githubHtmlUrl: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: allowEmptyStringsOnly,
    default: ''
  },
  registered: {
    type: Boolean,
    required: true,
    default: false
  },
  firstName: {
    type: String,
    required: allowEmptyStringIfNotRegistered,
    default: ''
  },
  lastName: {
    type: String,
    required: allowEmptyStringIfNotRegistered,
    default: ''
  },
  twitterHandle: {
    type: String,
    required: false,
    default: ''
  },
  slackHandle: {
    type: String,
    required: allowEmptyStringIfNotRegistered,
    default: ''
  },
  country: {
    type: String,
    required: allowEmptyStringIfNotRegistered,
    default: ''
  },
  checkboxReadTheRules: {
    type: Boolean,
    required: true,
    default: false
  },
  checkboxReadCodeOfConduct: {
    type: Boolean,
    required: true,
    default: false
  },
  additionalIdentifiers: {
    type: [{
      type: Schema.Types.Mixed,
      required: true
    }],
    required: false,
    default: []
  },
  isAdmin: {
    type: Boolean,
    required: false
  },
  contactSlackHandle: {
    type: String,
    required: false
  },
  contactEmail: {
    type: String,
    required: false
  },
  contactCheckboxAgreeToMakePublic: {
    type: Boolean,
    required: true,
    default: false
  },
  disabled: {
    type: Boolean,
    required: false
  }
}, {
  timestamps: true,
  minimize: false
})

// ////////////////////////////////////////////////////////////// Before Actions
// -----------------------------------------------------------------------------
UserSchema.pre('validate', function (next) {
  if (typeof this.email === 'object') { this.email = '' }
  next()
})

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
function allowEmptyStringsOnly () {
  return typeof this.email !== 'string'
}

function allowEmptyStringIfNotRegistered () {
  return this.registered
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = Mongoose.model('sl3_users', UserSchema)
