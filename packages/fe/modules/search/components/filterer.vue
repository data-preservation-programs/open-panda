<script>
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
    options: {
      type: Array,
      required: true
    },
    // search by multiple options or just 1 at a time
    // multiple: {
    //   type: Boolean,
    //   required: false,
    //   default: true
    // },
    // for options with boolean or single-select value
    // ie. checkboxes or select
    isSingleOption: {
      type: Boolean,
      required: false,
      default: false
    },
    deregisterOnDestroy: {
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

  computed: {
    filter () {
      return this.$filter(this.filterKey).get()
    },
    selected () {
      const filter = this.filter
      return filter ? filter.selected : []
    },
    originalSelected () {
      const filter = this.filter
      return filter ? filter.originalSelected : []
    },
    empty () {
      return this.selected.length === 0
    }
  },

  async created () {
    if (!this.filter) {
      await this.$filter(this.filterKey).register(this.filterKey, this.options, this.isSingleOption, this.action)
    }
  },

  beforeDestroy () {
    if (this.deregisterOnDestroy) {
      this.$filter(this.filterKey).deregister()
    }
  },

  methods: {
    async applyFilter (index) {
      await this.$filter(this.filterKey).toggleTerm({
        instance: this,
        index
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
      this.$filter(this.filterKey).clear()
    }
  },

  render () {
    return this.$scopedSlots.default({
      applyFilter: this.applyFilter,
      originalSelected: this.originalSelected,
      selected: this.selected,
      isSelected: this.isSelected,
      clearFilters: this.clearFilters,
      empty: this.empty
    })
  }
}
</script>
