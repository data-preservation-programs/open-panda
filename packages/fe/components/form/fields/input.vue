<template>
  <div :class="['field field-input', state, { focused, empty, predictive, 'dropdown-open': dropdownOpen }]">

    <div v-if="disabled" :class="['input', { disabled }]">
      {{ value }}
    </div>

    <div v-else class="input-container">
      <input
        :id="fieldKey"
        v-click-outside="closeDropdown"
        :type="inputType"
        :name="fieldKey"
        :placeholder="placeholder"
        :value="value"
        :min="min"
        :max="max"
        :autocomplete="autocomplete"
        :class="['input', state]"
        @focus="focusHandler"
        @blur="focused = false"
        @input="$emit('updateValue', $event.target.value)" />
      <div v-if="typeof chars === 'number'" class="char-validation">
        {{ chars }}
      </div>
    </div>

    <div
      v-if="predictive && predictiveOptions"
      :class="['dropdown', { open: dropdownOpen }]">
      <div v-if="predictiveFiltered" class="options-container">
        <button
          v-for="(option, index) in predictiveFiltered"
          :key="index"
          :class="['option', { selected: selected(option) }]"
          @click="selectOption(option)">
          {{ option[predictiveDisplayKey] }}
        </button>
      </div>
      <div v-else class="none-found-placeholder">
        No items found
      </div>
    </div>

  </div>
</template>

<script>
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
  name: 'FieldInput',

  props: {
    field: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      focused: false,
      dropdownOpen: false
    }
  },

  computed: {
    scaffold () {
      return this.field.scaffold
    },
    inputType () {
      return this.scaffold.inputType || 'text'
    },
    fieldKey () {
      return this.field.fieldKey
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
    originalValue () {
      return this.field.originalValue
    },
    min () {
      return this.scaffold.min
    },
    max () {
      return this.scaffold.max
    },
    empty () {
      const value = this.value
      return !value || value === ''
    },
    state () {
      return this.field.state
    },
    predictive () {
      return this.scaffold.predictive
    },
    predictiveOptions () {
      return this.scaffold.predictiveOptions
    },
    predictiveDisplayKey () {
      return this.scaffold.predictiveOptions.display_key
    },
    predictiveOptionsList () {
      return this.scaffold.predictiveOptions.options
    },
    predictiveFiltered () {
      const filterValue = this.value.toLowerCase()
      const key = this.predictiveDisplayKey
      const filtered = this.predictiveOptionsList.filter((obj) => {
        const value = obj[key] ? obj[key].toLowerCase() : ''
        if (value.includes(filterValue)) { return obj }
        return false
      })
      if (filtered.length === 0) { return false }
      return filtered
    }
  },

  watch: {
    value (value) {
      preValidate(this, value, this.pre)
    }
  },

  methods: {
    focusHandler () {
      this.focused = true
      this.openDropdown()
    },
    openDropdown () {
      this.dropdownOpen = true
    },
    closeDropdown () {
      this.dropdownOpen = false
    },
    selected (option) {
      return option[this.predictiveDisplayKey] === this.value
    },
    selectOption (option) {
      this.$emit('updateValue', option[this.predictiveDisplayKey])
      this.closeDropdown()
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 2.5rem;

// ///////////////////////////////////////////////////////////////////// General
.field-input {
  height: $height;
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

// ///////////////////////////////////////////////////////// Predictive Dropdown
.dropdown {
  @include shadow1;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: $height * 5.5;
  background-color: teal;
  border-radius: 0 0 0.5rem 0.5rem;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  overflow: hidden;
  z-index: -1;
  &.open {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
    overflow-y: scroll;
    z-index: 100;
  }
}

.options-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  z-index: 5;
}

.option {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: $height;
  padding: 0 0.875rem;
  color: inherit;
  &:hover {
    background-color: teal;
    color: darkorange;
  }
  &.selected {
    background-color: teal;
    color: darkorange;
  }
}

.none-found-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: $height * 2;
  padding: 2rem;
}
</style>
