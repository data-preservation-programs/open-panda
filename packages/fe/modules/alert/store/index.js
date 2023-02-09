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
  alerts: []
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  baseAlert: state => state.baseAlert,
  alerts: state => state.alerts
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // ///////////////////////////////////////////////////////////// registerAlert
  registerAlert ({ commit, getters }, incoming) {
    const alert = Object.assign(CloneDeep(getters.baseAlert), CloneDeep(incoming))
    const index = getters.alerts.findIndex(obj => obj.id.includes(alert.id))
    commit('REGISTER_ALERT', { alert, index })
  },
  // /////////////////////////////////////////////////////////// deregisterAlert
  deregisterAlert ({ commit, getters, dispatch }, alertId) {
    const index = getters.alerts.findIndex(obj => obj.id.includes(alertId))
    commit('DEREGISTER_ALERT', index)
  },
  // /////////////////////////////////////////////////////////////// updateAlert
  updateAlert ({ commit, getters }, incoming) {
    const alertId = incoming.alertId
    const alert = CloneDeep(getters.alerts.find(obj => obj.id.includes(alertId)))
    Object.assign(alert, incoming)
    commit('UPDATE_ALERT', {
      alert,
      index: getters.alerts.findIndex(obj => obj.id.includes(alertId))
    })
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  REGISTER_ALERT (state, payload) {
    const index = payload.index
    const alert = payload.alert
    if (index === -1) {
      state.alerts.push(alert)
    } else {
      state.alerts.splice(index, 1, alert)
    }
  },
  DEREGISTER_ALERT (state, index) {
    state.alerts.splice(index, 1)
  },
  UPDATE_ALERT (state, payload) {
    state.alerts.splice(payload.index, 1, payload.alert)
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
