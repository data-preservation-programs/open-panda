// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  fields: [],
  forms: [],
  savedFormExists: false
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  fields: state => state.fields,
  forms: state => state.forms,
  savedFormExists: state => state.savedFormExists
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // /////////////////////////////////////////////////////////////////// setForm
  setForm ({ commit, getters }, payload) {
    const index = getters.forms.findIndex(form => form.id === payload.id)
    commit('SET_FORM', { index, form: payload })
  },
  // ////////////////////////////////////////////////////////////////// setField
  async setField ({ commit, getters }, payload) {
    const index = getters.fields.findIndex(field => field.id === payload.id)
    await commit('SET_FIELD', { index, field: payload })
  },
  // /////////////////////////////////////////////////////////////// removeField
  removeField ({ commit, getters }, id) {
    const fields = CloneDeep(getters.fields)
    delete fields[id]
    commit('REMOVE_FIELD', fields)
  },
  // ////////////////////////////////////////////////// setSavedFormExistsStatus
  setSavedFormExistsStatus ({ commit }, status) {
    commit('SET_SAVED_FORM_EXISTS_STATUS', status)
  },
  // ////////////////////////////////////////////////////////// restoreSavedForm
  restoreSavedForm ({ commit, getters, dispatch }, formId) {
    const id = `form__${formId}`
    const fields = JSON.parse(this.$ls.get(id))
    fields.forEach((field) => {
      commit('SET_FIELD', {
        index: getters.fields.findIndex(obj => obj.id === field.id),
        field
      })
    })
    this.$ls.remove(id)
    dispatch('setSavedFormExistsStatus', false)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_FORM (state, payload) {
    const index = payload.index
    const form = payload.form
    index === -1 ? state.forms.push(form) : state.forms.splice(index, 1, form)
  },
  SET_FIELD (state, payload) {
    const index = payload.index
    const field = payload.field
    index === -1 ? state.fields.push(field) : state.fields.splice(index, 1, field)
  },
  REMOVE_FIELD (state, fields) {
    state.fields = fields
  },
  SET_SAVED_FORM_EXISTS_STATUS (state, status) {
    state.savedFormExists = status
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
