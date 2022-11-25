<template>
  <div :class="['field field-select', state, { empty, 'dropdown-open': dropdownOpen }]">

    <span v-if="label" :for="modelKey" class="label floating">
      <span class="text">{{ label }}</span>
      <sup v-if="required" class="required">*</sup>
    </span>

    <Select
      :options="options"
      :aria-labelledby="modelKey"
      :selected-option="value"
      handle-state="internally"
      @dropdownToggled="dropdownToggled"
      @optionSelected="optionSelected">

      <template #option-native-default-text>
        {{ label }}{{ required ? ', this is a required field' : '' }}
      </template>

      <template #option-native-text="{ option }">
        {{ getOptionDescription(option) ? `${option.label}, ${getOptionDescription(option)}` : option.label }}
      </template>

      <template #selection-window="{ selected }">
        <div class="selection-window">
          <div v-if="!empty" class="text">
            {{ getSelectedOptionLabel(selected) }}
          </div>
          <div class="icon-container">
            <IconChevronDown />
          </div>
        </div>
      </template>

      <template #option-custom="{ option, highlighted, selected }">
        <div :class="['option', { highlighted, selected }]">
          <div class="label">
            {{ option.label }}
          </div>
          <div v-if="getOptionDescription(option)" class="description">
            {{ getOptionDescription(option) }}
          </div>
        </div>
      </template>

    </Select>

  </div>
</template>

<script>
// ===================================================================== Imports
import Select from '@/components/select'

import IconChevronDown from '@/components/icons/chevron-down'

// ====================================================================== Export
export default {
  name: 'FieldSelect',

  components: {
    Select,
    IconChevronDown
  },

  props: {
    field: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      dropdownOpen: false,
      selectedOption: false
    }
  },

  computed: {
    modelKey () {
      return this.field.model_key
    },
    label () {
      return this.field.label
    },
    options () {
      return this.field.options
    },
    value () {
      return this.field.value
    },
    required () {
      return this.field.required
    },
    state () {
      return this.field.state
    },
    empty () {
      return this.selectedOption === -1
    }
  },

  methods: {
    getOptionDescription (option) {
      if (option && option.description !== '') { return option.description }
      return false
    },
    getSelectedOptionLabel (selection) {
      if (selection === -1) { return this.label }
      return this.options[selection].label
    },
    dropdownToggled (state) {
      this.dropdownOpen = state
    },
    optionSelected (value) {
      this.selectedOption = value
      this.$emit('updateValue', value)
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 2.5rem;

// ///////////////////////////////////////////////////////////////////// General
.field-select {
  height: $height;
  &:hover {
    .icon-container {
      &:before {
        transition: 150ms ease-in;
        border-color: tomato;
      }
    }
  }
  &.dropdown-open {
    &.empty > .label {
      padding-left: 0.75rem;
    }
    .icon-container {
      &:before {
        transform: scale(0.8);
        border-color: rgba(227, 211, 192, 0.25);
      }
    }
    .icon-chevron-down {
      transition: 150ms ease-in;
      transform: rotate(-180deg);
    }
  }
  &.caution {
    ::v-deep .select {
      border-color: $pizazz;
    }
  }
  &.error {
    ::v-deep .select {
      border-color: $redOrange;
    }
  }
}

::v-deep .select-container {
  .select {
    border-bottom: 0.1875rem solid tomato;
    transition: 150ms ease-out;
    &.native {
      border-radius: 0.25rem;
      &:focus-visible {
        @include focusBoxShadow;
      }
    }
    &.custom {
      background-color: teal;
    }
  }
  .dropdown {
    max-height: $height * 5.5;
    background-color: blue;
  }
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
  .text {
    flex: 1;
    padding-right: 0.25rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .icon-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 1.75rem;
    height: 1.75rem;
    margin-left: auto;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0.125rem solid transparent;
      border-radius: 0.3125rem;
      box-sizing: border-box;
      transition: 150ms ease-out;
    }
  }
  .icon-chevron-down {
    width: 0.5rem;
    transition: 150ms ease-out;
  }
}

.option {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: 150ms ease-out;
  &:hover,
  &.highlighted {
    transition: 150ms ease-in;
    background-color: teal;
  }
  &.selected {
    .label {
      text-decoration: underline;
    }
  }
  .description {
    margin-top: -0.25rem;
    font-size: 0.875rem;
    font-weight: 400;
    opacity: 0.4;
  }
}
</style>
