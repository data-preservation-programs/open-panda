/*
 * state.filters and state.searchValue are only used to maintain a list of all
 * registered filters and THE search term that is applied to the ?search=<VALUE>
 * query param. These records are primarily used to detect if the search and
 * filter states have changed and to present a "Clear All" type of button
 */

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = {
  searchValue: '',
  sortValue: 0,
  limitValue: 0,
  filters: []
}

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  searchValue: state => state.searchValue,
  sortValue: state => state.sortValue,
  limitValue: state => state.limitValue,
  filters: state => state.filters
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // ///////////////////////////////////////////////////////// recordSearchValue
  recordSearchValue ({ commit }, value) {
    commit('RECORD_SEARCH_VALUE', value)
  },
  // ///////////////////////////////////////////////////////// recordSearchValue
  recordSortValue ({ commit }, value) {
    commit('RECORD_SORT_VALUE', value)
  },
  // ///////////////////////////////////////////////////////// recordLimitValue
  recordLimitValue ({ commit }, value) {
    commit('RECORD_LIMIT_VALUE', value)
  },
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
  RECORD_SEARCH_VALUE (state, value) {
    state.searchValue = value
  },
  RECORD_SORT_VALUE (state, value) {
    state.sortValue = value
  },
  RECORD_LIMIT_VALUE (state, value) {
    state.limitValue = value
  },
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
