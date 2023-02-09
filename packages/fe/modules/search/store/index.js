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
  // ///////////////////////////////////////////////////////////////// setFilter
  setFilter ({ commit, getters }, payload) {
    const index = getters.filters.findIndex(filter => filter.filterKey === payload.filterKey)
    commit('SET_FILTER', { index, filter: payload })
  },
  // /////////////////////////////////////////////////////////////////// removeFilter
  removeFilter ({ commit, getters }, filterKey) {
    const index = getters.filters.findIndex(filter => filter.filterKey === filterKey)
    commit('REMOVE_FILTER', index)
  },
  // ////////////////////////////////////////////////////////////// clearFilters
  clearFilters ({ commit }) {
    commit('CLEAR_FILTERS')
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_FILTER (state, payload) {
    const index = payload.index
    const filter = payload.filter
    index === -1 ? state.filters.push(filter) : state.filters.splice(index, 1, filter)
  },
  REMOVE_FILTER (state, index) {
    state.filters.splice(index, 1)
  },
  CLEAR_FILTERS (state) {
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
