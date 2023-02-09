import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  datasetList: false,
  datasetListTypeahead: false,
  metadata: {
    page: 1,
    limit: 12,
    totalPages: 1,
    count: false
  },
  loading: false,
  basicStats: false,
  filters: false,
  sortOptions: false,
  limitOptions: false,
  layout: 'grid'
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  datasetList: state => state.datasetList,
  datasetListTypeahead: state => state.datasetListTypeahead,
  metadata: state => state.metadata,
  loading: state => state.loading,
  basicStats: state => state.basicStats,
  filters: state => state.filters,
  sortOptions: state => state.sortOptions,
  limitOptions: state => state.limitOptions,
  layout: state => state.layout
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// resetStore
  resetStore ({ commit, getters, dispatch }, formId) {
    commit('SET_DATASET_LIST', {
      datasetList: false,
      page: 1,
      totalPages: 1,
      count: false
    })
    commit('SET_FILTERS', false)
    commit('SET_LAYOUT', 'grid')
  },
  // //////////////////////////////////////////////////////////// getDatasetList
  async getDatasetList ({ commit, getters, dispatch }, metadata) {
    try {
      const route = metadata.route
      const query = route.query
      const page = parseInt(query.page || getters.metadata.page)
      const search = query.search
      const limit = query.limit || getters.metadata.limit
      const sort = query.sort
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
      const datasetListOriginal = CloneDeep(payload.results)
      const datasetList = datasetListOriginal
      datasetList.forEach((item) => {
        let imgUrl = item.slug
        // exceptions
        if (item.slug.includes('common-crawl')) {
          imgUrl = 'common-crawl'
        }
        if (item.slug.includes('sloan-digital-sky-survey-release')) {
          imgUrl = 'sloan-digital-sky-survey-release'
        }
        item.data_size = this.$formatBytes(item.data_size)
        item.img_url = `/images/datasets/${imgUrl}.jpg`
      })
      dispatch('setDatasetList', {
        datasetList,
        metadata: payload.metadata
      })
      return datasetList
    } catch (e) {
      console.log('=================== [Store Action: datasets/getDatasetList]')
      console.log(e)
      dispatch('setLoadingStatus', { status: false })
      return false
    }
  },
  // //////////////////////////////////////////////////////////////// getFilters
  async getFiltersAndTypeahead ({ commit }) {
    try {
      const filters = await this.dispatch('general/getCachedFile', 'filters.json')
      const typeahead = await this.dispatch('general/getCachedFile', 'typeahead-dataset-search-data.json')
      commit('SET_SORT_OPTIONS', filters.sort)
      commit('SET_LIMIT_OPTIONS', filters.limit)
      commit('SET_FILTERS', filters.filters)
      commit('SET_DATASET_LIST_TYPEAHEAD', typeahead)
    } catch (e) {
      console.log('======================= [Store Action: datasets/getFilters]')
      console.log(e)
      return false
    }
  },
  // ///////////////////////////////////////////////////////////// getBasicStats
  async getBasicStats ({ commit, getters, dispatch }) {
    try {
      const response = await this.$axiosAuth.get('/get-cached-file', {
        params: { path: 'basic-stats.json' }
      })
      commit('SET_BASIC_STATS', response.data.payload)
    } catch (e) {
      console.log('==================== [Store Action: datasets/getBasicStats]')
      console.log(e)
      return false
    }
  },
  // //////////////////////////////////////////////////////////// setDatasetList
  setDatasetList ({ commit }, payload) {
    commit('SET_DATASET_LIST', payload)
  },
  // ///////////////////////////////////////////////////////////////// setLayout
  setLayout ({ commit }, payload) {
    commit('SET_LAYOUT', payload)
  },
  // ///////////////////////////////////////////////////////////// incrementPage
  incrementPage ({ commit, dispatch }, payload) {
    dispatch('getDatasetList', { route: payload.route })
  },
  // ////////////////////////////////////////////////////////// setLoadingStatus
  setLoadingStatus ({ commit }, payload) {
    commit('SET_LOADING_STATUS', payload)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_DATASET_LIST (state, payload) {
    state.datasetList = payload.datasetList
    const metadata = payload.metadata
    if (metadata) {
      state.metadata.totalPages = metadata.totalPages
      state.metadata.count = metadata.count
      state.metadata.page = metadata.page
    }
  },
  SET_DATASET_LIST_TYPEAHEAD (state, payload) {
    state.datasetListTypeahead = payload
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
  SET_SORT_OPTIONS (state, options) {
    state.sortOptions = options
  },
  SET_LIMIT_OPTIONS (state, options) {
    state.limitOptions = options
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
