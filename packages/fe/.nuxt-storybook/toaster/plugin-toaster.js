/*
 *
 * 🔌 [plugin | toaster] index
 *
 */

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import Store from '@/modules/toaster/store'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// registerStore
const registerStore = (app, next) => {
  return new Promise((next) => {
    app.store.registerModule('toaster', Object.assign({
      namespaced: true
    }, Store))
    next()
  })
  if (next) { return next() }
}

// ///////////////////////////////////////////////////////////////////// toaster
const toaster = (app) => {
  return {
    async add (toast) {
      return await app.store.dispatch('toaster/addMessage', toast)
    },
    async remove (id) {
      return await app.store.dispatch('toaster/removeMessage', id)
    },
    async replace (id, toast) {
      return await app.store.dispatch('toaster/replaceMessage', { id, toast })
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function ({ app }, inject) {
  await registerStore(app)
  inject('toaster', toaster(app))
}
