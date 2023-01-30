<template>
  <Filterer
    filter-key="limit"
    :is-single-option="true"
    :filters="options">
    <div slot-scope="{ applyFilter, originalSelected }">
      <FieldContainer
        field-key="results_per_page"
        reset-group-id="filters"
        :scaffold="{
          type: 'select',
          required: false,
          label: 'Results per page',
          options,
          defaultValue: originalSelected || 0 /* manually set to 0 because default in datasets.js store corresponds with the 0'th value in limitOptions */
        }"
        @updateValue="applyFilter" />
    </div>
  </Filterer>
</template>

<script>
// ===================================================================== Imports
import Filterer from '@/modules/search/components/filterer'
import FieldContainer from '@/components/form/field-container'

// ====================================================================== Export
export default {
  name: 'ResultsPerPage',

  components: {
    Filterer,
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
