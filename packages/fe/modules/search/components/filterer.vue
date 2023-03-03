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

  watch: {
    '$route' (route) {
      if (this.action === 'query') {
        this.$filter(this.filterKey).refresh(route)
        const selected = this.filter.selected
        window.$nuxt.$emit('updateFormField', {
          id: this.filterKey,
          value: this.isSingleOption ? selected[0] : selected // this.$filter(this.searchKey).get().value
        })
      }
    }
  },

  async created () {
    if (!this.filter) {
      await this.$filter(this.filterKey).register(
        this.filterKey,
        this.options,
        this.isSingleOption,
        this.action
      )
    }
  },

  beforeDestroy () {
    this.$filter(this.filterKey).clear()
    if (this.deregisterOnDestroy) {
      this.$filter(this.filterKey).deregister()
    }
  },

  methods: {
    async applyFilter (payload) {
      if (!payload.hasOwnProperty('live')) {
        throw new Error('Forgot to specify { live: true|false }')
      }
      await this.$filter(this.filterKey).for({
        instance: this,
        index: payload.index,
        live: payload.live
      })
      this.$emit('filterApplied')
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
