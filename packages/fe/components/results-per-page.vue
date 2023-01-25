<template>
  <Limiter :options="options">
    <div slot-scope="{ index, apply }">
      <FieldContainer
        :form-id="formId"
        :scaffold="{
          type: 'select',
          required: false,
          label: 'Results per page',
          model_key: 'limit',
          options: options
        }"
        :value="index || 0"
        @updateValue="apply(getSelectedValue('limit'))" />
    </div>
  </Limiter>
</template>

<script>
// ===================================================================== Imports
import { findIndex } from 'lodash'
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
    },
    formId: {
      type: String,
      required: true
    }
  },

  computed: {
    // checkbox and dropdowns
    formList () {
      return this.$store.getters['form/fields']
    }
  },

  methods: {
    getSelectedValue (modelKey) {
      const idx = findIndex(this.formList, function (o) { return o.model_key === modelKey })
      return this.formList[idx] ? this.formList[idx].value : false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
