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
// const compileArray = (arrayField, fields) => {
//   return new Promise((resolve) => {
//     const template = arrayField.template
//     const valueScaffold = arrayField.value
//     let match
//     if (typeof template === 'object') { // if array of objects
//       match = valueScaffold.map((group) => {
//         const groupId = group.group_id
//         const groupFields = group.fields
//         return Object.values(groupFields).reduce((acc, fieldScaffold) => {
//           const field = fields.find((obj) => {
//             return obj.parent_model_key === arrayField.model_key &&
//                    obj.group_id === groupId &&
//                    obj.model_key === fieldScaffold.model_key
//           })
//           acc[fieldScaffold.model_key] = field.value
//           return acc
//         }, {})
//       })
//     }
//     resolve(match)
//   })
// }

// ================================================================ extractModel
const extractModel = (scaffold, fields) => {
  try {
    const len = fields.length
    for (let i = 0; i < len; i++) {
      const field = fields[i]
      const fieldScaffold = field.scaffold
      const modelKey = fieldScaffold.modelKey
      const mirror = fieldScaffold.mirror
      const type = fieldScaffold.type
      let value = field.value
      if (!field.hasOwnProperty('parentModelKey') && field.validate && ((mirror && mirror.primary) || !mirror)) {
        if (type === 'array') {
          // scaffold[modelKey] = await compileArray(field, fields)
        } else if ((type === 'select' || type === 'radio' || type === 'checkbox') && fieldScaffold.output === 'option') {
          if (typeof value !== 'string') {
            const option = fieldScaffold.options[value]
            if (option) {
              value = option.label
            } else {
              value = fieldScaffold.baseValue
              if (!value) { throw new Error(`baseValue key missing from ${field.fieldKey} field scaffold`) }
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
  return {

    // ================================================================ register
    async register (data) {
      if (!form) {
        await store.dispatch('form/setForm', {
          id,
          state: 'valid',
          scaffold: data
        })
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
