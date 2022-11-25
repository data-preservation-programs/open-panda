/*
 *
 * 🔌 [plugin | alert] index
 *
 */

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import Store from '@/modules/alert/store'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// registerStore
const registerStore = (store, next) => {
  return new Promise((next) => {
    store.registerModule('alert', Object.assign({
      namespaced: true
    }, Store))
    next()
  })
  if (next) { return next() }
}

// /////////////////////////////////////////////////////////////////////// alert
const alert = (store) => (alertId) => {
  const alert = store.getters['alert/alerts'].find(obj => obj.id.includes(alertId))
  return {
    fetch () {
      return alert
    },
    isOpen () {
      return alert ? alert.isOpen : false
    },
    open (payload) {
      store.dispatch('alert/updateAlert', Object.assign({ alertId, isOpen: true }, payload))
    },
    close () {
      const baseAlert = store.getters['alert/baseAlert']
      store.dispatch('alert/updateAlert', Object.assign({ alertId }, baseAlert))
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function ({ app, store }, inject) {
  await registerStore(store)
  inject('alert', alert(store))
}
