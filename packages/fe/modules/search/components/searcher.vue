<script>
// ===================================================================== Imports
import Debounce from 'lodash/debounce'

// ====================================================================== Export
export default {
  name: 'Searcher',

  props: {
    searchKey: {
      type: String,
      required: true
    },
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
    },
    debounceValueUpdate: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      debounce: false
    }
  },

  computed: {
    searcher () {
      return this.$search(this.searchKey).get()
    },
    empty () {
      const searcher = this.searcher
      return searcher ? searcher.value === '' : true
    },
    value () {
      const searcher = this.searcher
      return searcher ? searcher.value : ''
    }
  },

  async created () {
    if (!this.searcher) {
      await this.$search(this.searchKey).register(
        this.searchKey,
        this.action,
        this.searchValue,
        this.storeGettter,
        this.storeAction
      )
    }
  },

  mounted () {
    this.debounce = Debounce((value) => {
      this.submitSearchTerm(value)
    }, 200)
  },

  beforeDestroy () {
    if (this.deregisterOnDestroy) {
      this.$search(this.searchKey).deregister()
    }
  },

  methods: {
    clear () {
      this.$search(this.searchKey).clear(this)
      this.$emit('searchbarUpdated')
    },
    updateValue (value) {
      if (this.debounceValueUpdate) {
        return this.debounce(value)
      }
      this.submitSearchTerm(value)
    },
    submitSearchTerm (value) {
      this.$search(this.searchKey).for({
        instance: this,
        value
      })
      this.$emit('searchbarUpdated')
    }
  },

  render () {
    return this.$scopedSlots.default({
      value: this.value,
      empty: this.empty,
      updateValue: this.updateValue,
      clear: this.clear
    })
  }
}
</script>
