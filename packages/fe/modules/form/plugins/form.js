/*
 *
 * 🔌 [plugin | form] form
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ================================================================ compileArray
const compileArray = (arrayField, fields) => {
  return new Promise((resolve) => {
    const groups = fields.reduce((acc, field) => {
      const groupIndex = field.groupIndex
      if (field.scaffold.parentModelKey === arrayField.scaffold.modelKey) {
        !acc.hasOwnProperty(groupIndex) ? acc[groupIndex] = [field] : acc[groupIndex].push(field)
      }
      return acc
    }, {})
    const lenI = groups.length
    if (lenI === 0) { return arrayField.value }
    const final = []
    Object.keys(groups).forEach((key) => {
      const group = groups[key]
      const compiled = {}
      arrayField.scaffold.template.forEach((template, index) => {
        const field = group[index]
        compiled[field.scaffold.modelKey] = field.value
      })
      final.push(compiled)
    })
    resolve(final)
  })
}

// ================================================================ extractModel
const extractModel = async (scaffold, fields) => {
  console.log(scaffold)
  try {
    const len = fields.length
    for (let i = 0; i < len; i++) {
      const field = fields[i]
      const fieldScaffold = field.scaffold
      const options = fieldScaffold.options
      const modelKey = fieldScaffold.modelKey
      const mirror = fieldScaffold.mirror
      const type = fieldScaffold.type
      let value = field.value
      console.log(modelKey, type, value)
      if (!field.hasOwnProperty('parentModelKey') && field.validate && ((mirror && mirror.primary) || !mirror)) {
        if (type === 'array') {
          value = await compileArray(field, fields)
        } else if (type === 'select' || type === 'radio' || type === 'checkbox') {
          if (typeof value !== 'string' && fieldScaffold.output === 'option') {
            const option = options[value]
            if (option) {
              value = option.label
            } else {
              value = fieldScaffold.baseValue
              if (!value) { throw new Error(`baseValue key missing from ${field.fieldKey} field scaffold`) }
            }
          } else if (type === 'radio' || type === 'checkbox') {
            const isSingleOption = options.length === 1
            if (isSingleOption) {
              value = value === -1 ? false : true
            }
          }
        }
        scaffold[modelKey] = value
      }
    }
    return scaffold
  } catch (e) {
    console.log('==================================== [Function: extractModel]')
    throw e
  }
}

// ================================================================= resetFields
const resetFields = (app, fields) => {
  const len = fields.length
  for (let i = 0; i < len; i++) {
    const field = fields[i]
    app.$field(field.id).update({
      state: 'valid',
      originalValue: field.value,
      validation: false
    })
  }
}

// //////////////////////////////////////////////////////////////////////// Form
// -----------------------------------------------------------------------------
const Form = (app, store, id) => {
  const form = store.getters['form/forms'].find(form => form.id === id)
  const fields = store.getters['form/fields'].filter(field => field.formId === id)
  return {

    // ================================================================ register
    async register (data) {
      if (!form) {
        await store.dispatch('form/setForm', {
          id,
          state: data.new ? 'new' : 'valid',
          scaffold: data
        })
      }
    },

    // ============================================================== deregister
    deregister () {
      if (form) {
        store.dispatch('form/removeForm', id)
      }
    },

    // ===================================================================== get
    get () {
      return form
    },

    // ================================================================== update
    update (values) {
      store.dispatch('form/setForm', Object.assign(CloneDeep(form), values))
    },

    // ============================================================= updateState
    updateState (forcedState) {
      if (forcedState) {
        return this.update({ state: forcedState })
      }
      const len = fields.length
      let state = 'valid'
      for (let i = 0; i < len; i++) {
        const fieldState = fields[i].state
        if (fieldState !== 'valid') {
          state = fieldState
        }
      }
      this.update({ state })
    },

    // ================================================================ validate
    async validate () {
      const fields = store.getters['form/fields'].filter(field => field.formId === id)
      const len = fields.length
      if (len === 0) { return false }
      let state = 'valid'
      const compiled = []
      for (let i = 0; i < len; i++) {
        const { field, check } = await app.$field(fields[i].id).validate()
        compiled.push(field)
        const checkState = check.state
        if (checkState !== 'valid') {
          state = checkState
        }
      }
      store.dispatch('form/setForm', Object.assign(CloneDeep(form), { state }))
      if (state === 'error') { return false }
      resetFields(app, fields)
      return await extractModel(CloneDeep(form.scaffold), compiled)
    }

  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ app, store }, inject) {
  inject('form', (id) => Form(app, store, id))
}
