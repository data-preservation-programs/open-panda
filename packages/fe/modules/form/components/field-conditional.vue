<template>
  <div>

    <slot :display-field="displayField" />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'FieldConditional',

  props: {
    scaffold: {
      type: Object,
      required: true
    },
    parentField: {
      type: [Object, Boolean],
      required: true
    },
    idSuffix: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      displayField: true
    }
  },

  computed: {
    conditions () {
      const conditions = this.scaffold.conditions
      if (!conditions || conditions.length === 0) { return false }
      return conditions
    },
    conditionalFields () {
      const conditions = this.conditions
      return conditions ? conditions.map((condition) => {
        return this.$field(`${condition.fieldKey}|${this.idSuffix}`).get()
      }) : false
    }
  },

  watch: {
    conditionalFields (fields) {
      this.detectConditions(fields)
    }
  },

  created () {
    this.$nextTick(() => {
      this.detectConditions(this.conditionalFields)
    })
  },

  methods: {
    async detectConditions (fields) {
      const conditions = this.conditions
      const parentField = this.parentField
      if (conditions) {
        let displayField = true
        conditions.forEach((condition) => {
          fields.forEach((field) => {
            displayField = condition.value === field.value
          })
        })
        this.displayField = displayField
        if (parentField.includeInFormSubmission !== displayField) {
          await this.$field(parentField.id).update({
            includeInFormSubmission: displayField,
            validate: displayField
          })
        }
      }
    }
  }
}
</script>
