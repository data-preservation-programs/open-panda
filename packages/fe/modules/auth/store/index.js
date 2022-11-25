// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Cookie from 'cookie'

import Config from '@/nuxt.config'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = {}

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // ////////////////////////////////////////////////////////////// authenticate
  async authenticate ({ commit }, cookie) {
    return await this.$axiosAuth.get('/authenticate')
  },
  // //////////////////////////////////////////////////////////////// tradeToken
  async tradeToken ({ commit }, token) {
    try {
      return await this.$axiosAuth.get('/github-trade-token', {
        params: { token }
      })
    } catch (e) {
      console.log('=========================== [Store Action: auth/tradeToken]')
      throw e
    }
  },
  // //////////////////////////////////////////////////////////////////// logout
  async logout ({ commit }, token) {
    try {
      const response = await this.$axiosAuth.get('/logout')
      const data = response.data
      this.$toaster.add({
        type: 'toast',
        code: data.code,
        category: 'success',
        message: data.message
      })
      const from = this.$router.history.current.path
      const to = Config.auth.redirectAfterLogout
      document.cookie = Cookie.serialize('identifier', 'expired', { path: '/', maxAge: 0, expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT') })
      if (from !== to) {
        return this.$router.replace({ path: to })
      } else {
        return response
      }
    } catch (e) {
      console.log('=============================== [Store Action: auth/logout]')
      const data = e.response.data
      this.$toaster.add({
        type: 'toast',
        code: data.code,
        category: 'caution',
        message: data.message
      })
    }
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  state,
  getters,
  actions,
  mutations
}
