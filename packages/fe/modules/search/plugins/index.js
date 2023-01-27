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
export default async function ({ app, store, route }, inject) {
  await registerStore(store)
  inject('clearSearchAndFilters', () => {
    app.$search.clearSearchQuery()
    app.$filter.clearAll()
  })
  inject('clearAllFilters', (exception) => {
    app.$filter.clearAll(exception)
  })
  inject('clearSearchFilterSortAndLimit', () => {
    /**
      * This event is caught by the form module's field.vue component in its mounted() hook.
      * Params are outlined there.
      */
    window.$nuxt.$emit('resetFormFields', {
      id: 'filters',
      resetTo: 'nullState' // 'nullState' or 'defaultValue'
    })
    /**
      * Unfortunately we can't call the search/filter clear methods individually
      * because it leads to the route being updated twice and thus 2 database
      * calls to update data. Instead, we clear all search/filter query params
      * here in one fell swoop
      */
    const query = route.query
    query.search = undefined
    const filters = store.getters['search/filters']
    Object.keys(query).forEach((key) => {
      if (filters.includes(key) && query[key] !== undefined) {
        query[key] = undefined
      }
    })
    app.router.push({ query })
  })
}
