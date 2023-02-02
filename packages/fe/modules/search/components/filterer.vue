<script>
// ===================================================================== Imports
import { mapActions } from 'vuex'

// ====================================================================== Export
export default {
  name: 'Filterer',

  props: {
    action: { // 'query', 'emit', 'store'
      type: String,
      required: false,
      default: 'query'
    },
    filterKey: {
      type: String,
      required: true
    },
    filters: {
      type: Array,
      required: true
    },
    // search by multiple filters or just 1 at a time
    multiple: {
      type: Boolean,
      required: false,
      default: true
    },
    // for filters with boolean or single-select value
    // ie. checkboxes or select
    isSingleOption: {
      type: Boolean,
      required: false,
      default: false
    }
    // storeGetter: {
    //   type: String,
    //   required: false,
    //   default: 'general/filterValue'
    // },
    // storeAction: {
    //   type: String,
    //   required: false,
    //   default: 'general/setFilterValue'
    // }
  },

  data () {
    const action = this.action
    let selected = []
    switch (action) {
      // case 'emit' : selected = this.filterValue; break
      // case 'store' : selected = this.$store.getters[this.storeGetter]; break
      case 'query' : selected = this.getCurrentFilterIndexes(this.$route); break
    }
    return {
      selected,
      originalSelected: selected // lock in the filters on page load
    }
  },

  computed: {
    empty () {
      return this.selected.length === 0
    }
  },

  watch: {
    '$route' (route) {
      this.selected = this.getCurrentFilterIndexes(route)
    }
  },

  created () {
    this.recordFilter(this.filterKey)
  },

  methods: {
    ...mapActions({
      recordFilter: 'search/recordFilter'
    }),
    /**
     * returns array of filter indexes
     *
     * route example: /?new=true&region=us,ca
     * returns: [0] and [2, 6]
     * @param {*} route
     */
    getCurrentFilterIndexes (route) {
      const isSingleOption = this.isSingleOption
      let query = route.query[this.filterKey]
      if (!query) { return [] }
      query = isSingleOption ? [query] : query.split(',')
      const filters = this.filters
      return query.reduce((acc, item) => {
        acc.push(filters.findIndex((filter) => {
          return item === `${filter.value}`
        }))
        return acc
      }, [])
    },
    applyFilter (index) {
      const action = this.action
      const value = index === -1 ? undefined : `${this.filters[index].value}`
      this.$filter.toggleTerm({
        instance: this,
        action,
        storeAction: this.storeAction,
        value,
        filterKey: this.filterKey,
        hash: this.$route.hash,
        isSingleOption: this.isSingleOption
      })
      this.$emit('filterApplied')
      // if (action === 'emit') {
      //   // this.$emit('setFilterValue', value)
      // } else if (action === 'store') {
      //   // this.$store.dispatch(this.storeAction, value)
      // } else {
      //   // this.$search.applyFilter(filter)
      // }
    },
    isSelected (index) {
      return this.selected.includes(index)
    },
    clearFilters () {
      this.$filter.clear(this.filterKey)
    }
  },

  render () {
    const isSingleOption = this.isSingleOption
    const originalSelected = this.originalSelected
    return this.$scopedSlots.default({
      applyFilter: this.applyFilter,
      originalSelected: isSingleOption ? originalSelected[0] : originalSelected,
      selected: this.selected,
      isSelected: this.isSelected,
      clearFilters: this.clearFilters,
      empty: this.empty
    })
  }
}
</script>
