// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  cidList: false,
  metadata: {
    page: 1,
    limit: 12,
    totalPages: 1,
    count: false
  },
  loading: false
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  cidList: state => state.cidList,
  metadata: state => state.metadata,
  loading: state => state.loading
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// getCidList
  async getCidList ({ commit, getters, dispatch }, metadata) {
    try {
      dispatch('setCidLoadingStatus', { status: true })
      const route = metadata.route
      const query = CloneDeep(route.query)
      const slug = route.params.id
      const page = parseInt(query.page || getters.metadata.page)
      const limit = query.limit || getters.metadata.limit
      const search = query.search
      const response = await this.$axiosAuth('/get-cid-list', {
        params: {
          slug,
          page,
          ...(limit && { limit }),
          ...(search && { search })
        }
      })
      const payload = response.data.payload
      dispatch('setCidList', {
        results: payload.results,
        metadata: payload.metadata
      })
    } catch (e) {
      console.log('======================== [Store Action: dataset/getCidList]')
      console.log(e)
      dispatch('setCidLoadingStatus', { status: false })
      return false
    }
  },
  // //////////////////////////////////////////////////////////////// setCidList
  setCidList ({ commit }, payload) {
    commit('SET_CID_LIST', payload)
  },
  // /////////////////////////////////////////////////////// setCidLoadingStatus
  setCidLoadingStatus ({ commit }, payload) {
    commit('SET_CID_LOADING_STATUS', payload)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_CID_LIST (state, payload) {
    state.cidList = payload.results
    const metadata = payload.metadata
    if (metadata) {
      state.metadata.totalPages = metadata.totalPages
      state.metadata.count = metadata.count
      state.metadata.page = metadata.page
    }
  },
  SET_CID_LOADING_STATUS (state, payload) {
    state.loading = payload.status
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
