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

  computed: {
    pages () {
      const total = this.totalPages
      const current = this.page
      const buffer = 2
      const compiled = []
      for (let i = 0; i < total; i++) {
        compiled.push({
          num: i + 1,
          display: i >= current - buffer - 1 && i <= current + buffer - 1,
          current: i + 1 === current
        })
      }
      return compiled
    }
  },

  methods: {
    incrementPage (page) {
      if (this.action === 'query') {
        this.$filter.toggleTerm({
          instance: this,
          action: this.action,
          storeAction: this.storeAction,
          value: page,
          filterKey: 'page',
          isSingleOption: true
        })
        this.$emit('filterApplied')
      }
    }
  }
}
</script>
