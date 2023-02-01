<script>
// ====================================================================== Export
export default {
  name: 'Field',

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
    resetGroupId: {
      type: String,
      required: false,
      default: ''
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
    }
  },

  data () {
    let fieldKey = this.fieldKey
    const formId = this.formId
    if (this.scaffold.hasOwnProperty('parentModelKey')) {
      fieldKey = `${fieldKey}|${this.groupIndex}`
    }
    const id = fieldKey !== '' && formId ? `${fieldKey}|${formId}` : fieldKey
    return {
      id
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
      await this.$field(this.id).register(this.formId, this.groupIndex, this.fieldKey, this.scaffold)
    } else {
      await this.$field(this.id).update({ validate: true })
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
      if (this.resetGroupId === payload.id) {
        this.$field(this.id).reset(payload.resetTo)
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
  },

  render () {
    return this.$scopedSlots.default({
      updateValue: this.updateValue,
      field: this.field,
      type: this.type,
      validationMessage: this.validationMessage
    })
  }
}
</script>
