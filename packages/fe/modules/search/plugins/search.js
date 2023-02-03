/*
 *
 * 🔌 [plugin | search] search
 *
 */

// ////////////////////////////////////////////////////////////// [Class] Search
// -----------------------------------------------------------------------------
class Search {
  // =============================================================== constructor
  constructor (app, store, route) {
    this.app = app
    this.store = store
    this.route = route
    this.query = route.query
  }

  // ========================================================== clearSearchQuery
  clearSearchQuery () {
    this.query.search = undefined
    this.app.router.push({ query: this.query })
  }

  // =================================================================== isEmpty
  isEmpty () {
    return !this.query.search
  }

  // ================================================================ toggleTerm
  for (term) {
    const action = term.action
    const value = term.value
    if (action === 'emit') {
      term.instance.$emit('setSearchValue', value)
    } else if (action === 'store') {
      this.store.dispatch(term.storeAction, value)
    } else {
      this.query.search = value === '' ? undefined : value
      // need to pass this in to retain the current url hash
      // not sure why $route is not picking it up so assigning manually
      this.app.router.push({ query: this.query, hash: location.hash })
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function ({ app, store, route }, inject) {
  inject('search', new Search(app, store, route))
}
