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
     * options
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
    options: {
      type: Array,
      required: true
    },
    storeGetter: {
      type: String,
      required: false,
      default: 'general/sortValueIndex'
    },
    storeAction: {
      type: String,
      required: false,
      default: 'general/setSortValueIndex'
    }
  },

  data () {
    const action = this.action
    let index = 0
    switch (action) {
      case 'emit' : index = this.sortValueIndex; break
      case 'store' : index = this.$store.getters[this.storeGetter]; break
      case 'query' : index = this.$route.query.sort; break
    }
    return {
      // value is the sort index, default to 0
      index
    }
  },

  computed: {
    empty () {
      return !this.index || this.index === 0
    }
  },

  watch: {
    '$route' (route) {
      if (route.query.sort === undefined && this.action === 'query') {
        this.index = 0
      }
    }
  },

  methods: {
    clear () {
      this.index = 0
    },
    apply (index) {
      const action = this.action
      this.index = index
      this.$sort.for({
        instance: this,
        action,
        storeAction: this.storeAction,
        index
      })
      this.$emit('sortUpdated')
    }
  },

  render () {
    return this.$scopedSlots.default({
      index: this.index,
      apply: this.apply,
      empty: this.empty,
      clear: this.clear
    })
  }
}
</script>
