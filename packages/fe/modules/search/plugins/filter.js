/*
 *
 * 🔌 [plugin | search] filter
 *
 */

// ////////////////////////////////////////////////////////////// [Class] Filter
// -----------------------------------------------------------------------------
class Filter {
  // =============================================================== constructor
  constructor (app, store, route) {
    this.app = app
    this.store = store
    this.route = route
    this.query = route.query
  }

  // ===================================================================== clear
  clear (filterKey) {
    this.query[filterKey] = undefined
    this.app.router.push({ query: this.query })
  }

  // ================================================================== clearAll
  clearAll (exception) {
    const filters = this.store.getters['search/filters']
    const query = this.query
    Object.keys(query).forEach((key) => {
      if (key !== exception) {
        if (filters.includes(key) && query[key] !== undefined) {
          this.query[key] = undefined
        }
      }
    })
    this.app.router.push({ query: this.query })
  }

  // =================================================================== isEmpty
  isEmpty () {
    const filters = this.store.getters['search/filters']
    const query = this.query
    let empty = true
    Object.keys(query).forEach((key) => {
      if (filters.includes(key) && query[key] !== undefined) {
        empty = false
      }
    })
    return empty
  }

  // ================================================================ toggleTerm
  toggleTerm (term) {
    const filterKey = term.filterKey
    const isSingleOption = term.isSingleOption
    const value = term.value
    const current = this.query[filterKey]
    if (!current) {
      this.query[term.filterKey] = value
    } else {
      let join
      // If single option, replace entire value of query param
      if (isSingleOption) {
        join = value
      // Otherwise, add or remove to query param
      } else {
        const selected = current.split(',')
        const index = selected.findIndex(item => item === value)
        if (!value || index !== -1) {
          selected.splice(index, 1)
        } else {
          selected.push(value)
        }
        join = selected.join(',')
      }
      this.query[term.filterKey] = (!join || join.length === 0) ? undefined : join
    }
    // need to pass this in to retain the current url hash
    // not sure why $route is not picking it up so assigning manually
    this.app.router.push({ query: this.query, hash: term.hash })
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ app, store, route }, inject) {
  inject('filter', new Filter(app, store, route))
}
