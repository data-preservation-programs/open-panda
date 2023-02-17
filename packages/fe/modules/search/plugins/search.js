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
  const searcher = store.getters['search/searchers'].find(searcher => searcher.searchKey === searchKey)
  return {
    // ================================================================ register
    async register (searchKey, action, searchValue, storeGetter, storeAction) {
      const query = CloneDeep(app.router.history.current.query)
      if (!searcher) {
        let value
        switch (action) {
          case 'emit' : value = searchValue; break
          case 'store' : value = store.getters[storeGetter]; break
          case 'query' : value = query[searchKey]; break
        }
        await this.set({
          searchKey,
          action,
          value,
          storeGetter,
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

    // ===================================================================== set
    async set (incoming) {
      await store.dispatch('search/setSearcher', Object.assign(CloneDeep(searcher || {}), incoming))
    },

    // ============================================================= updateQuery
    async updateQuery (searchKey, value, redirect) {
      const query = CloneDeep(app.router.history.current.query)
      query[searchKey] = value === '' ? undefined : value
      // need to pass location.hash in to retain the current url hash
      app.router.push({
        ...(redirect && { path: redirect }),
        query,
        hash: location.hash
      })
      /**
       * TODO: refactor this so it's not a timeout. We need this so that the
       * query updates BEFORE moving on to doing things like refreshing data.
       * Look up the '$route' watcher function in Nuxt src
       */
      await app.$delay(10)
    },

    // ===================================================================== for
    async for (term) {
      const value = term.hasOwnProperty('value') ? term.value : searcher.value
      await this.set({ value })
      if (term.live) {
        switch (searcher.action) {
          case 'emit' : term.instance.$emit(value); break
          case 'store' : await store.dispatch(storeAction, value); break
          case 'query' : await this.updateQuery(searchKey, value, term.redirect); break
        }
      }
    },

    // ================================================================= refresh
    async refresh (route) {
      const query = CloneDeep(app.router.history.current.query)
      const value = query[searchKey]
      await this.set({
        value: value === undefined ? '' : value
      })
    },

    // =================================================================== clear
    async clear () {
      if (!searcher) { return }
      this.for({ value: '' })
    },

    // ================================================================= isEmpty
    isEmpty () {
      if (!searcher) { return true }
      const value = searcher.value
      return !value || value === ''
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function ({ app, store, route }, inject) {
  inject('search', (searchKey) => Search(app, store, route, searchKey))
}
