<template>
  <FieldConditional
    v-slot="{ displayField }"
    :scaffold="scaffold"
    :parent-field="field"
    :id-suffix="idSuffix"
    :root-html-tag="rootHtmlTag">

    <slot
      v-if="displayField"
      :field="field"
      :type="type"
      :update-value="updateValue"
      :validation-message="validationMessage" />

  </FieldConditional>
</template>

<script>
// ===================================================================== Imports
import FieldConditional from '@/modules/form/components/field-conditional'

// ====================================================================== Export
export default {
  name: 'FieldStandalone',

  components: {
    FieldConditional
  },

  props: {
    scaffold: {
      type: Object,
      required: true
    },
    formId: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    fieldKey: {
      type: String,
      required: true
    },
    groupIndex: {
      type: [Number, Boolean],
      required: false,
      default: false
    },
    validateOnEntry: {
      type: Boolean,
      required: false,
      default: false
    },
    validateAcrossRoutes: {
      type: Boolean,
      required: false,
      default: false
    },
    deregisterOnDestroy: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * On occasions where the final root element in field-conditional.vue render
     * must be something specific. Such as when wrapping a <tbody> in a field-standalone,
     * it cannot be a div as the wrapper. It must be <tbody> at the root to prevent
     * SSR hydration errors.
     */
    rootHtmlTag: {
      type: String,
      required: false,
      default: 'div'
    }
  },

  data () {
    const fieldKey = this.fieldKey
    const formId = this.formId
    let idSuffix = formId || ''
    if (this.scaffold.hasOwnProperty('parentModelKey')) {
      idSuffix = `${this.groupIndex}|${formId}`
    }
    const id = formId ? `${fieldKey}|${idSuffix}` : fieldKey
    return {
      id,
      idSuffix
    }
  },

  computed: {
    field () {
      return this.$field(this.id).get()
    },
    value () {
      return this.field ? this.field.value : false
    },
    type () {
      const type = this.scaffold.type
      let component = false
      switch (type) {
        case 'input' : component = 'FieldInput'; break
        case 'textarea' : component = 'FieldTextarea'; break
        case 'range' : component = 'FieldRange'; break
        case 'checkbox' : component = 'FieldCheckbox'; break
        case 'radio' : component = 'FieldRadio'; break
        case 'select' : component = 'FieldSelect'; break
        case 'typeahead' : component = 'FieldTypeahead'; break
        case 'chiclet' : component = 'FieldChiclet'; break
      }
      return component
    },
    min () {
      return this.scaffold.min
    },
    max () {
      return this.scaffold.max
    },
    description () {
      return this.scaffold.description
    },
    validationMessage () {
      const message = this.scaffold.validationMessage
      const field = this.field
      if (!message || !field) { return false }
      return message[field.validation]
    }
  },

  watch: {
    value (value) {
      if (this.validateOnEntry) {
        this.$field(this.id).validate()
      }
    }
  },

  async created () {
    if (!this.field) {
      await this.$field(this.id).register(this.formId, this.groupIndex, this.fieldKey, this.scaffold, this.resetTo)
    } else {
      if (this.field.includeInFormSubmission) {
        await this.$field(this.id).update({ validate: true })
      }
    }
  },

  mounted () {
    /**
      * This event is emitted in @/modules/search/plugins/index.js in the
      * $clearSearchFilterSortAndLimit helper
      * @param {object} payload contains id and resetTo keys
      *  @param {string} payload.id If the field.vue prop (resetGroupId) matches this ID, then it will be reset
      *  @param {string} payload.resetTo 'nullState' (nothing selected) or 'defaultValue' (back to default value as often set in JSON)
      */
    this.$nuxt.$on('resetFormFields', (payload) => {
      /**
       * resetGroupId: All fields with the same scaffold.resetGroupId will be reset when the
       * 'resetFormFields' global emitter (in search/plugins/index.js) is triggered
       *
       * resetTo: If the field is reset, should it reset to its default value or
       * completely wiped back to its null state?
       */
      if (this.scaffold.resetGroupId === payload.id) {
        this.$field(this.id).reset(payload.resetTo || this.scaffold.resetTo)
      }
    })
    /**
      * This event is emitted in @/modules/search/components/searcher in the
      * '$route' watcher
      * @param {object} payload contains id and value keys
      *  @param {string} payload.id If the field.vue prop (updateGroupId) matches this ID, then its value will be updated
      *  @param {string} payload.value
      */
    this.$nuxt.$on('updateFormField', (payload) => {
      const value = payload.value
      if (this.scaffold.updateGroupId === payload.id && this.value !== value) {
        this.updateValue(payload.value)
      }
    })
    this.$emit('fieldRegistered', this.id)
  },

  async beforeDestroy () {
    if (!this.validateAcrossRoutes) {
      await this.$field(this.id).update({ validate: false })
    }
    if (this.deregisterOnDestroy) {
      this.$field(this.id).deregister()
    }
  },

  methods: {
    updateValue (value) {
      this.$field(this.id).updateValue(value)
    }
  }
}
</script>
