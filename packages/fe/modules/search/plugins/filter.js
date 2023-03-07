/*
 *
 * 🔌 [plugin | search] filterer
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ===================================================== getCurrentFilterIndexes
/**
 * returns array of filterer indexes
 *
 * route example: /?new=true&region=us,ca
 * returns: [0] and [2, 6]
 * @param {*} route
 */
const getFilterIndexesFromQuery = (route, filterKey, options, isSingleOption) => {
  let query = route.query[filterKey]
  if (!query) { return [] }
  query = isSingleOption ? [query] : query.split(',')
  const selected = []
  query.forEach((item) => {
    const index = options.findIndex(option => item === `${option.value}`)
    if (index !== -1) {
      selected.push(index)
    }
  })
  return selected
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
  let filterer = store.getters['search/filters'].find(filterer => filterer.filterKey === filterKey)
  return {
    // ================================================================ register
    async register (filterKey, options, isSingleOption, action) {
      if (!filterer) {
        let selected = []
        switch (action) {
          // case 'emit' : selected = this.filterValue; break
          // case 'store' : selected = this.$store.getters[this.storeGetter]; break
          case 'query' : selected = getFilterIndexesFromQuery(route, filterKey, options, isSingleOption); break
        }
        this.set({
          filterKey,
          options,
          isSingleOption,
          action,
          selected, // list of indexes
          queued: this.convert(action, selected, options),
          originalSelected: selected // lock in the original selection upon registration
        })
      }
    },

    // ============================================================== deregister
    async deregister () {
      if (filterer) {
        await store.dispatch('search/removeFilter', filterKey)
      }
    },

    // ===================================================================== get
    get () {
      return filterer
    },

    // ===================================================================== set
    async set (incoming) {
      await store.dispatch('search/setFilter', Object.assign(CloneDeep(filterer || {}), incoming))
      filterer = store.getters['search/filters'].find(filterer => filterer.filterKey === filterKey)
    },

    // ===================================================== getSelectionOptions
    getSelectionOptions () {
      if (!filterer) { return [] }
      const options = CloneDeep(filterer.options)
      let selected = filterer.selected
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
    async updateQuery (filterKey, value) {
      const query = CloneDeep(app.router.history.current.query)
      query[filterKey] = value
      // need to pass location.hash in to retain the current url hash
      app.router.push({ query, hash: location.hash })
      /**
       * TODO: refactor this so it's not a timeout. We need this so that the
       * query updates BEFORE moving on to doing things like refreshing data.
       * Look up the '$route' watcher function in Nuxt src
       */
      await app.$delay(10)
    },

    // ================================================================= convert
    convert (action, selected, options) {
      let converted
      switch (action) {
        // case 'emit' : payload.instance.$emit(value); break
        // case 'store' : await store.dispatch(storeAction, value); break
        case 'query' : converted = convertSelectedIndexesToQueryString(selected, options || filterer.options); break
      }
      return converted
    },

    // ===================================================================== for
    async for (term) {
      if (!filterer) { return }
      let selected = CloneDeep(filterer.selected)
      const index = term.index
      const existing = selected.findIndex(option => option === index) // incoming index is already selected (if not -1)
      if (filterer.isSingleOption) {
        selected = index === -1 ? [] : [index]
      } else {
        existing === -1 ? selected.push(index) : selected.splice(existing, 1)
      }
      await this.set({
        selected,
        queued: this.convert(filterer.action, selected)
      })
      if (term.live) {
        await this.apply(term)
      }
    },

    // =================================================================== apply
    async apply () {
      switch (filterer.action) {
        // case 'emit' : payload.instance.$emit(value); break
        // case 'store' : await store.dispatch(storeAction, value); break
        case 'query' : await this.updateQuery(filterKey, filterer.queued); break
      }
    },

    // ================================================================= refresh
    refresh (route) {
      this.set({
        selected: getFilterIndexesFromQuery(route, filterKey, filterer.options, filterer.isSingleOption)
      })
    },

    // =================================================================== clear
    async clear () {
      if (!filterer) { return }
      this.set({ selected: [], queued: undefined })
    },

    // ================================================================= isEmpty
    isEmpty () {
      if (!filterer) { return true }
      return filterer.selected.length === 0
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ app, store, route }, inject) {
  inject('filter', (filterKey) => Filter(app, store, route, filterKey))
}
