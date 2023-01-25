<template>
  <div :class="['field field-checkbox', state]">

    <div
      v-for="(option, index) in options"
      :key="index"
      class="checkbox-wrapper">

      <div class="checkbox-container">
        <input
          :id="`checkbox-${id}-${index}`"
          :checked="value === index"
          :name="`checkbox-${id}`"
          type="checkbox"
          class="checkbox"
          @input="updateValue(index)" />
        <div class="checker">
          <IconCheckmark />
        </div>
      </div>

      <label :for="`checkbox-${id}-${index}`" class="label">
        {{ option.label }}
      </label>

    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import IconCheckmark from '@/components/icons/checkmark'

// ====================================================================== Export
export default {
  name: 'FieldCheckbox',

  components: {
    IconCheckmark
  },

  props: {
    field: {
      type: Object,
      required: true
    }
  },

  computed: {
    scaffold () {
      return this.field.scaffold
    },
    state () {
      return this.field.state
    },
    id () {
      return this.field.id
    },
    value () {
      return this.field.value
    },
    options () {
      return this.scaffold.options
    },
    label () {
      return this.scaffold.label
    },
    required () {
      return this.scaffold.required
    }
  },

  methods: {
    updateValue (index) {
      let value = index
      if (this.value === index) { value = -1 }
      this.$emit('updateValue', value)
    }
  }
}
</script>

<style lang="scss" scoped>
$dimension: toRem(20);

$borderColor: #CCCCCC;
$focusBorderColor: black;

@if variable-exists(formBorderColor) { $borderColor: $formBorderColor; }
@if variable-exists(formBorderColorFocus) { $focusBorderColor: $formBorderColorFocus; }

@keyframes shrink-bounce {
  0% { transform: scale(1); }
  33% { transform: scale(0.85); }
  100% { transform: scale(1); }
}

@keyframes checkbox-check {
  0% {
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

// ///////////////////////////////////////////////////////////////////// General
.field-checkbox {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.checkbox-container {
  position: relative;
  margin-right: toRem(13);
}

.checkbox {
  display: flex;
  position: relative;
  width: $dimension;
  height: $dimension;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
  &:checked {
    + .checker {
      animation: shrink-bounce 200ms cubic-bezier(0.4, 0, 0.23, 1);
      border-color: $tasman;
      .icon-checkmark {
        animation: checkbox-check 125ms 250ms cubic-bezier(0.4, 0, 0.23, 1) forwards;
      }
    }
  }
  &:focus-visible {
    + .checker {
      @include focusBoxShadow;
    }
  }
}

.checker {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: $dimension;
  height: $dimension;
  border: 2px solid $tasman;
  border-radius: 0.125rem;
  pointer-events: none;
  z-index: 5;
  transition: border-color 250ms, background-color 250ms;
}

.icon-checkmark {
  display: block;
  width: 0.875rem;
  opacity: 0;
}
</style>
