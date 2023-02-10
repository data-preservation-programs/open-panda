/*
 *
 * 🔌 [plugin | search] search
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

// ////////////////////////////////////////////////////////////// [Class] Search
// -----------------------------------------------------------------------------
const Search = (app, store, route, searchKey) => {
  const query = route.query
  const searcher = store.getters['search/searchers'].find(searcher => searcher.searchKey === searchKey)
  let value, action, searchValue, storeGettter, storeAction
  if (searcher) {
    value = searcher.value
    action = searcher.action
    searchValue = searcher.searchValue
    storeGettter = searcher.storeGettter
    storeAction = searcher.storeAction
  }
  return {
    // ================================================================ register
    async register (searchKey, action, searchValue, storeGettter, storeAction) {
      if (!searcher) {
        switch (action) {
          case 'emit' : value = searchValue; break
          case 'store' : value = store.getters[storeGetter]; break
          case 'query' : value = query[searchKey]; break
        }
        await store.dispatch('search/setSearcher', {
          searchKey,
          action,
          value,
          storeGettter,
          storeAction
        })
      }
    },

    // ============================================================== deregister
    async deregister () {
      if (searcher) {
        await store.dispatch('search/removeSearcher', searchKey)
      }
    },

    // ===================================================================== get
    get () {
      return searcher
    },

    // ============================================================= updateQuery
    updateQuery (filterKey, value) {
      query[filterKey] = value === '' ? undefined : value
      // need to pass this in to retain the current url hash
      // not sure why $route is not picking it up so assigning manually
      app.router.push({ query: query, hash: location.hash })
    },

    // ================================================================== update
    for (payload) {
      const value = payload.value
      store.dispatch('search/setSearcher', Object.assign(CloneDeep(searcher), {
        value
      }))
      switch (action) {
        case 'emit' : payload.instance.$emit(value); break
        case 'store' : store.dispatch(storeAction, value); break
        case 'query' : this.updateQuery(searchKey, value); break
      }
    },

    // =================================================================== clear
    clear (instance) {
      const value = ''
      store.dispatch('search/setSearcher', Object.assign(CloneDeep(searcher), {
        value
      }))
      switch (action) {
        case 'emit' : instance.$emit(value); break
        case 'store' : store.dispatch(storeAction, value); break
        case 'query' : this.updateQuery(searchKey, value); break
      }
    },

    // ================================================================= isEmpty
    isEmpty () {
      let empty
      switch (action) {
        case 'emit' : empty === ''; break
        case 'store' : empty = store.getters[storeGetter] === ''; break
        case 'query' : empty = !query.search || query.search === ''; break
      }
      return empty
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function ({ app, store, route }, inject) {
  inject('search', (searchKey) => Search(app, store, route, searchKey))
}
