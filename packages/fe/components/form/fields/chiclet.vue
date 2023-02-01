<template>
  <div :class="['field field-chiclet', state, { focused, empty }]">

    <label v-if="label" :for="fieldKey" class="label floating">
      <span class="text">{{ label }}</span>
      <sup v-if="required" class="required">*</sup>
    </label>

    <div v-if="disabled" :class="['input', { disabled }]">
      {{ value }}
    </div>

    <div v-if="!disabled" class="input-container">
      <input
        :id="fieldKey"
        v-model="inputValue"
        type="text"
        :name="fieldKey"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :autocomplete="autocomplete"
        :class="['input', state]"
        @focus="focusHandler"
        @blur="focused = false"
        @keydown="handleKeyboardNavigation" />
      <div v-if="typeof chars === 'number'" class="char-validation">
        {{ chars }}
      </div>
    </div>

    <div class="chiclet-list">
      <ButtonToggle
        v-if="!disabled && chiclets.length > 0"
        format="mini"
        class="clear-all-button"
        @clicked="clearAllChiclets">
        <IconClose />
        <span>Clear All</span>
      </ButtonToggle>
      <ButtonToggle
        v-for="chiclet in chiclets"
        :key="chiclet"
        :disabled="disabled"
        format="mini"
        class="chiclet"
        @clicked="removeChiclet(chiclet)">
        <IconClose />
        <span>{{ chiclet }}</span>
      </ButtonToggle>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import ButtonToggle from '@/components/buttons/button-toggle'

import IconClose from '@/components/icons/close-thick'

// =================================================================== Functions
const preValidate = (value, pre) => {
  if (typeof pre !== 'string') { return value }
  const regex = new RegExp(pre)
  // check if value contains restricted characters and parse them out
  return regex.test(value) ? value.replace(regex, '') : value
}

// ====================================================================== Export
export default {
  name: 'FieldInput',

  components: {
    ButtonToggle,
    IconClose
  },

  props: {
    field: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      inputValue: '',
      focused: false,
      dropdownOpen: false
    }
  },

  computed: {
    scaffold () {
      return this.field.scaffold
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
    chiclets () {
      return this.field.value
    },
    min () {
      return this.scaffold.min
    },
    max () {
      return this.scaffold.max
    },
    empty () {
      const value = this.inputValue
      return value === undefined || value === '' || !this.disabled
    },
    state () {
      return this.field.state
    }
  },

  methods: {
    focusHandler () {
      this.focused = true
    },
    clearAllChiclets () {
      this.$emit('updateValue', [])
    },
    removeChiclet (incoming) {
      const chiclets = this.chiclets.slice()
      const index = chiclets.findIndex(chiclet => chiclet === incoming)
      chiclets.splice(index, 1)
      this.$emit('updateValue', chiclets)
    },
    handleKeyboardNavigation (e) {
      const keyCode = e.keyCode
      const code = e.keyCode
      const key = e.key
      const enter = keyCode === 13 || code === 13 || key === 'Enter'
      if (enter) {
        this.submitChiclets()
      }
    },
    submitChiclets () {
      const chiclets = this.chiclets
      const inputValue = this.inputValue.split(',')
      if (inputValue === '') { return }
      const compiled = []
      inputValue.forEach((input) => {
        const processed = preValidate(input.trim(), this.pre)
        if (processed !== '' && !chiclets.includes(processed)) {
          compiled.push(processed)
        }
      })
      this.$emit('updateValue', chiclets.concat(compiled))
      this.inputValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 2.5rem;

// ///////////////////////////////////////////////////////////////////// General
.input-container,
.input {
  height: $height;
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
    border-bottom: 0;
    margin-bottom: -1rem;
  }
}

// //////////////////////////////////////////////////////////////////// Chiclets
.chiclet-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.clear-all-button {
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  &.format__mini {
    padding: 0.125rem 0.5rem;
  }
}

:deep(.chiclet) {
  margin-bottom: 0.5rem;
  &:not([disabled]) {
    &:hover {
      .svg-icon path {
        transition: 150ms ease-in;
        fill: teal;
      }
    }
  }
  &:not(:last-child) {
    margin-right: 0.5rem;
  }
}

:deep(.button) {
  .svg-icon {
    width: 8px;
    margin-right: 0.25rem;
    path {
      transition: 150ms ease-out;
      fill: tomato;
    }
  }
}
</style>
