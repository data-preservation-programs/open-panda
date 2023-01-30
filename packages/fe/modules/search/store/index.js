/*
 * This store is only used to maintain a list of all registered filters and the
 * search term that is applied to the ?search=<VALUE> query param. These records
 * are primarily used to detect if the search and filter states have changed and
 * to present a "Clear All" type of button
 */

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = {
  filters: []
}

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  filters: state => state.filters
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // ////////////////////////////////////////////////////////////// recordFilter
  recordFilter ({ commit, getters }, filterKey) {
    if (!getters.filters.includes(filterKey)) {
      commit('RECORD_FILTER', filterKey)
    }
  },
  // ///////////////////////////////////////////////////////// clearFilterRecord
  clearFilterRecord ({ commit }) {
    commit('CLEAR_FILTER_RECORD')
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  RECORD_FILTER (state, filterKey) {
    state.filters.push(filterKey)
  },
  CLEAR_FILTER_RECORD (state) {
    state.filters = []
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
