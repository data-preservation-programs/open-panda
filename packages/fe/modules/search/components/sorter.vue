<script>
// ===================================================================== Imports

// ====================================================================== Export
export default {
  name: 'Sorter',

  props: {
    action: { // 'query', 'emit', 'store'
      type: String,
      required: false,
      default: 'query'
    },
    /**
     * sort options
     * [
     *  {
     *    "label": "Data Stored ↑",
     *    "value": 0
     *  },
     *  {
     *    "label": "Data Stored ↓",
     *    "value": 1
     *  },
     *  {
     *    "label": "No. of Storage Providers ↑",
     *    "value": 2
     *  }
     */
    sort: {
      type: Array,
      required: true
    },
    storeGetter: {
      type: String,
      required: false,
      default: 'general/sortValue'
    },
    storeAction: {
      type: String,
      required: false,
      default: 'general/setSortValue'
    }
  },

  data () {
    const action = this.action
    let value = 0
    switch (action) {
      case 'emit' : value = this.sortValue; break
      case 'store' : value = this.$store.getters[this.storeGetter]; break
      case 'query' : value = this.$route.query.sort; break
    }
    return {
      // value is the sort index, default to 0
      value
    }
  },

  computed: {
    empty () {
      return !this.value || this.value === 0
    }
  },

  watch: {
    '$route' (route) {
      if (route.query.sort === undefined && this.action === 'query') {
        this.value = 0
      }
    }
  },

  methods: {
    clear () {
      this.value = 0
    },
    applySort (index) {
      const value = this.sort[index].value
      const action = this.action
      this.$sort.for({
        instance: this,
        action,
        storeAction: this.storeAction,
        value
      })
      this.$emit('sortUpdated')
    }
  },

  render () {
    return this.$scopedSlots.default({
      value: this.value,
      applySort: this.applySort,
      empty: this.empty,
      clear: this.clear
    })
  }
}
</script>
