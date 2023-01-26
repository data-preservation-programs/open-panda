<template>
  <div :class="['field field-select', state, { empty, 'dropdown-open': dropdownOpen }]">

    <Select
      :options="options"
      :aria-labelledby="modelKey || fieldKey"
      :selected-option="value"
      handle-state="internally"
      @dropdownToggled="dropdownToggled"
      @optionSelected="optionSelected">

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
import Select from '@/modules/form/components/select'

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
    scaffold () {
      return this.field.scaffold
    },
    modelKey () {
      return this.scaffold.modelKey
    },
    fieldKey () {
      return this.field.fieldKey
    },
    label () {
      return this.scaffold.label
    },
    options () {
      return this.scaffold.options
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
      transition: 150ms ease-in;
      transform: scale(1.2);
    }
  }
  &.dropdown-open {
    .icon-container {
      transition: 150ms ease-in;
      transform: rotate(-180deg);
    }
  }
  &.caution {
    ::v-deep .select {
      border-color: darkorange;
    }
  }
  &.error {
    ::v-deep .select {
      border-color: red;
    }
  }
}

::v-deep .select-container {
  &:not(.focused) {
    .select.native {
      color: transparent;
    }
  }
  &.dropdown-open {
    .select {
      border-bottom-color: transparent;
    }
  }
  .select {
    // border-bottom: 0.1875rem solid tomato;
    // transition: 150ms ease-out;
    &.native {
      &:focus-visible {
        @include focusBoxShadow;
      }
    }
  }
  .dropdown {
    top: calc(100% - 4px);
    border-bottom-left-radius: 0.3125rem;
    border-bottom-right-radius: 0.3125rem;
    max-height: $height * 6.5;
    border-right: 2px solid $tasman;
    border-bottom: 2px solid $tasman;
    border-left: 2px solid $tasman;
    background-color: $gin;
  }
}

.label {
  z-index: 10;
}

.selection-window {
  padding: toRem(8) toRem(5) toRem(8) toRem(10);
  border: 2px solid $tasman;
  border-radius: toRem(5);
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
    margin-left: auto;
    transition: 150ms ease-out;
  }
  .icon-chevron-down {
    width: 0.6875rem;
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
    background-color: $grayNurse2;
  }
  &.selected {
    background-color: $rangoonGreen;
    color: white;
  }
}
</style>
