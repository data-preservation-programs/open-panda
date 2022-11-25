<template>
  <div class="field-container">
    <Field v-bind="$props">
      <div slot-scope="{ updateValue, field, type, validationMessage }">

        <component
          :is="type"
          :field="field"
          @updateValue="updateValue" />

        <div v-if="field.description" class="description">
          {{ field.description }}
        </div>

        <div v-if="validationMessage" class="validation-message">
          <sup>*</sup>{{ validationMessage }}
        </div>

      </div>
    </Field>
  </div>
</template>

<script>
// ===================================================================== Imports
import Field from '@/modules/form/components/field'
import FieldInput from '@/components/form/fields/input'
import FieldTextarea from '@/components/form/fields/textarea'
import FieldRange from '@/components/form/fields/range'
import FieldCheckbox from '@/components/form/fields/checkbox'
import FieldSelect from '@/components/form/fields/select'

// ====================================================================== Export
export default {
  name: 'FieldContainer',

  components: {
    Field,
    FieldInput,
    FieldTextarea,
    FieldRange,
    FieldCheckbox,
    FieldSelect
  },

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
  font-weight: 500;
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
    color: $redOrange;
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
  color: $redOrange;
  sup {
    top: -0.125rem;
    margin-right: 0.0625rem;
    font-size: 100%;
  }
}
</style>
