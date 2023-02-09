// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import { uuid } from 'vue-uuid'

import Config from '@/nuxt.config'

// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  messages: []
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  messages: state => state.messages
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// addMessage
  async addMessage ({ commit, getters }, payload) {
    const messages = getters.messages
    const len = messages.length
    const display = payload.timeout || Config.toaster.display
    payload.id = uuid.v4()
    await commit('ADD_MESSAGE', payload)
    if (len >= display) {
      this.dispatch('general/removeMessage', messages[len - display].id)
    }
    return payload.id
  },
  // ///////////////////////////////////////////////////////////// removeMessage
  removeMessage ({ commit, getters }, id) {
    const messages = getters.messages.slice()
    const index = messages.findIndex(obj => obj && obj.id === id)
    if (index !== -1) {
      commit('REMOVE_MESSAGE', index)
    }
    return id
  },
  // ///////////////////////////////////////////////////////////// replaceMessage
  replaceMessage ({ commit, getters }, payload) {
    const id = payload.id
    const toast = payload.toast
    const index = getters.messages.findIndex(obj => obj && obj.id === id)
    if (index !== -1) {
      commit('REPLACE_MESSAGE', { index, toast })
    }
    return id
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  ADD_MESSAGE (state, message) {
    state.messages.push(message)
  },
  REMOVE_MESSAGE (state, index) {
    state.messages.splice(index, 1)
  },
  REPLACE_MESSAGE (state, payload) {
    state.messages.splice(payload.index, 1, payload.toast)
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
