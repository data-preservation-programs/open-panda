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
  clearAll (filterKey) {
    const filters = this.store.getters['search/filters']
    const query = this.query
    Object.keys(query).forEach((key) => {
      if (filters.includes(key) && query[key] !== undefined) {
        this.query[key] = undefined
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
    const current = this.query[filterKey]
    if (!current) {
      this.query[term.filterKey] = term.value
    } else {
      const selected = current.split(',')
      const value = term.value
      const index = selected.findIndex(item => item === value)
      if (index !== -1) {
        selected.splice(index, 1)
      } else {
        selected.push(value)
      }
      const join = selected.join(',')
      this.query[term.filterKey] = join.length === 0 ? undefined : join
    }
    this.app.router.push({ query: this.query })
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ app, store, route }, inject) {
  inject('filter', new Filter(app, store, route))
}
