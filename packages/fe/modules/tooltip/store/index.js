import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  baseAlert: {
    isOpen: false, // boolean
    action: false, // string: 'store' or 'emit'
    storeAction: false, // string: required if (action === 'store')
    data: false // object
  },
  tooltips: []
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  baseAlert: state => state.baseAlert,
  tooltips: state => state.tooltips
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // ///////////////////////////////////////////////////////////// registerAlert
  registerTooltip ({ commit, getters }, incoming) {
    const tooltip = Object.assign(CloneDeep(getters.baseAlert), CloneDeep(incoming))
    const index = getters.alerts.findIndex(obj => obj.id.includes(alert.id))
    commit('REGISTER_TOOLTIP', { tooltip, index })
  },
  // /////////////////////////////////////////////////////////// deregisterAlert
  deregisterTooltip ({ commit, getters, dispatch }, alertId) {
    const index = getters.tooltips.findIndex(obj => obj.id.includes(alertId))
    commit('DEREGISTER_TOOLTIP', index)
  },
  // /////////////////////////////////////////////////////////////// updateAlert
  updateTooltip ({ commit, getters }, incoming) {
    const alertId = incoming.alertId
    const alert = CloneDeep(getters.tooltips.find(obj => obj.id.includes(alertId)))
    Object.assign(alert, incoming)
    commit('UPDATE_TOOLTIP', {
      alert,
      index: getters.tooltips.findIndex(obj => obj.id.includes(alertId))
    })
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  REGISTER_TOOLTIP (state, payload) {
    const index = payload.index
    const alert = payload.alert
    if (index === -1) {
      state.tooltips.push(alert)
    } else {
      state.alerts.splice(index, 1, alert)
    }
  },
  DEREGISTER_TOOLTIP (state, index) {
    state.alerts.splice(index, 1)
  },
  UPDATE_TOOLTIP (state, payload) {
    state.alerts.splice(payload.index, 1, payload.tooltip)
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
