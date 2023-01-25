<script>
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
      default: 'general/limitValueIndex'
    },
    storeAction: {
      type: String,
      required: false,
      default: 'general/setLimitValueIndex'
    }
  },

  data () {
    const action = this.action
    let index = 0
    switch (action) {
      case 'emit' : index = this.limitValueIndex; break
      case 'store' : index = this.$store.getters[this.storeGetter]; break
      case 'query' : index = this.$route.query.limit; break
    }
    return {
      // value is the limit index, default to 0
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
      if (route.query.limit === undefined && this.action === 'query') {
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
      this.$limit.for({
        instance: this,
        action,
        storeAction: this.storeAction,
        index
      })
      this.$emit('limitUpdated')
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
