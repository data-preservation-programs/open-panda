<template>
  <div :class="['field field-textarea', state, { focused, empty }]">

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
    scaffold () {
      return this.field.scaffold
    },
    name () {
      return this.scaffold.name
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
  &.focused {
    .textarea {
      border-color: white;
    }
  }
  &:not(.empty) {

  }
}

.textarea-container,
.textarea {
  height: 100%;
}

.textarea {
  width: 100%;
  padding: 1.5rem;
  border: 2px solid white;
  border-radius: 0.625rem;
  transition: 150ms ease-in-out;
  @include placeholder {
    color: rgba(white, 0.7);
    font-size: toRem(18);
    font-weight: 400;
    font-style: italic;
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
