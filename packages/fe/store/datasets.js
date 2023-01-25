// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  datasetList: false,
  metadata: {
    page: 1,
    totalPages: 1,
    count: false,
    limit: 12
  },
  loading: false,
  basicStats: false,
  filters: false,
  sort: false,
  limit: false,
  layout: 'grid'
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  datasetList: state => state.datasetList,
  metadata: state => state.metadata,
  loading: state => state.loading,
  basicStats: state => state.basicStats,
  filters: state => state.filters,
  sort: state => state.sort,
  limit: state => state.limit,
  layout: state => state.layout
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// resetStore
  resetStore ({ commit, getters, dispatch }, formId) {
    dispatch('setPage', { page: 1 })
    commit('SET_DATASET_LIST', { datasetList: false, totalPages: 1 })
    commit('SET_FILTERS', false)
    commit('SET_SORT', false)
    commit('SET_LIMIT', false)
    commit('SET_LAYOUT', 'grid')
  },
  // //////////////////////////////////////////////////////////// getDatasetList
  async getDatasetList ({ commit, getters, dispatch }, metadata) {
    try {
      const route = metadata.route
      const page = getters.metadata.page
      const query = route.query
      const search = query.search
      const limit = getters.limit[query.limit || 0].value
      const sort = getters.sort[query.sort || 0].value
      const filters = {}
      dispatch('setLoadingStatus', { status: true })
      Object.keys(getters.filters).forEach((filter) => {
        if (query.hasOwnProperty(filter)) {
          filters[filter] = query[filter]
        }
      })
      const response = await this.$axiosAuth.get('/get-dataset-list', {
        params: {
          page,
          ...(search && { search }),
          ...(limit && { limit }),
          ...(filters && { filter: filters }),
          ...(sort && { sort })
        }
      })
      const payload = response.data.payload
      const datasetList = payload.results
      dispatch('setDatasetList', {
        datasetList,
        metadata: payload.metadata
      })
      return payload.results
    } catch (e) {
      console.log('=================== [Store Action: datasets/getDatasetList]')
      console.log(e)
      dispatch('setLoadingStatus', { status: false })
      return false
    }
  },
  // /////////////////////////////////////////////////////////////////// getSort
  async getSort ({ commit, getters, dispatch }) {
    try {
      const response = await this.$axiosAuth.get('/get-static-file', {
        params: { path: 'filters.json' }
      })
      commit('SET_SORT', response.data.payload.sort)
    } catch (e) {
      console.log('========================== [Store Action: datasets/getSort]')
      console.log(e)
      return false
    }
  },
  // ////////////////////////////////////////////////////////////////// getLimit
  async getLimit ({ commit, getters, dispatch }) {
    try {
      const response = await this.$axiosAuth.get('/get-static-file', {
        params: { path: 'filters.json' }
      })
      commit('SET_LIMIT', response.data.payload.limit)
    } catch (e) {
      console.log('========================= [Store Action: datasets/getLimit]')
      console.log(e)
      return false
    }
  },
  // //////////////////////////////////////////////////////////////// getFilters
  async getFilters ({ commit, getters, dispatch }) {
    try {
      const response = await this.$axiosAuth.get('/get-static-file', {
        params: { path: 'filters.json' }
      })
      commit('SET_FILTERS', response.data.payload.filters)
    } catch (e) {
      console.log('======================= [Store Action: datasets/getFilters]')
      console.log(e)
      return false
    }
  },
  // //////////////////////////////////////////////////////////// setDatasetList
  setDatasetList ({ commit }, payload) {
    commit('SET_DATASET_LIST', payload)
  },
  // ////////////////////////////////////////////////////////////////// setLimit
  setLimit ({ commit }, payload) {
    commit('SET_LIMIT', payload)
  },
  // ///////////////////////////////////////////////////////////////// setLayout
  setLayout ({ commit }, payload) {
    commit('SET_LAYOUT', payload)
  },
  // /////////////////////////////////////////////////////////////////// setPage
  setPage ({ commit }, payload) {
    commit('SET_PAGE', payload)
  },
  // ///////////////////////////////////////////////////////////// incrementPage
  incrementPage ({ commit, dispatch }, payload) {
    dispatch('setPage', { page: payload.page })
    dispatch('getDatasetList', { route: payload.route })
  },
  // ////////////////////////////////////////////////////////// setLoadingStatus
  setLoadingStatus ({ commit }, payload) {
    commit('SET_LOADING_STATUS', payload)
  },
  // ///////////////////////////////////////////////////////////// getBasicStats
  async getBasicStats ({ commit, getters, dispatch }) {
    try {
      const response = await this.$axiosAuth.get('/get-basic-stats')
      commit('SET_BASIC_STATS', response.data.payload)
    } catch (e) {
      console.log('==================== [Store Action: datasets/getBasicStats]')
      console.log(e)
      return false
    }
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_DATASET_LIST (state, payload) {
    const metadata = payload.metadata
    state.datasetList = payload.datasetList
    if (metadata) {
      state.metadata.totalPages = metadata.totalPages
      state.metadata.count = metadata.count
    }
  },
  SET_PAGE (state, payload) {
    state.metadata.page = payload.page
  },
  SET_LIMIT (state, limit) {
    state.limit = limit
  },
  SET_LOADING_STATUS (state, payload) {
    state.loading = payload.status
  },
  SET_BASIC_STATS (state, stats) {
    state.basicStats = stats
  },
  SET_FILTERS (state, filters) {
    state.filters = filters
  },
  SET_SORT (state, sort) {
    state.sort = sort
  },
  SET_LAYOUT (state, layout) {
    state.layout = layout
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
