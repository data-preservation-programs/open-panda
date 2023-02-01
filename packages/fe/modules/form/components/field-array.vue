<template>
  <FieldStandalone
    v-bind="$props"
    @fieldRegistered="recordFieldId">
    <div slot-scope="{ field }" class="field-wrapper">
      <template v-if="field">

        <slot
          name="array"
          :field="field"
          :add-group="addGroup"
          :remove-group="removeGroup" />

      </template>
    </div>
  </FieldStandalone>
</template>

<script>
// ===================================================================== Imports
import CloneDeep from 'lodash/cloneDeep'

import FieldStandalone from '@/modules/form/components/field-standalone'

// ====================================================================== Export
export default {
  name: 'FieldArray',

  components: {
    FieldStandalone
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
    resetGroupId: {
      type: String,
      required: false,
      default: ''
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
    return {
      id: null
    }
  },

  computed: {
    /**
     * This is the same as the field that gets returned in the slot-scope in the
     * template. I was forced to rename this computed property because the name
     * "field" was already taken by the slot-scope.
     */
    fieldStandalone () {
      return this.$field(this.id).get()
    }
  },

  methods: {
    recordFieldId (id) {
      this.id = id
    },
    addGroup () {
      this.$field(this.id).updateValue(
        // Add empty group to the end of the value array
        this.fieldStandalone.value.concat([
          /**
           * Generate an empty group (not strictly necessary, could push any object
           * into the array, but nice for consistecy when reading console output
           * and to match data as saved/returned to/from database). groupId key
           * must be included though.
           */
          this.scaffold.template.reduce((acc, template) => {
            acc[template.key] = null
            acc.groupId = this.$uuid.v4()
            return acc
          }, {})
        ])
      )
    },
    removeGroup (index, formId) {
      const value = CloneDeep(this.fieldStandalone.value)
      value.splice(index, 1)
      this.$field(this.id).updateValue(value)
    }
  }
}
</script>
