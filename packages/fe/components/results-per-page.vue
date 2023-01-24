<template>
  <Limiter :options="options">
    <div
      slot-scope="{ index, apply }"
      class="col-3">
      <FieldContainer
        :form-id="formId"
        :scaffold="{
          type: 'select',
          required: false,
          label: 'Results per page',
          model_key: `${storeKey}-limit`,
          options
        }"
        :value="index || 0"
        @updateValue="apply(getSelectedValue(`${storeKey}-limit`))" />
    </div>
  </Limiter>
</template>

<script>
// ===================================================================== Imports
import { findIndex } from 'lodash'
import Limiter from '@/modules/search/components/limiter'
import FieldContainer from '@/components/form/field-container'

const formId = 'limit|form'

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
    storeKey: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      formId
    }
  },

  async fetch ({ app, store, route, error }) {
    await store.dispatch('form/registerFormModel', {
      formId,
      state: 'valid'
    })
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
