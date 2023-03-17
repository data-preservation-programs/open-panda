<template>
  <Button
    v-bind="$props"
    class="button-x"
    v-on="$listeners">
    <div class="button-content">

      <slot />

    </div>
  </Button>
</template>

<script>
// ===================================================================== Imports
import Button from '@/modules/button/components/button'

// ====================================================================== Export
export default {
  name: 'ButtonX',

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
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.button) {
  white-space: nowrap;
  cursor: pointer;
  &:not([disabled]) {
    &:focus-visible {
      @include focusBoxShadow;
    }
  }
  &[disabled] {
    box-shadow: none;
    opacity: 0.5;
    cursor: no-drop;
  }
}
</style>
