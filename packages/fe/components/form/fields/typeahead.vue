<template>
  <div :class="['field field-typeahead', state, { focused, empty, 'dropdown-open': dropdownOpen }]">

    <label v-if="label" :for="fieldKey" class="label floating">
      <span class="text">{{ label }}</span>
      <sup v-if="required" class="required">*</sup>
    </label>

    <div v-if="disabled" :class="['input', { disabled }]">
      {{ value }}
    </div>

    <div v-else class="input-container">
      <input
        :id="fieldKey"
        v-click-outside="closeDropdown"
        type="input"
        :name="fieldKey"
        :placeholder="placeholder"
        :value="value"
        :autocomplete="autocomplete"
        :class="['input', state]"
        @focus="focusHandler"
        @blur="focused = false"
        @input="$emit('updateValue', $event.target.value)" />
      <div v-if="typeof chars === 'number'" class="char-validation">
        {{ chars }}
      </div>
    </div>

    <Select
      ref="dropdown"
      :options="options"
      :aria-labelledby="modelKey || fieldKey"
      :selected-option="selectedOption"
      :handle-click-outside="false"
      @dropdownToggled="dropdownToggled"
      @optionSelected="optionSelected">

      <template #option-native-text="{ option }">
        {{ option[optionDisplayKey] }}
      </template>

      <template #option-custom="{ option, highlighted, selected }">
        <div
          :class="['option', { highlighted, selected, display: optionIncludedInSearch(option) }]"
          v-html="highlightText(option)" />
      </template>

    </Select>

  </div>
</template>

<script>
// ===================================================================== Imports
import Select from '@/modules/form/components/select'

// =================================================================== Functions
const preValidate = (instance, value, pre) => {
  if (typeof pre !== 'string') { return }
  const regex = new RegExp(pre)
  if (regex.test(value)) { // value contains restricted characters
    const stripped = value.replace(regex, '')
    instance.$emit('updateValue', stripped)
  }
}

// ====================================================================== Export
export default {
  name: 'FieldTypeahead',

  components: {
    Select
  },

  props: {
    field: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      focused: false,
      dropdownOpen: false,
      selectedOption: -1
    }
  },

  computed: {
    scaffold () {
      return this.field.scaffold
    },
    fieldKey () {
      return this.field.fieldKey
    },
    modelKey () {
      return this.scaffold.modelKey
    },
    label () {
      return this.scaffold.label
    },
    placeholder () {
      return this.scaffold.placeholder || 'Enter a value...'
    },
    autocomplete () {
      return this.scaffold.autocomplete
    },
    required () {
      return this.scaffold.required
    },
    disabled () {
      return this.scaffold.disabled
    },
    pre () {
      return this.scaffold.pre
    },
    chars () {
      return this.scaffold.chars
    },
    validationMessage () {
      return this.scaffold.validationMessage
    },
    value () {
      return this.field.value
    },
    valueMatchRegExp () {
      return new RegExp(`(${this.value})`, 'ig')
    },
    empty () {
      const value = this.value
      return value === undefined || value === ''
    },
    state () {
      return this.field.state
    },
    options () {
      return this.scaffold.options
    },
    optionDisplayKey () {
      return this.scaffold.optionDisplayKey
    },
    optionReturnKey () {
      return this.scaffold.optionReturnKey
    }
  },

  watch: {
    value (value) {
      preValidate(this, value, this.pre)
    }
  },

  mounted () {
    this.dropdown = this.$refs.dropdown
  },

  methods: {
    focusHandler () {
      this.focused = true
      this.openDropdown()
    },
    dropdownToggled (state) {
      this.dropdownOpen = state
    },
    openDropdown () {
      this.dropdown.openDropdown()
    },
    closeDropdown () {
      this.dropdown.closeDropdown()
    },
    optionSelected (index) {
      this.selectedOption = index
      this.$emit('updateValue', this.options[index][this.optionReturnKey])
    },
    optionIncludedInSearch (option) {
      const value = option[this.optionDisplayKey]
      return value.toLowerCase().includes(this.value.toLowerCase())
    },
    highlightText (option) {
      const inputValue = this.value
      const optionValue = option[this.optionDisplayKey]
      if (inputValue === '') { return optionValue }
      return optionValue.replace(this.valueMatchRegExp, '<span class="highlight">$1</span>')
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 2.5rem;

// ///////////////////////////////////////////////////////////////////// General
.field-typeahead {
  height: $height;
  &.dropdown-open {
    .select-container {
      display: block;
    }
  }
}

.input-container {
  position: relative;
  z-index: 10;
}

.input-container,
.input {
  height: 100%;
}

.input {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-bottom: 2px solid tomato;
  appearance: none;
  transition: 150ms ease-in-out;
  @include placeholder {
    opacity: 0;
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }
  &.caution {
    border-color: darkorange;
  }
  &.error {
    border-color: red;
  }
  &.disabled {
    cursor: no-drop;
    border-bottom-color: rgba(227, 211, 192, 0.25);
  }
}

// //////////////////////////////////////////////////////////////////// Dropdown
.select-container {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 5;
}

:deep(.select) {
  &.native {
    height: 0;
    border-radius: 0.25rem;
    &:focus-visible {
      @include focusBoxShadow;
    }
  }
}

:deep(.dropdown) {
  @include shadow1;
  top: 0;
  max-height: $height * 5.5;
  background-color: teal;
  border-radius: 0 0 0.5rem 0.5rem;
}

:deep(.selection-window-wrapper) {
  display: none;
}

.label {
  z-index: 10;
}

.selection-window {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  transition: 150ms ease-out;
}

.option {
  padding: 0.5rem 0.75rem;
  transition: 150ms ease-out;
  &.highlighted {
    transition: 150ms ease-in;
    background-color: teal;
  }
  &:not(.display) {
    display: none;
  }
  :deep(span) {
    font-weight: 700;
    text-decoration: underline;
  }
}
</style>
