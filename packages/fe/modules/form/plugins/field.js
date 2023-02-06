/*
 *
 * 🔌 [plugin | form] field
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'
import { uuid as Uuid } from 'vue-uuid'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ====================================================== getArrayFormFieldValue
const getArrayFormFieldValue = (form, scaffold, groupIndex) => {
  const entry = form.scaffold[scaffold.parentModelKey][groupIndex]
  if (!entry) { return getNullStateValue(scaffold.type) }
  return entry[scaffold.modelKey]
}

// =================================================== getCheckboxFormFieldValue
const getCheckboxFormFieldValue = (value, scaffold) => {
  const isSingleOption = scaffold.options.length === 1
  if (isSingleOption) {
    return value === true ? 0 : -1
  } else {
    if (process.env.SERVER_ENV === 'development') {
      console.log('TODO: Wire up multi-option checkboxes. Remember to keep values index-based for interoperability with the search/filters module.')
    }
    return value
  }
}

// =========================================================== getNullStateValue
const getNullStateValue = (type) => {
  let value
  switch (type) {
    case 'checkbox' : value = -1; break
    case 'radio' : value = -1; break
    case 'select' : value = -1; break
    case 'range' : value = scaffold.min; break
    case 'array' : value = []; break
    default : value = ''; break
  }
  return value
}

// ==================================================================== getValue
const getValue = (app, scaffold, form, resetTo, groupIndex) => {
  const dualValueFields = ['select', 'radio', 'checkbox']
  const type = scaffold.type
  let value = form ? form.scaffold[scaffold.modelKey] : undefined // First grab the value found in the form
  if (type === 'array') {
    value.map(entry => (Object.assign(entry, { groupId: Uuid.v4() })))
  } else if (type === 'checkbox') {
    value = getCheckboxFormFieldValue(value, scaffold)
  }
  if (!scaffold.hasOwnProperty('parentModelKey') && value !== undefined && value !== null && value !== '') { return value }
  // If this is just a reset to the nullState, then grab and return the null state
  if (resetTo && resetTo !== '' && resetTo === 'nullState') {
    return getNullStateValue(type)
  }
  // If the field is part of an array, grab the internal array form field value
  if (scaffold.hasOwnProperty('parentModelKey')) {
    value = getArrayFormFieldValue(form, scaffold, groupIndex)
  }
  // If a default value is set in the field scaffold, grab that instead (both for regular getValue calls as well as if it's a reset)
  if (scaffold.hasOwnProperty('defaultValue') && scaffold.defaultValue !== '') {
    const defaultValue = scaffold.defaultValue
    value = defaultValue
    if ((dualValueFields.includes(type)) && typeof defaultValue === 'string') {
      value = scaffold.options.findIndex(option => option.label === defaultValue)
    }
  // Otherwise set a null state default value, except for array field values
  } else if (!scaffold.hasOwnProperty('parentModelKey')) {
    value = getNullStateValue(type)
  }
  return value
}

// =============================================================== checkRequired
const checkRequired = (fieldType, value) => {
  return new Promise((resolve) => {
    const type = typeof value
    let state = 'valid'
    if (type === 'string' || type === 'boolean') {
      if (value === '' || !value) { state = 'error' }
    } else if (Array.isArray(value)) {
      if (value.length === 0) { state = 'error' }
    } else if (type === 'object' && !Array.isArray(value)) {
      if (Object.keys(value).length === 0) { state = 'error' }
    } else if (type === 'number') {
      if ((fieldType === 'select' || fieldType === 'checkbox' || fieldType === 'radio') && value === -1) {
        state = 'error'
      }
    }
    resolve({ state, validation: state === 'error' ? 'required' : false })
  })
}

// ================================================================== checkChars
const checkChars = (fieldType, value, chars) => {
  return new Promise((resolve) => {
    const min = chars.min
    const max = chars.max
    const len = fieldType === 'wysiwyg' ? value.replace(/(<([^>]+)>)/gi, '').length : (value || '').length
    let state = 'valid'
    if (typeof value === 'string' && value.trim() !== '' && (len < min || len > max)) {
      state = 'error'
    }
    resolve({ state, validation: state === 'error' ? 'chars' : false })
  })
}

// ================================================================ checkPattern
const checkPattern = (value, pattern) => {
  return new Promise((resolve) => {
    const regex = new RegExp(pattern)
    let state = 'valid'
    if (value !== '' && !regex.test(value)) { state = 'error' }
    resolve({ state, validation: state === 'error' ? 'pattern' : false })
  })
}

// ================================================================= checkMinMax
const checkMinMax = (fieldType, inputType, value, min, max) => {
  return new Promise((resolve) => {
    let state = 'valid'
    if (fieldType !== 'input' && inputType !== 'number') { resolve({ state, validation: false }) }
    if (value < min || value > max) {
      state = 'error'
    }
    resolve({ state, validation: state === 'error' ? 'minmax' : false })
  })
}

// //////////////////////////////////////////////////////// applyTransformations
const applyTransformations = async (app, store, transformSourceField) => {
  try {
    const compiled = []
    const fields = store.getters['form/fields']
    const transformed = fields.filter((field) => {
      const scaffold = field.scaffold
      return (scaffold.mirror || scaffold.react) &&
             field.formId === transformSourceField.formId &&
             field.formKey === transformSourceField.formKey &&
             field.id !== transformSourceField.id
    })
    const len = transformed.length
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        const field = CloneDeep(transformed[i])
        const scaffold = field.scaffold
        const mirror = scaffold.mirror
        const react = scaffold.react
        let value
        if (mirror && mirror.fieldKey === transformSourceField.fieldKey) {
          value = applyTransformation(app, field, transformSourceField, scaffold.mirror)
          await app.$field(field.id).update({
            value,
            state: JSON.stringify(value) !== JSON.stringify(field.originalValue) ? 'caution' : 'valid',
            validation: transformSourceField.validation
          })
        }
        if (react && react.fieldKey === transformSourceField.fieldKey) {
          value = applyTransformation(app, field, transformSourceField, scaffold.react)
          await app.$field(field.id).update({
            value,
            state: JSON.stringify(value) !== JSON.stringify(field.originalValue) ? 'caution' : 'valid',
            validation: transformSourceField.validation
          })
        }
      }
    }
  } catch (e) {
    console.log('============================ [Function: applyTransformations]')
    throw e
  }
}

// ///////////////////////////////////////////////////////// applyTransformation
const applyTransformation = (app, transformField, transformSourceField, transform) => {
  return transform ? app[transform.func](app, transformField, transformSourceField, transform.args) : transformSourceField.value
}

// //////////////////////////////////////////////// updateLocalStorageSavedField
const updateLocalStorageSavedField = (ctx, store, formId) => {
  if (process.client && formId) {
    const allFields = store.getters['form/fields']
    const savedFormExists = store.getters['form/savedFormExists']
    ctx.$ls.set(`form__${formId}`, JSON.stringify(allFields))
    if (savedFormExists) {
      store.dispatch('form/setSavedFormExistsStatus', false)
    }
  }
}

// /////////////////////////////////////////////////////////////////////// Field
// -----------------------------------------------------------------------------
const Field = (app, store, id) => {
  let field = store.getters['form/fields'].find(field => field.id === id)
  let formId, form, value, scaffold, type, inputType, required, pattern, chars, min, max, mirror, react, conditions
  if (field) {
    formId = field.formId
    value = field.value
    scaffold = field.scaffold
    type = scaffold.type
    inputType = scaffold.inputType
    required = scaffold.required
    pattern = scaffold.pattern
    chars = scaffold.chars
    min = scaffold.min
    max = scaffold.max
    mirror = scaffold.mirror
    react = scaffold.react
    conditions = scaffold.conditions
  }
  if (formId) {
    form = store.$form(formId).get()
  }
  return {

    // ================================================================ register
    async register (formId, groupIndex, fieldKey, scaffold) {
      if (!field) {
        const form = app.$form(formId).get()
        const value = getValue(app, scaffold, form, false, groupIndex)
        await store.dispatch('form/setField', {
          id,
          fieldKey,
          formId,
          ...(typeof groupIndex === 'number' && { groupIndex }),
          value,
          includeInFormSubmission: true, // used to keep "validate" disabled in field-standalone component
          originalValue: value,
          state: 'valid',
          validate: true,
          validation: false,
          scaffold
        })
      }
    },

    // ============================================================== deregister
    async deregister () {
      if (field) {
        await store.dispatch('form/removeField', id)
      }
    },

    // ===================================================================== get
    get () {
      return field
    },

    // ================================================================== update
    async update (values) {
      await store.dispatch('form/setField', Object.assign(CloneDeep(field), values))
    },

    // ================================================================== update
    async updateValue (value) {
      field = CloneDeep(field)
      let parsed = value
      if ((type === 'input' && inputType === 'number') || type === 'range') {
        parsed = value !== '' ? parseFloat(value) : null
      }
      field.value = parsed
      field.state = JSON.stringify(field.value) !== JSON.stringify(field.originalValue) ? 'caution' : 'valid'
      field.validation = false
      await store.dispatch('form/setField', field)
      await applyTransformations(app, store, field)
      if (formId) {
        app.$form(formId).updateState()
      }
      updateLocalStorageSavedField(app, store, field.formId)
    },

    // ================================================================ validate
    async validate () {
      field = CloneDeep(field)
      let state = 'valid'
      let check = { state: 'valid', validation: false }
      if (field.validate && type !== 'array') {
        if (required) { check = await checkRequired(type, value) }
        if (check.state === 'valid' && chars) { check = await checkChars(type, value, chars) }
        if (check.state === 'valid' && pattern) { check = await checkPattern(value, pattern) }
        if (check.state === 'valid' && (min || max)) { check = await checkMinMax(type, inputType, value, min, max) }
        if (check.state !== 'valid') {
          state = 'error'
          field.state = check.state
          field.validation = check.validation
        }
      }
      await store.dispatch('form/setField', field)
      if (formId) {
        app.$form(formId).updateState()
      }
      return { field, check }
    },

    // =================================================================== reset
    reset (resetTo) {
      const value = getValue(app, scaffold, form, resetTo)
      this.update({
        value,
        originalValue: value,
        state: 'valid',
        validate: true,
        validation: false
      })
    }

  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ app, store, route }, inject) {
  inject('field', (id) => Field(app, store, id))
}
