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
          filterKey
        }))
      }
      return compiled
    },

    // ============================================================= updateQuery
    updateQuery (filterKey, value) {
      query[filterKey] = value
      // need to pass this in to retain the current url hash
      // not sure why $route is not picking it up so assigning manually
      app.router.push({ query: query, hash: location.hash })
    },

    // ================================================================== update
    async update (value) {
      const index = options.findIndex(option => `${option.value}` === `${value}`)
      const alreadySelectedIndex = selected.findIndex(option => option === index)
      alreadySelectedIndex === -1 ? selected.push(index) : selected.splice(alreadySelectedIndex, 1)
      if (isSingleOption) {
        selected = value === undefined ? [] : [selected.pop()]
      }
      await store.dispatch('search/setFilter', Object.assign(CloneDeep(filter), {
        selected
      }))
      return selected
    },

    // =================================================================== clear
    async clear () {
      await store.dispatch('search/setFilter', Object.assign(CloneDeep(filter), {
        selected: []
      }))
      this.updateQuery(filterKey, undefined)
    },

    // ================================================================= isEmpty
    isEmpty () {
      if (!filter) { return true }
      return selected.length === 0
    },

    // ============================================================== toggleTerm
    async toggleTerm (term) {
      const selected = await this.update(term.value)
      if (action === 'query') {
        const converted = convertSelectedIndexesToQueryString(selected, options)
        this.updateQuery(filterKey, converted)
      }
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ app, store, route }, inject) {
  inject('filter', (filterKey) => Filter(app, store, route, filterKey))
}
