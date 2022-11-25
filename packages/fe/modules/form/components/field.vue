<script>
// ===================================================================== Imports
import { mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

// ====================================================================== Export
export default {
  name: 'Field',

  props: {
    scaffold: {
      type: Object,
      required: true
    },
    value: {
      type: [Object, String, Number, Boolean],
      required: false,
      default: false
    },
    formId: {
      type: String,
      required: true
    },
    groupId: {
      type: String,
      required: false,
      default: ''
    },
    forceDisableFields: {
      type: Boolean,
      required: false,
      default: false
    },
    deregisterFormFieldOnDestroy: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    const scaffold = this.scaffold
    const parentModelKey = scaffold.parent_model_key
    const id = `${this.formId}${this.groupId}${parentModelKey ? `|${parentModelKey}` : ''}|${scaffold.model_key}`
    return {
      id
    }
  },

  computed: {
    field () {
      const field = CloneDeep(this.$field(this.id))
      if (!field) { return false }
      field.disabled = this.forceDisableFields || field.disabled
      return field
    },
    type () {
      const type = this.field.type
      let component = false
      switch (type) {
        case 'input' : component = 'FieldInput'; break
        case 'textarea' : component = 'FieldTextarea'; break
        case 'range' : component = 'FieldRange'; break
        case 'checkbox' : component = 'FieldCheckbox'; break
        case 'select' : component = 'FieldSelect'; break
      }
      return component
    },
    description () {
      return this.field.description
    },
    validationMessage () {
      const message = this.field.validation_message
      if (!message) { return false }
      return message[this.field.validation]
    }
  },

  mounted () {
    const formId = this.formId
    const scaffold = this.scaffold
    const value = typeof this.value === 'boolean' && !this.value ? this.getDefaultValue(scaffold) : this.value
    this.registerFormField(Object.assign(CloneDeep(scaffold), {
      id: this.id,
      formId,
      value,
      originalValue: value,
      state: 'valid',
      validation: false
    }))
  },

  beforeDestroy () {
    if (this.deregisterFormFieldOnDestroy) {
      this.deregisterFormField(this.id)
    }
  },

  methods: {
    ...mapActions({
      registerFormField: 'form/registerFormField',
      deregisterFormField: 'form/deregisterFormField',
      updateFormField: 'form/updateFormField'
    }),
    getDefaultValue (scaffold) {
      const type = this.scaffold.type
      let value = ''
      switch (type) {
        case 'checkbox' : value = false; break
        case 'select' : value = -1; break
        default : value = ''; break
      }
      return value
    },
    updateValue (value) {
      const type = this.field.type
      const inputType = this.field.input_type
      let parsed = value
      if ((type === 'input' && inputType === 'number') || type === 'range') {
        parsed = value !== '' ? parseFloat(value) : null
      }
      const field = CloneDeep(this.field)
      field.value = parsed
      field.state = field.value !== field.originalValue ? 'caution' : 'valid'
      field.validation = false
      this.updateFormField(field)
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
