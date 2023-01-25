<template>
  <div :class="['field field-radio', state]">

    <div
      v-for="(option, index) in options"
      :key="index"
      class="radio-wrapper">

      <div class="radio-container">
        <input
          :id="`radio-${id}-${index}`"
          :checked="value === index"
          :name="`radio-${id}`"
          type="radio"
          class="radio"
          @input="$emit('updateValue', index)" />
        <div class="checker">
          <IconCheckmark />
        </div>
      </div>

      <label :for="`radio-${id}-${index}`" class="label">
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
  name: 'FieldRadio',

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
  }
}
</script>

<style lang="scss" scoped>
$dimension: 1.625rem;

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
.field-radio {
  display: flex;
  flex-direction: row;
  align-items: center;
  &.caution {
    .radio {
      &:checked {
        + .checker {
          border-color: darkorange;
        }
      }
    }
  }
  &.error {
    .radio {
      + .checker {
        border-color: red;
      }
    }
  }
}

.radio-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  &:hover {
    .checker {
      transition: 150ms ease-in;
      transform: scale(1.1);
    }
  }
  &:not(:last-child) {
    margin-right: 2.125rem;
  }
}

.radio-container {
  position: relative;
}

.radio {
  display: flex;
  position: relative;
  width: $dimension;
  height: $dimension;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
  &:checked {
    + .checker {
      animation: shrink-bounce 150ms cubic-bezier(0.4, 0, 0.23, 1);
      border-color: tomato;
      background-color: teal;
      .icon-checkmark {
        animation: checkbox-check 75ms 200ms cubic-bezier(0.4, 0, 0.23, 1) forwards;
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
  border: 2px solid tomato;
  border-radius: 0.625rem;
  background-color: teal;
  pointer-events: none;
  z-index: 5;
  transition: border-color 150ms, background-color 150ms, transform 150ms ease-out;
}

.icon-checkmark {
  display: block;
  width: 0.875rem;
  opacity: 0;
}

.label {
  font-weight: 400;
  cursor: pointer;
  padding-left: 1rem;
}
</style>
