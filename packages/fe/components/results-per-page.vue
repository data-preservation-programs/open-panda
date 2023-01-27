<template>
  <Limiter :options="options">
    <div slot-scope="{ apply }">
      <FieldContainer
        field-key="results_per_page"
        :scaffold="{
          type: 'select',
          required: false,
          label: 'Results per page',
          options
        }"
        @updateValue="apply" />
    </div>
  </Limiter>
</template>

<script>
// ===================================================================== Imports
import Limiter from '@/modules/search/components/limiter'
import FieldContainer from '@/components/form/field-container'

// ====================================================================== Export
export default {
  name: 'ResultsPerPage',

  components: {
    Limiter,
    FieldContainer
  },

  props: {
    options: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.field-select) {
  width: toRem(66);
}
</style>
