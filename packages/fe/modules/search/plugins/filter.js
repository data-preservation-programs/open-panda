/*
 *
 * 🔌 [plugin | search] filter
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ===================================================== getCurrentFilterIndexes
/**
 * returns array of filter indexes
 *
 * route example: /?new=true&region=us,ca
 * returns: [0] and [2, 6]
 * @param {*} route
 */
const getFilterIndexesFromQuery = (route, filterKey, options, isSingleOption) => {
  let query = route.query[filterKey]
  if (!query) { return [] }
  query = isSingleOption ? [query] : query.split(',')
  return query.reduce((acc, item) => {
    acc.push(options.findIndex((option) => {
      return item === `${option.value}`
    }))
    return acc
  }, [])
}

// ========================================= convertSelectedIndexesToQueryString
const convertSelectedIndexesToQueryString = (selected, options) => {
  console.log(selected)
  console.log(options)
  const len = selected.length
  let query = ''
  for (let i = 0; i < len; i++) {
    const value = options[selected[i]].value
    query += i === 0 ? value : `,${value}`
  }
  return query !== '' ? query : undefined
}

// ////////////////////////////////////////////////////////////// [Class] Filter
// -----------------------------------------------------------------------------
const Filter = (app, store, route, filterKey) => {
  const query = route.query
  const filter = store.getters['search/filters'].find(filter => filter.filterKey === filterKey)
  let options, selected, isSingleOption, action
  if (filter) {
    options = CloneDeep(filter.options)
    selected = CloneDeep(filter.selected)
    isSingleOption = filter.isSingleOption
    action = filter.action
  }
  return {
    // ================================================================ register
    async register (filterKey, options, isSingleOption, action) {
      if (!filter) {
        switch (action) {
          // case 'emit' : selected = this.filterValue; break
          // case 'store' : selected = this.$store.getters[this.storeGetter]; break
          case 'query' : selected = getFilterIndexesFromQuery(route, filterKey, options, isSingleOption); break
        }
        await store.dispatch('search/setFilter', {
          filterKey,
          options,
          isSingleOption,
          action,
          selected,
          originalSelected: selected // lock in the original selection upon registration
        })
      }
    },

    // ============================================================== deregister
    async deregister () {
      if (filter) {
        await store.dispatch('search/removeFilter', filterKey)
      }
    },

    // ===================================================================== get
    get () {
      return filter
    },

    // ===================================================================== get
    getSelectionOptions () {
      if (!filter) { return [] }
      const len = selected.length
      const compiled = []
      for (let i = 0; i < len; i++) {
        const index = selected[i]
        compiled.push(Object.assign(options[index], {
          filterKey,
          index
        }))
      }
      return compiled
    },

    // ============================================================= updateQuery
    updateQuery (filterKey, value) {
      return new Promise((resolve) => {
        query[filterKey] = value
        // need to pass this in to retain the current url hash
        // not sure why $route is not picking it up so assigning manually
        app.router.push({ query: query, hash: location.hash })
        /**
         * TODO: refactor this so it's not a timeout. We need this so that the
         * query updates BEFORE moving on to doing things like refreshing data.
         * Look up the '$route' watcher function in Nuxt src
         */
        const timeout = setTimeout(() => {
          resolve()
          clearTimeout(timeout)
        }, 1)
      })
    },

    // ================================================================== update
    async update (incoming) { // incoming refers to the newly selected index
      const existing = selected.findIndex(option => option === incoming) // incoming index is already selected (if not -1)
      if (isSingleOption) {
        selected = incoming === -1 ? [] : [incoming]
      } else {
        existing === -1 ? selected.push(incoming) : selected.splice(existing, 1)
      }
      await store.dispatch('search/setFilter', Object.assign(CloneDeep(filter), {
        selected
      }))
      return selected
    },

    // =================================================================== clear
    async clear () {
      if (!filter) { return }
      store.dispatch('search/setFilter', Object.assign(CloneDeep(filter), {
        selected: []
      }))
      await this.updateQuery(filterKey, undefined)
    },

    // ================================================================= isEmpty
    isEmpty () {
      if (!filter) { return true }
      return selected.length === 0
    },

    // ============================================================== toggleTerm
    async toggleTerm (term) {
      const selected = await this.update(term.index)
      if (action === 'query') {
        const converted = convertSelectedIndexesToQueryString(selected, options)
        await this.updateQuery(filterKey, converted)
      }
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ app, store, route }, inject) {
  inject('filter', (filterKey) => Filter(app, store, route, filterKey))
}
