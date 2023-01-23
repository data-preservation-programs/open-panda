/*
 *
 * 🔌 [plugin | search] sort
 *
 */

// //////////////////////////////////////////////////////////////// [Class] Sort
// -----------------------------------------------------------------------------
class Sort {
  // =============================================================== constructor
  constructor (app, store, route) {
    this.app = app
    this.store = store
    this.route = route
    this.query = route.query
  }

  // ========================================================== clearSearchQuery
  clearSortQuery () {
    this.query.sort = undefined
    this.store.dispatch('search/recordSortValue', 0)
    this.app.router.push({ query: this.query })
  }

  // =================================================================== isEmpty
  isEmpty () {
    return this.store.getters['search/sortValue'] === 0
  }

  // ======================================================================= for
  for (term) {
    const action = term.action
    const value = term.value
    if (action === 'emit') {
      term.instance.$emit('setSortValue', value)
    } else if (action === 'store') {
      this.store.dispatch(term.storeAction, value)
    } else {
      this.query.sort = value === 0 ? undefined : value
      this.store.dispatch('search/recordSortValue', value)
      this.app.router.push({ query: this.query })
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ app, store, route }, inject) {
  inject('sort', new Sort(app, store, route))
}
