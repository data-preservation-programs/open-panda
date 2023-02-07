<template>
  <Filterer
    filter-key="fullyStored"
    :is-single-option="true"
    :filters="options"
    v-on="$listeners">
    <div slot-scope="{ applyFilter, originalSelected }">
      <FieldContainer
        field-key="toggle_fully_stored"
        :scaffold="{
          type: 'checkbox',
          required: false,
          options: options,
          defaultValue: originalSelected,
          resetGroupId: 'filters',
          resetTo: 'nullState'
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
  name: 'CheckboxFullyStored',

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
