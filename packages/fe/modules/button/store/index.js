// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  loaders: []
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  loaders: state => state.loaders
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // ///////////////////////////////////////////////////////////////// addLoader
  addLoader ({ commit, getters }, action) {
    const found = getters.loaders.find(obj => obj === action)
    if (!found) {
      commit('ADD_LOADER', action)
    }
  },
  // ////////////////////////////////////////////////////////////// removeLoader
  removeLoader ({ commit, getters }, action) {
    const loaders = getters.loaders.slice()
    const index = loaders.findIndex(obj => obj === action)
    if (index !== -1) {
      commit('REMOVE_LOADER', index)
    }
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  ADD_LOADER (state, action) {
    state.loaders.push(action)
  },
  REMOVE_LOADER (state, index) {
    state.loaders.splice(index, 1)
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
