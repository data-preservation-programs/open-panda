<template>
  <div class="paginator">

    <slot name="before" />

    <template v-if="page !== 1">
      <slot name="first" :increment-page="incrementPage" />
      <slot name="prev" :increment-page="incrementPage" />
      <slot name="breaker-left" />
    </template>

    <template v-for="pageButton in pages">
      <slot
        v-if="pageButton.display"
        name="button"
        :button="pageButton"
        :increment-page="incrementPage" />
    </template>

    <template v-if="page !== totalPages">
      <slot name="breaker-right" />
      <slot name="next" :increment-page="incrementPage" />
      <slot name="last" :increment-page="incrementPage" />
    </template>

    <slot name="after" />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Paginator',

  props: {
    action: { // 'query', 'emit', 'store'
      type: String,
      required: false,
      default: 'query'
    },
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
    page: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      filterKey: 'page'
    }
  },

  computed: {
    filter () {
      return this.$filter(this.filterKey).get()
    },
    pages () {
      const total = this.totalPages
      const current = this.page
      const buffer = 2
      const compiled = []
      for (let i = 0; i < total; i++) {
        compiled.push({
          value: i + 1,
          display: i >= current - buffer - 1 && i <= current + buffer - 1,
          current: i + 1 === current
        })
      }
      return compiled
    }
  },

  async created () {
    if (!this.filter) {
      await this.$filter(this.filterKey).register(this.filterKey, this.pages, true, 'query')
    }
  },

  methods: {
    incrementPage (page) {
      this.$filter('page').toggleTerm({
        instance: this,
        value: page
      })
      this.$emit('filterApplied')
    }
  }
}
</script>
