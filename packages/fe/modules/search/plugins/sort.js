/*
 *
 * 🔌 [plugin | search] sort
 *
 * methods for sort
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
  /**
   * @method for - stores sort value
   * @param {Object} term {
   *    instance: this,
   *     action,
   *     storeAction: this.storeAction,
   *     value
   *   }
   * @description term.value is an integer that reflects the select value
   * if term.action = query - pushes to url and store
   */
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
