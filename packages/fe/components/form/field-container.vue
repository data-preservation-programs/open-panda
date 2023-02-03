<template>
  <div class="field-container">
    <FieldStandalone v-bind="$props">
      <div slot-scope="{ updateValue, field, type, validationMessage }" :class="`field-wrapper field-wrapper-${scaffold.type}`">
        <template v-if="field">

          <label v-if="scaffold.label" :for="fieldKey" class="field-label">
            {{ scaffold.label }}
          </label>

          <div v-if="scaffold.description" class="description">
            {{ scaffold.description }}
          </div>

          <component
            :is="type"
            :field="field"
            :field-key="fieldKey"
            @updateValue="pushValue($event, updateValue)"
            v-on="$listeners" />

          <slot />

          <div v-if="validationMessage" class="validation-message">
            {{ validationMessage }}
          </div>

        </template>
      </div>
    </FieldStandalone>
  </div>
</template>

<script>
// ===================================================================== Imports
import FieldStandalone from '@/modules/form/components/field-standalone'
import FieldInput from '@/components/form/fields/input'
import FieldTextarea from '@/components/form/fields/textarea'
import FieldRange from '@/components/form/fields/range'
import FieldCheckbox from '@/components/form/fields/checkbox'
import FieldRadio from '@/components/form/fields/radio'
import FieldSelect from '@/components/form/fields/select'
import FieldTypeahead from '@/components/form/fields/typeahead'
import FieldChiclet from '@/components/form/fields/chiclet'

// ====================================================================== Export
export default {
  name: 'FieldContainer',

  components: {
    FieldStandalone,
    FieldInput,
    FieldTextarea,
    FieldRange,
    FieldCheckbox,
    FieldRadio,
    FieldSelect,
    FieldTypeahead,
    FieldChiclet
  },

  /**
   * props:
   *
   * @updateValue - triggers when field has changed
   * :resetGroupId - if this prop matches ID passed to 'resetFormFields' global bus event, then reset the field value
   */
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
    forceDisableFields: {
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

  methods: {
    pushValue (value, updateValue) {
      updateValue(value)
      this.$emit('updateValue', value)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
::v-deep .field {
  position: relative;
  font-weight: 500;
  &.focused,
  &:not(.empty) {
    .label.floating,
    .required {
      transition: 150ms ease-in;
    }
    .label {
      &.floating {
        font-size: 0.75rem;
        transform: translateY(20%);
        .text {
          opacity: 0.5;
          transition: opacity 150ms ease-in;
        }
        .required {
          font-size: 1rem;
        }
      }
    }
  }
}

::v-deep .description {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-style: italic;
  opacity: 0.5;
}

// /////////////////////////////////////////////////////////////////////// Label
::v-deep .label {
  font-weight: 400;
  cursor: pointer;
  &.floating {
    position: absolute;
    bottom: 100%;
    left: 0;
    pointer-events: none;
    cursor: text;
    transform: translateY(120%);
    transition: 150ms ease-out;
    .text {
      transition: opacity 150ms ease-out;
    }
  }
  .required {
    top: -0.0625rem;
    font-size: 1.25rem;
    line-height: 1;
    color: $rangoonGreen;
    transition: 150ms ease-out;
  }
  a {
    color: darkorange;
    &:hover {
      text-decoration: underline;
    }
  }
}

// ////////////////////////////////////////////////////////////////// Validation
::v-deep .validation-message {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: $rangoonGreen;
  sup {
    top: -0.125rem;
    margin-right: 0.0625rem;
    font-size: 100%;
  }
}

// custom
.field-wrapper-select {
  display: flex;
  align-items: center;
  .field-label {
    margin-right: toRem(24);
  }
}

.field-wrapper-checkbox {
  @include fontSize_14;
}
</style>
