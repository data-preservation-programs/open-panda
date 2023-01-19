// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

const API_BASEURL = 'https://slingshot.filecoin.io/api'

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
    limit: 20
  },
  loading: false,
  basicStats: false,
  filters: false
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  datasetList: state => state.datasetList,
  metadata: state => state.metadata,
  loading: state => state.loading,
  basicStats: state => state.basicStats,
  filters: state => state.filters
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// resetStore
  resetStore ({ commit, getters, dispatch }) {
    dispatch('setLimit', { limit: 20 })
    dispatch('setPage', { page: 1 })
    commit('SET_DATASET_LIST', { datasetList: false, totalPages: 1 })
    commit('SET_FILTERS', false)
  },
  // //////////////////////////////////////////////////////////// getDatasetList
  async getDatasetList ({ commit, getters, dispatch }, metadata) {
    try {
      const route = metadata.route
      const page = getters.metadata.page
      const limit = getters.metadata.limit
      const query = route.query
      const search = query.search
      const filters = {}
      dispatch('setLoadingStatus', { status: true })
      Object.keys(getters.filters).forEach((filter) => {
        if (query.hasOwnProperty(filter)) {
          filters[filter] = query[filter]
        }
      })
      const response = await this.$axios.get(API_BASEURL + '/modify/get-dataset-list', {
        params: {
          page,
          ...(search && { search }),
          ...(limit && { limit }),
          ...(filters && { filter: filters })
        }
      })
      const payload = response.data.payload
      const datasetList = payload.results
      datasetList.forEach((dataset) => {
        this.dispatch('form/registerFormModel', Object.assign(CloneDeep(dataset), {
          formId: `modify|${dataset._id}`,
          state: dataset.new ? 'new' : 'valid'
        }))
      })
      dispatch('setDatasetList', {
        datasetList,
        metadata: payload.metadata
      })
      return payload.results
    } catch (e) {
      console.log('===================== [Store Action: modify/getDatasetList]')
      console.log(e)
      dispatch('setLoadingStatus', { status: false })
      return false
    }
  },
  // //////////////////////////////////////////////////////////////// getFilters
  async getFilters ({ commit, getters, dispatch }) {
    try {
      const response = await this.$axios.get(API_BASEURL + '/modify/get-filters')
      commit('SET_FILTERS', response.data.payload)
    } catch (e) {
      console.log('========================= [Store Action: modify/getFilters]')
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
  // ///////////////////////////////////////////////////////////// updateDataset
  updateDataset ({ commit, getters }, payload) {
    try {
      const id = payload.id
      const dataset = payload.dataset
      const datasetList = CloneDeep(getters.datasetList.editor)
      const index = datasetList.findIndex(obj => (id === obj.id) || (id === obj._id))
      commit('UPDATE_DATASET', { index, dataset })
    } catch (e) {
      console.log('====================== [Store Action: modify/updateDataset]')
      console.log(e)
    }
  },
  // ///////////////////////////////////////////////////////////// getBasicStats
  async getBasicStats ({ commit, getters, dispatch }) {
    try {
      const response = await this.$axios.get(API_BASEURL + '/modify/get-basic-stats')
      commit('SET_BASIC_STATS', response.data.payload)
    } catch (e) {
      console.log('====================== [Store Action: modify/getBasicStats]')
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
  UPDATE_DATASET (state, payload) {
    state.datasetList.editor.splice(payload.index, 1, payload.dataset)
  },
  ADD_DATASET (state, payload) {
    state.datasetList.editor.splice(payload.index, 0, payload.dataset)
  },
  SET_PAGE (state, payload) {
    state.metadata.page = payload.page
  },
  SET_LIMIT (state, payload) {
    state.metadata.limit = payload.limit
  },
  SET_LOADING_STATUS (state, payload) {
    state.loading = payload.status
  },
  SET_BASIC_STATS (state, stats) {
    state.basicStats = stats
  },
  SET_FILTERS (state, filters) {
    state.filters = filters
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
