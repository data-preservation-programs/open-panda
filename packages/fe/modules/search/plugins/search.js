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
    this.store.dispatch('search/recordSearchValue', '')
    this.app.router.push({ query: this.query })
  }

  // =================================================================== isEmpty
  isEmpty () {
    return this.store.getters['search/searchValue'] === ''
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
      this.store.dispatch('search/recordSearchValue', value)
      this.app.router.push({ query: this.query })
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function ({ app, store, route }, inject) {
  inject('search', new Search(app, store, route))
}
