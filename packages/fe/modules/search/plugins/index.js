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
  inject('clearFilters', async (filters) => {
    const len = filters.length
    for (let i = 0; i < len; i++) {
      await app.$filter(filters[i]).clear()
    }
  })
  inject('clearSearchAndFilters', async (filters) => {
    await app.$search('search').clear()
    await app.$clearFilters(filters)
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
    window.$nuxt.$emit('resetFormFields', {
      id: 'search',
      resetTo: 'nullState'
    })
  })
  inject('checkIfFilterSelectionsExist', (filters) => {
    let selelectionsExist = false
    filters.forEach((filterKey) => {
      if (!app.$filter(filterKey).isEmpty()) {
        selelectionsExist = true
      }
    })
    return selelectionsExist
  })
}
