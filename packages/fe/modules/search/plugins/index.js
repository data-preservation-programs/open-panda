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
  inject('clearSearchFilterSortAndLimit', () => {
    /**
      * This event is caught by the form module's field.vue component in its mounted() hook.
      * Params are outlined there.
      * @arg {object} payload
      *   @param {string} id This id is passed to <FieldContainer> as a "reset-group-id" prop. All fields with this id will be reset.
      *   @param {string} resetTo 'nullState' or 'defaultValue'. Setting this will override the field-level resetTo value. DO NOT leave as an empty string.
      */
    window.$nuxt.$emit('resetFormFields', {
      id: 'filters'
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
    // need to pass this in to retain the current url hash
    // not sure why $route is not picking it up so assigning manually
    app.router.push({ query, hash: location.hash })
  })
}
