<template>
  <Filterer
    filter-key="sort"
    :is-single-option="true"
    :filters="options"
    :url-hash="$route.hash"
    v-on="$listeners">
    <span slot-scope="{ applyFilter, originalSelected }" class="datasets-sort">
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

<style lang="scss" scoped>
.datasets-sort {
  margin-right: toRem(30);
  @include medium {
    margin-right: 0;
  }
  :deep(.field-select) {
    width: toRem(140);
  }
  @include large {
    :deep(.field-label) {
      display: none;
    }
  }
}
</style>
