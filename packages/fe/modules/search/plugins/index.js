/*
 *
 * 🔌 [plugin | search] index
 *
 */

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import Store from '@/modules/search/store'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// registerStore
const registerStore = (store, next) => {
  return new Promise((next) => {
    store.registerModule('search', Object.assign({
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
  inject('clearSearchAndFilters', () => {
    app.$search.clearSearchQuery()
    app.$filter.clearAll()
  })
  inject('clearAllFilters', (exception) => {
    app.$filter.clearAll(exception)
  })
  inject('clearAll', () => {
    app.$search.clearSearchQuery()
    app.$filter.clearAll()
    app.$sort.clearQuery()
    app.$limit.clearQuery()
  })
}
