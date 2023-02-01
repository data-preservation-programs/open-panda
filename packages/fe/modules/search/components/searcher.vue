<script>
// ===================================================================== Imports
import Debounce from 'lodash/debounce'

// ====================================================================== Export
export default {
  name: 'Searcher',

  props: {
    searchValue: {
      type: String,
      required: false,
      default: ''
    },
    action: { // 'query', 'emit', 'store'
      type: String,
      required: false,
      default: 'query'
    },
    storeGetter: {
      type: String,
      required: false,
      default: 'general/searchValue'
    },
    storeAction: {
      type: String,
      required: false,
      default: 'general/setSearchValue'
    }
  },

  data () {
    const action = this.action
    let value = ''
    switch (action) {
      case 'emit' : value = this.searchValue; break
      case 'store' : value = this.$store.getters[this.storeGetter]; break
      case 'query' : value = this.$route.query.search; break
    }
    return {
      value,
      debounce: false
    }
  },

  computed: {
    empty () {
      return !this.value || this.value === ''
    }
  },

  watch: {
    '$route' (route) {
      if (route.query.search === undefined && this.action === 'query') {
        this.value = ''
      }
    },
    value () {
      this.debounce()
    }
  },

  mounted () {
    this.debounce = Debounce(() => {
      const value = this.value || ''
      const action = this.action
      this.$search.for({
        instance: this,
        action,
        storeAction: this.storeAction,
        value
      })
      this.$emit('searchbarUpdated')
    }, 200)
  },

  methods: {
    clearSearch () {
      this.value = ''
    },
    updateValue (e) {
      this.value = e.target.value
    }
  },

  render () {
    return this.$scopedSlots.default({
      value: this.value,
      empty: this.empty,
      updateValue: this.updateValue,
      clearSearch: this.clearSearch
    })
  }
}
</script>
