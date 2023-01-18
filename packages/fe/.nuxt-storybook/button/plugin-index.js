/*
 *
 * 🔌 [plugin | button] index
 *
 */

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import Store from '@/modules/button/store'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// registerStore
const registerStore = (store, next) => {
  return new Promise((next) => {
    store.registerModule('button', Object.assign({
      namespaced: true
    }, Store))
    next()
  })
  if (next) { return next() }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function ({ app, store }, inject) {
  await registerStore(store)
}
