import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  fields: [],
  models: []
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  fields: state => state.fields,
  models: state => state.models
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // ///////////////////////////////////////////////////////////////// resetForm
  // ///////////////////////////////////////////////////////// registerFormModel
  registerFormModel ({ commit, getters }, model) {
    const index = getters.models.findIndex(obj => obj.formId === model.formId)
    commit('REGISTER_FORM_MODEL', { model, index })
  },
  // /////////////////////////////////////////////////////// deregisterFormModel
  deregisterFormModel ({ commit, getters, dispatch }, formId) {
    const index = getters.models.findIndex(obj => obj.formId === formId)
    const fields = getters.fields.filter(obj => obj.formId === formId)
    if (index !== -1) {
      commit('DEREGISTER_FORM_MODEL', index)
      if (fields.length > 0) {
        fields.forEach((field) => {
          dispatch('deregisterFormField', field.id)
        })
      }
    }
  },
  // //////////////////////////////////////////////////////////// resetFormModel
  resetFormModel ({ commit, getters, dispatch }, payload) {
    const formId = payload.formId
    const incoming = payload.model
    const fields = CloneDeep(getters.fields.filter(obj => obj.formId === formId))
    fields.forEach((field) => {
      dispatch('updateFormField', Object.assign(field, {
        value: incoming[field.model_key],
        originalValue: incoming[field.model_key],
        state: 'valid',
        validation: false
      }))
    })
    dispatch('registerFormModel', incoming)
  },
  // /////////////////////////////////////////////////////////// updateFormModel
  updateFormModel ({ commit, getters }, incoming) {
    commit('UPDATE_FORM_MODEL', {
      model: incoming,
      index: getters.models.findIndex(obj => obj.formId === incoming.formId)
    })
  },
  // ///////////////////////////////////////////////////////// registerFormField
  registerFormField ({ commit, getters }, field) {
    const index = getters.fields.findIndex(obj => obj.id === field.id)
    commit('REGISTER_FORM_FIELD', { field, index })
  },
  // /////////////////////////////////////////////////////// deregisterFormField
  deregisterFormField ({ commit, getters }, id) {
    const index = getters.fields.findIndex(obj => obj.id === id)
    if (index !== -1) {
      commit('DEREGISTER_FORM_FIELD', index)
    }
  },
  // /////////////////////////////////////////////////////////// updateFormField
  updateFormField ({ commit, getters, dispatch }, incoming) {
    const mirror = incoming.mirror
    const fields = [incoming]
    if (mirror) {
      const mirrored = getters.fields.filter((obj) => {
        return obj.formId === incoming.formId &&
               obj.model_key === incoming.model_key &&
               obj.mirror === incoming.mirror &&
               obj.id !== incoming.id
      })
      if (mirrored.length > 0) {
        mirrored.forEach((field) => {
          fields.push(Object.assign(CloneDeep(field), {
            value: incoming.value,
            state: incoming.state,
            validation: incoming.validation
          }))
        })
      }
    }
    const model = CloneDeep(getters.models.find(obj => obj.formId === incoming.formId))
    model.state = incoming.state
    dispatch('updateFormModel', model)
    fields.forEach((field) => {
      commit('UPDATE_FORM_FIELD', {
        field,
        index: getters.fields.findIndex(obj => obj.id === field.id)
      })
    })
  },
  // ////////////////////////////////////////////////////////////// validateForm
  async validateForm ({ commit, getters, dispatch }, formId) {
    try {
      let model = getters.models.find(obj => obj.formId === formId)
      let fields = getters.fields.filter(obj => obj.formId === formId)
      if ((!model && fields.length === 0) || !model || fields.length === 0) { return false }
      model = CloneDeep(model)
      fields = CloneDeep(fields)
      const validation = await this.$validateFormFields(fields)
      if (!validation) { return false }
      const state = validation.state
      model.state = state
      if (state === 'valid') {
        await this.$writeFieldsToFormModel(model, fields)
      }
      dispatch('updateFormModel', model)
      validation.fields.forEach((field) => {
        dispatch('updateFormField', field)
      })
      model = await this.$stripFormModel(model, fields)
      return state === 'error' ? false : model
    } catch (e) {
      console.log('========================= [Store Action: form/validateForm]')
      throw e
    }
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  REGISTER_FORM_MODEL (state, payload) {
    const index = payload.index
    const model = payload.model
    if (index === -1) {
      state.models.push(model)
    } else {
      state.models.splice(index, 1, model)
    }
  },
  DEREGISTER_FORM_MODEL (state, index) {
    state.models.splice(index, 1)
  },
  UPDATE_FORM_MODEL (state, payload) {
    state.models.splice(payload.index, 1, payload.model)
  },
  REGISTER_FORM_FIELD (state, payload) {
    const index = payload.index
    const field = payload.field
    if (index === -1) {
      state.fields.push(field)
    } else {
      state.fields.splice(index, 1, field)
    }
  },
  DEREGISTER_FORM_FIELD (state, index) {
    state.fields.splice(index, 1)
  },
  UPDATE_FORM_FIELD (state, payload) {
    state.fields.splice(payload.index, 1, payload.field)
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  state,
  getters,
  actions,
  mutations
}
