<template>
  <div
    :class="[
      'field field-typeahead',
      state, {
        focused,
        empty,
        'dropdown-open': dropdownOpen,
        'first-option-highlighted': firstOptionHighlighted,
        'no-results': noOptionsMatchSearch
      }]">

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
        @keydown="$emit('handleKeydown', $event)"
        @focus="focusAndClickHandler"
        @click="focusAndClickHandler"
        @blur="focused = false"
        @input="$emit('updateValue', $event.target.value)"
        v-on="$listeners" />
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
      @optionSelected="optionSelected"
      @optionHighlighted="optionHighlighted">

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
/**
 * Here's an example of a typeahead data structure
 *
 * "country": {
 *   "type": "typeahead",
 *   "inputType": "text",
 *   "modelKey": "country",
 *   "label": "Country",
 *   "placeholder": "Country",
 *   "description": "Where are you located?",
 *   "required": true,
 *   "autocomplete": "off",
 *   "pre": "[^\\u0000-\\u00ff]",
 *   "validationMessage": {
 *     "required": "This field is required"
 *   },
 *   "optionDisplayKey": "name",
 *   "optionReturnKey": "code",
 *   "options": [{"name":"Afghanistan","code":"AF"},{"name":"Åland Islands","code":"AX"}]
 * }
 *
 * Note the optionDisplayKey and optionReturnKey.
 * You can pass in any data structure (array of objects) as options and then use
 * optionDisplayKey to define which key in that data structure to match your
 * input text to. Then when an item in the dropdown is clicked, it uses the
 * optionReturnKey to to return the value you want. So for a dataset structure like this:
 *
 * {
 *  "name": "Foo", ← "optionDisplayKey": "name"
 *  "slug": "bar" ← "optionReturnKey": "slug"
 * }
 */

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
      selectedOption: -1,
      noOptionsMatchSearch: false
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
    },
    firstOptionHighlighted () {
      return this.highlightedOption === 0
    }
  },

  watch: {
    value (value) {
      preValidate(this, value, this.pre)
      this.checkIfNoResultsMatchSearch()
    }
  },

  mounted () {
    this.dropdown = this.$refs.dropdown
  },

  methods: {
    focusAndClickHandler () {
      if (!this.dropdownOpen) {
        this.focused = true
        this.openDropdown()
      }
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
    optionHighlighted (index) {
      this.highlightedOption = index
    },
    optionSelected (index) {
      if (index !== -1) {
        this.selectedOption = index
        this.$emit('optionSelected', this.options[index][this.optionReturnKey])
        this.$emit('updateValue', this.options[index][this.optionReturnKey])
      }
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
    },
    checkIfNoResultsMatchSearch () {
      const options = this.options
      const len = options.length
      let noOptionsMatch = true
      for (let i = 0; i < len; i++) {
        if (this.optionIncludedInSearch(options[i])) {
          noOptionsMatch = false
        }
      }
      this.noOptionsMatchSearch = noOptionsMatch
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 3.125rem;

// ///////////////////////////////////////////////////////////////////// General
.field-typeahead {
  height: $height;
  display: flex;
  align-items: center;
  &.dropdown-open {
    &.no-results {
      :deep(div.select-container) {
        display: none;
        &:before {
          display: none;
        }
      }
    }
    :deep(div.select-container) {
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
  width: 100%;
  height: 100%;
}

.input {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  appearance: none;
  transition: 150ms ease-in-out;
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
  &:focus {
    box-shadow: none;
  }
}

// //////////////////////////////////////////////////////////////////// Dropdown
:deep(div.select-container) {
  display: none;
  position: absolute;
  top: 120%;
  left: -20px;
  width: 200%;
  z-index: 5;
  &:before {
    content: '';
    position: absolute;
    width: 104px;
    height: 11px;
    top: 0;
    left: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='104px' height='11.5px' viewBox='0 0 104 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 104 9 H 104 C 103 9 103 9 101.815 8.8108 L 88.368 0.3095 C 88.048 0.1073 87.678 0 87.299 0 H 9 C 4.0294 0 0 4.0294 0 9 V 9 Z' fill='white' /%3E%3C/svg%3E");
    z-index: 100;
  }
}

:deep(select.select) {
  &.native {
    height: 0;
  }
}

:deep(div.dropdown) {
  @include shadow1;
  top: 10px;
  max-height: $height * 5.5;
  background-color: white;
  border-top-right-radius: 0.625rem;
  border-bottom-right-radius: 0.625rem;
  border-bottom-left-radius: 0.625rem;
}

:deep(div.selection-window-wrapper) {
  display: none;
}

.label {
  z-index: 10;
}

:deep(div.selection-window) {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  transition: 150ms ease-out;
}

:deep(div.option) {
  padding: 0.5rem 0.75rem;
  transition: 150ms ease-out;
  &.highlighted {
    transition: 150ms ease-in;
    background-color: $grayNurse2;
  }
  &:not(.display) {
    display: none;
  }
  span {
    font-weight: 700;
    text-decoration: underline;
  }
}
</style>
