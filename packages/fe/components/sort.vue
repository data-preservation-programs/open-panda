<template>
  <Filterer
    filter-key="sort"
    :is-single-option="true"
    :filters="options"
    v-on="$listeners">
    <span slot-scope="{ applyFilter, originalSelected }">
      <FieldContainer
        field-key="sort_by"
        reset-group-id="filters"
        :scaffold="{
          type: 'select',
          required: false,
          label: 'Sort by',
          options: options,
          defaultValue: originalSelected || 0
        }"
        @updateValue="applyFilter" />
    </span>
  </Filterer>
</template>

<script>
// ===================================================================== Imports
import Filterer from '@/modules/search/components/filterer'
import FieldContainer from '@/components/form/field-container'

// ====================================================================== Export
export default {
  name: 'Sort',

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
