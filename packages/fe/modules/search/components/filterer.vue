<script>
// ===================================================================== Imports
import { mapActions } from 'vuex'
import { concat } from 'lodash'

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
    // for filters with boolean value
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
      case 'query' : selected = this.getCurrentFilters(this.$route); break
    }
    return {
      selected
    }
  },

  computed: {
    empty () {
      return this.selected.length === 0
    }
  },

  watch: {
    '$route' (route) {
      this.selected = this.getCurrentFilters(route)
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
     * returns array of filters
     * isSingleOption filters will return the key
     *
     * route example: /?new=true&region=us,ca
     * returns: ['new', 'us', 'ca']
     * @param {*} route
     */
    getCurrentFilters (route) {
      const isSingleOptionArr = []
      let isMultiOptionArr = []
      const query = route.query[this.filterKey]
      if (query) {
        if (this.isSingleOption) {
          isSingleOptionArr.push(this.filterKey)
        } else {
          isMultiOptionArr = query.split(',')
        }
      }
      return concat(isSingleOptionArr, isMultiOptionArr)
    },
    applyFilter (index) {
      const action = this.action
      const value = `${this.filters[index].value}`
      this.$filter.toggleTerm({
        instance: this,
        action,
        storeAction: this.storeAction,
        value,
        filterKey: this.filterKey
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
    isSelected (value) {
      return this.selected.includes(`${value}`)
    },
    clearFilters () {
      this.$filter.clear(this.filterKey)
    }
  },

  render () {
    return this.$scopedSlots.default({
      applyFilter: this.applyFilter,
      selected: this.selected,
      isSelected: this.isSelected,
      clearFilters: this.clearFilters,
      empty: this.empty
    })
  }
}
</script>
