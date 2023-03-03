// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  searchers: [],
  filters: []
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  searchers: state => state.searchers,
  filters: state => state.filters
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // /////////////////////////////////////////////////////////////// setSearcher
  setSearcher ({ commit, getters }, payload) {
    const index = getters.searchers.findIndex(searcher => searcher.searchKey === payload.searchKey)
    commit('SET_SEARCHER', { index, searcher: payload })
  },
  // //////////////////////////////////////////////////////////// removeSearcher
  removeSearcher ({ commit, getters }, searchKey) {
    const index = getters.searchers.findIndex(searcher => searcher.searchKey === searchKey)
    commit('REMOVE_SEARCHER', index)
  },
  // //////////////////////////////////////////////////////////// clearSearchers
  clearSearchers ({ commit }) {
    commit('CLEAR_SEARCHERS')
  },
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
  SET_SEARCHER (state, payload) {
    const index = payload.index
    const searcher = payload.searcher
    index === -1 ? state.searchers.push(searcher) : state.searchers.splice(index, 1, searcher)
  },
  REMOVE_SEARCHER (state, index) {
    state.searchers.splice(index, 1)
  },
  CLEAR_SEARCHERS (state) {
    state.searchers = []
  },
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
