<template>
  <Button
    v-bind="$props"
    class="button-x"
    v-on="$listeners">
    <div class="button-content">

      <span class="top-notch" />

      <span v-if="label" class="label">
        {{ label }}
      </span>

      <div v-if="tooltip" class="tooltip">
        {{ tooltip }}
      </div>

    </div>
  </Button>
</template>

<script>
// ===================================================================== Imports
import Button from '@/modules/button/components/button'

// ====================================================================== Export
export default {
  name: 'ButtonNav',

  components: {
    Button
  },

  props: {
    tag: { // button, 'a' or nuxt-link
      type: String,
      required: false,
      default: 'button'
    },
    to: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    target: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    selected: {
      type: Boolean,
      required: false,
      default: false
    },
    label: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    tooltip: {
      type: [String, Boolean],
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.button {
  display: inline-flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  justify-content: center;
  font-family: $font_Secondary;
  @include fontWeight_Bold;
  line-height: leading(30, 16);
  padding: toRem(2) 0.8vw toRem(5) 0.8vw;
  border: 2px solid transparent;
  border-top-right-radius: toRem(5);
  border-bottom-left-radius: toRem(5);
  border-bottom-right-radius: toRem(5);
  position: relative;
  cursor: pointer;
  &:hover {
    .tooltip {
      display: block;
    }
    .top-notch {
      transition: 250ms;
    }
  }
  &[disabled] .label {
    opacity: 0.7;
  }
  &:not([disabled]) {
    &:hover {
      border-color: white;
      .top-notch {
        opacity: 1;
      }
    }
  }
  &.selected {
    background-color: white;
    @include shadow1;
    .top-notch {
      opacity: 1;
      &:before {
        transition: 250ms;
        background-color: white;
      }
    }
  }
}

.top-notch {
  transition: 250ms;
  position: absolute;
  top: -0.6rem;
  left: -2px;
  overflow: hidden;
  height: toRem(10);
  width: 2.60rem;
  border-top-left-radius: toRem(5);
  border-left: 2px solid white;
  background-color: $gin;
  opacity: 0;
  &:before {
    content: '';
    border-top: 2px solid white;
    border-right: 4px solid white;
    left: toRem(-5);
    height: 100%;
    width: toRem(40);
    border-radius: 0 2px 0 0;
    transform: skew(60deg, 0deg);
    display: block;
    position: relative;
    transition: 250ms;
  }
}
</style>
