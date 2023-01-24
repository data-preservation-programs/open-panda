<script>
// ===================================================================== Imports

// ====================================================================== Export
export default {
  name: 'Limiter',

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
     *    "label": 12,
     *    "value": 12
     *  },
     *  {
     *    "label": 24,
     *    "value": 24
     *  }
     */
    options: {
      type: Array,
      required: true
    },
    storeGetter: {
      type: String,
      required: false,
      default: 'general/limitValue'
    },
    storeAction: {
      type: String,
      required: false,
      default: 'general/setLimitValue'
    }
  },

  data () {
    const action = this.action
    let value = 0
    switch (action) {
      case 'emit' : value = this.limitValue; break
      case 'store' : value = this.$store.getters[this.storeGetter]; break
      case 'query' : value = this.$route.query.limit; break
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
      if (route.query.limit === undefined && this.action === 'query') {
        this.value = 0
      }
    }
  },

  methods: {
    clear () {
      this.value = 0
    },
    apply (index) {
      const value = this.options[index].value
      const action = this.action
      this.$limit.for({
        instance: this,
        action,
        storeAction: this.storeAction,
        value
      })
      this.$emit('limitUpdated')
    }
  },

  render () {
    return this.$scopedSlots.default({
      value: this.value,
      apply: this.apply,
      empty: this.empty,
      clear: this.clear
    })
  }
}
</script>
