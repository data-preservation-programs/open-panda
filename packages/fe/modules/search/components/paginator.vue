<template>
  <Filterer
    v-slot="{ applyFilter }"
    filter-key="page"
    :is-single-option="true"
    :options="pages"
    v-on="$listeners">
    <div class="paginator">

      <slot name="before" />

      <template v-if="page !== 1">
        <slot
          name="first"
          :increment-page="applyFilter"
          :get-index="getIndex" />
        <slot
          name="prev"
          :increment-page="applyFilter"
          :get-index="getIndex" />
        <slot name="breaker-left" />
      </template>

      <template v-for="pageButton in pages">
        <slot
          v-if="pageButton.display"
          name="button"
          :button="pageButton"
          :increment-page="applyFilter"
          :get-index="getIndex" />
      </template>

      <template v-if="page !== totalPages">
        <slot name="breaker-right" />
        <slot
          name="next"
          :increment-page="applyFilter"
          :get-index="getIndex" />
        <slot
          name="last"
          :increment-page="applyFilter"
          :get-index="getIndex" />
      </template>

      <slot name="after" />

    </div>
  </Filterer>
</template>

<script>
// ===================================================================== Imports
import Filterer from '@/modules/search/components/filterer'

// ====================================================================== Export
export default {
  name: 'Paginator',

  components: {
    Filterer
  },

  props: {
    action: { // 'query', 'emit', 'store'
      type: String,
      required: false,
      default: 'query'
    },
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
          value: i + 1,
          display: i >= current - buffer - 1 && i <= current + buffer - 1,
          current: i + 1 === current
        })
      }
      return compiled
    }
  },

  methods: {
    getIndex (page) {
      return this.pages.findIndex(item => item.value === page)
    }
  }
}
</script>
