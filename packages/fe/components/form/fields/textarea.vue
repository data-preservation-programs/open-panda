<template>
  <div :class="['field field-textarea', state, { focused, empty }]">

    <label v-if="label" :for="name" class="label floating">
      <span class="text">{{ label }}</span>
      <sup v-if="required" class="required">*</sup>
    </label>

    <div v-if="disabled" :class="['textarea', { disabled }]">
      {{ value }}
    </div>

    <div v-else class="textarea-container">
      <textarea
        :value="value"
        :placeholder="placeholder"
        :class="['textarea', state]"
        @focus="focused = true"
        @blur="focused = false"
        @input="$emit('updateValue', $event.target.value)"></textarea>
      <div v-if="typeof chars === 'number'" class="char-validation">
        {{ chars }}
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
  name: 'FieldTextarea',

  props: {
    field: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      focused: false
    }
  },

  computed: {
    name () {
      return this.field.name
    },
    label () {
      return this.field.label
    },
    placeholder () {
      return this.field.placeholder || 'Enter a value...'
    },
    autocomplete () {
      return this.field.autocomplete
    },
    required () {
      return this.field.required
    },
    disabled () {
      return this.field.disabled
    },
    pre () {
      return this.field.pre
    },
    chars () {
      return this.field.chars
    },
    validationMessage () {
      return this.field.validation_message
    },
    value () {
      return this.field.value
    },
    originalValue () {
      return this.field.originalValue
    },
    state () {
      return this.field.state
    },
    empty () {
      return this.value === ''
    }
  },

  watch: {
    value (value) {
      preValidate(this, value, this.pre)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.field-textarea {
  height: 10rem;
  transition: 150ms ease-out;
  &.focused,
  &:not(.empty) {
    &:before {
      transition: 150ms ease-in;
      opacity: 0;
    }
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(227, 211, 192, 0.1), transparent 75%);
    z-index: -1;
    pointer-events: none;
    transition: 150ms ease-out;
  }
}

.textarea-container,
.textarea {
  height: 100%;
}

.textarea {
  width: 100%;
  padding-top: 0.5rem;
  border-bottom: 2px solid tomato;
  transition: 150ms ease-in-out;
  @include placeholder {
    opacity: 0;
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
    overflow-y: scroll;
  }
}
</style>
