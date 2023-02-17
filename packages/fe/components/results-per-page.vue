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
        resetGroupId: 'results-per-page',
        updateGroupId: 'results-per-page',
        isSingleOption: true
      }"
      @updateValue="initializeFilter($event, applyFilter)" />
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
  },

  methods: {
    async initializeFilter (index, applyFilter) {
      await applyFilter({ index, live: false })
      await this.$filter('page').for({ index: 0, live: false })
      await this.$applyMultipleFiltersToQuery({ filters: ['page', 'limit'] })
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
