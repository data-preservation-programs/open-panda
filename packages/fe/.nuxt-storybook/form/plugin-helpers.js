/*
 *
 * 🔌 [Plugin | Form] Helpers
 *
 */

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// checkRequired
const checkRequired = (fieldType, value) => {
  return new Promise((next) => {
    const type = typeof value
    let state = 'valid'
    if (type === 'string' || type === 'boolean') {
      if (value === '' || !value) { state = 'error' }
    } else if (Array.isArray(value)) {
      if (value.length === 0) { state = 'error' }
    } else if (type === 'object' && !Array.isArray(value)) {
      if (Object.keys(value).length === 0) { state = 'error' }
    } else if (type === 'number') {
      if (fieldType === 'select' && value === -1) { state = 'error' }
    }
    next({ state, validation: 'required' })
  })
}

// //////////////////////////////////////////////////////////////// checkPattern
const checkPattern = (value, pattern) => {
  return new Promise((next) => {
    const regex = new RegExp(pattern)
    let state = 'valid'
    if (value !== '' && !regex.test(value)) { state = 'error' }
    next({ state, validation: 'pattern' })
  })
}

// ////////////////////////////////////////////////////////////////// checkChars
const checkChars = (fieldType, value, chars) => {
  return new Promise((next) => {
    const min = chars.min
    const max = chars.max
    const len = fieldType === 'wysiwyg' ? value.replace(/(<([^>]+)>)/gi, '').length : (value || '').length
    let state = 'valid'
    if (typeof value === 'string' && value.trim() !== '' && (len < min || len > max)) {
      state = 'error'
    }
    next({ state, validation: 'chars' })
  })
}

// ////////////////////////////////////////////////////////////// validateFields
const validateFields = async (fields) => {
  try {
    const len = fields.length
    const compiled = []
    let state = 'valid'
    for (let i = 0; i < len; i++) {
      const field = fields[i]
      const type = field.type
      const value = field.value
      const required = field.required
      const pattern = field.pattern
      const chars = field.chars
      let check = { state: 'valid', validation: false }
      if (type !== 'array') {
        if (required && type !== 'array') { check = await checkRequired(type, value) }
        if (check.state === 'valid' && chars) { check = await checkChars(type, value, chars) }
        if (check.state === 'valid' && pattern) { check = await checkPattern(value, pattern) }
        if (check.state !== 'valid') {
          state = 'error'
          field.state = check.state
          field.validation = check.validation
        }
      }
      field.value = typeof field.value === 'string' ? field.value.trim() : field.value
      compiled.push(field)
    }
    return { state, fields: compiled }
  } catch (e) {
    return false
  }
}

// //////////////////////////////////////////////////////////////// compileArray
const compileArray = (arrayField, fields) => {
  return new Promise((next) => {
    const template = arrayField.template
    const valueScaffold = arrayField.value
    let match
    if (typeof template === 'object') { // if array of objects
      match = valueScaffold.map((group) => {
        const groupId = group.group_id
        const groupFields = group.fields
        return Object.values(groupFields).reduce((acc, fieldScaffold) => {
          const field = fields.find((obj) => {
            return obj.parent_model_key === arrayField.model_key &&
                   obj.group_id === groupId &&
                   obj.model_key === fieldScaffold.model_key
          })
          acc[fieldScaffold.model_key] = field.value
          return acc
        }, {})
      })
    }
    next(match)
  })
}

// ////////////////////////////////////////////////////////// writeFieldsToModel
const writeFieldsToModel = async (model, fields) => {
  try {
    const len = fields.length
    for (let i = 0; i < len; i++) {
      const field = fields[i]
      const modelKey = field.model_key
      field.state = 'valid'
      field.validation = false
      field.originalValue = field.value
      if (!field.hasOwnProperty('parent_model_key')) {
        if (field.type === 'array') {
          model[modelKey] = await compileArray(field, fields)
        } else {
          model[modelKey] = field.value
        }
      }
    }
    return model
  } catch (e) {
    console.log('============================== [Function: writeFieldsToModel]')
    throw e
  }
}

// ////////////////////////////////////////////////////////////////// stripModel
const stripModel = (model, fields) => {
  return new Promise((next) => {
    const len = fields.length
    const compiled = {
      ...model._id && { _id: model._id }
    }
    for (let i = 0; i < len; i++) {
      const field = fields[i]
      if (!field.hasOwnProperty('parent_model_key')) {
        const modelKey = field.model_key
        compiled[modelKey] = model[modelKey]
      }
    }
    next(compiled)
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ app, store }, inject) => {
  inject('validateFormFields', fields => validateFields(fields))
  inject('writeFieldsToFormModel', (model, fields) => writeFieldsToModel(model, fields))
  inject('stripFormModel', (model, fields) => stripModel(model, fields))
}
