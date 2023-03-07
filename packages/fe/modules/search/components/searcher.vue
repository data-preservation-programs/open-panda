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

  watch: {
    async '$route' (route) {
      if (this.action === 'query') {
        await this.$search(this.searchKey).refresh(route)
        window.$nuxt.$emit('updateFormField', {
          id: 'search',
          value: this.$search(this.searchKey).get().value
        })
      }
    }
  },

  async created () {
    if (!this.searcher) {
      await this.$search(this.searchKey).register(
        this.searchKey,
        this.action,
        this.searchValue,
        this.storeGetter,
        this.storeAction
      )
    }
  },

  mounted () {
    this.debounce = Debounce((payload) => {
      this.submitSearchTerm(payload)
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
    applySearch (payload) {
      if (this.debounceValueUpdate) {
        return this.debounce(payload)
      }
      this.submitSearchTerm(payload)
    },
    submitSearchTerm (payload) {
      if (!payload.hasOwnProperty('live')) {
        throw new Error('Forgot to specify { live: true|false }')
      }
      this.$search(this.searchKey).for({
        instance: this,
        value: payload.value,
        live: payload.live
      })
      this.$emit('searchbarUpdated')
    }
  },

  render () {
    return this.$scopedSlots.default({
      value: this.value,
      empty: this.empty,
      applySearch: this.applySearch,
      clear: this.clear
    })
  }
}
</script>
