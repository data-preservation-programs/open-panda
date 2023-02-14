<template>
  <Filterer
    v-slot="{ applyFilter, originalSelected }"
    filter-key="limit"
    :is-single-option="true"
    :options="options"
    v-on="$listeners">
    <FieldContainer
      field-key="results_per_page"
      :scaffold="{
        type: 'select',
        required: false,
        label: 'Results per page',
        options,
        defaultValue: originalSelected.length > 0 ? originalSelected : [0], /* manually set to 0 because default in datasets.js store corresponds with the 0'th value in limitOptions */
        resetGroupId: 'filters',
        isSingleOption: true
      }"
      @updateValue="applyFilter" />
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
// ///////////////////////////////////////////////////////////////////// General
:deep(.field-select) {
  width: toRem(66);
}
</style>
