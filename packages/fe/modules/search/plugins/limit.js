/*
 *
 * 🔌 [plugin | search] limit
 *
 * methods for limit
 *
 */

// //////////////////////////////////////////////////////////////// [Class] Sort
// -----------------------------------------------------------------------------
class Limit {
  // =============================================================== constructor
  constructor (app, store, route) {
    this.app = app
    this.store = store
    this.route = route
    this.query = route.query
  }

  // ================================================================ clearQuery
  clearQuery () {
    this.query.limit = undefined
    this.store.dispatch('search/recordLimitValue', 0)
    this.app.router.push({ query: this.query })
  }

  // =================================================================== isEmpty
  isEmpty () {
    return this.store.getters['search/limitValue'] === 0
  }

  // ======================================================================= for
  /**
   * @method for - stores limit value
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
      term.instance.$emit('setLimitValue', value)
    } else if (action === 'store') {
      this.store.dispatch(term.storeAction, value)
    } else {
      this.query.limit = value
      this.store.dispatch('search/recordLimitValue', value)
      this.app.router.push({ query: this.query })
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ app, store, route }, inject) {
  inject('limit', new Limit(app, store, route))
}
