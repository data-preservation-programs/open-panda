import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  sliders: []
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  sliders: state => state.sliders
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////// registerSlider
  registerSlider ({ commit, getters }, slider) {
    const index = getters.sliders.findIndex(obj => obj.id.includes(slider.id))
    commit('REGISTER_SLIDER', { slider, index })
  },
  // ////////////////////////////////////////////////////////// deregisterSlider
  deregisterSlider ({ commit, getters, dispatch }, sliderId) {
    const index = getters.sliders.findIndex(obj => obj.id.includes(sliderId))
    commit('DEREGISTER_SLIDER', index)
  },
  // ////////////////////////////////////////////////////////////// updateSlider
  updateSlider ({ commit, getters }, incoming) {
    const sliderId = incoming.sliderId
    const slider = CloneDeep(getters.sliders.find(obj => obj.id.includes(sliderId)))
    Object.assign(slider, incoming)
    commit('UPDATE_SLIDER', {
      slider,
      index: getters.sliders.findIndex(obj => obj.id.includes(sliderId))
    })
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  REGISTER_SLIDER (state, payload) {
    const index = payload.index
    const slider = payload.slider
    if (index === -1) {
      state.sliders.push(slider)
    } else {
      state.sliders.splice(index, 1, slider)
    }
  },
  DEREGISTER_SLIDER (state, index) {
    state.sliders.splice(index, 1)
  },
  UPDATE_SLIDER (state, payload) {
    state.sliders.splice(payload.index, 1, payload.slider)
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
