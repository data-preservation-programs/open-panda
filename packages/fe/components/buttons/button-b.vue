<template>
  <Button
    v-bind="$props"
    :class="['button-b', `format__${format}`, `theme__${theme}`]"
    v-on="$listeners">
    <div slot-scope="{ loading }" class="inner-content">

      <LoaderTripleDot :class="{ show: loadingForced || loading }" />

      <div :class="['button-content', { hide: loadingForced || loading }]">
        <slot />
      </div>

    </div>
  </Button>
</template>

<script>
// ===================================================================== Imports
import Button from '@/modules/button/components/button'
import LoaderTripleDot from '@/components/spinners/triple-dot'

// ====================================================================== Export
export default {
  name: 'ButtonB',

  components: {
    Button,
    LoaderTripleDot
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
    loader: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    loadingForced: { // overrides 'loader' prop
      type: Boolean,
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
    format: { // 'regular', 'mini', 'tiny'
      type: String,
      required: false,
      default: 'regular'
    },
    theme: { // 'bone', 'picklewoodblue'
      type: String,
      required: false,
      default: 'bone'
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.button {
  position: relative;
  padding: 0.25rem 1rem;
  border: 1px solid $rangoonGreen;
  border-radius: 2rem;
  white-space: nowrap;
  cursor: pointer;
  &:not([disabled]) {
    &:hover,
    &.selected {
      background-color: $rangoonGreen;
      color: red;
    }
    &:focus-visible {
      @include focusBoxShadow;
    }
  }
  &[disabled] {
    box-shadow: none;
    cursor: no-drop;
    opacity: 0.5;
  }
  &.selected {
    background-color: $rangoonGreen;
    color: red;
  }
}

.triple-dot-loader,
.button-content {
  width: 100%;
  height: 100%;
}

::v-deep .triple-dot-loader {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  &.show {
    opacity: 1;
  }
  .dot {
    transition: background-color 150 ease-in-out;
  }
}

.button-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  &.hide {
    opacity: 0;
  }
}

// ///////////////////////////////////////////////////////////////////// Formats
.format__mini {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  ::v-deep .triple-dot-loader {
    padding: 0 0.3125rem;
    .dot {
      width: 0.5rem;
      height: 0.5rem;
    }
  }
}

.format__tiny {
  font-size: 0.625rem;
  padding: 0.0625rem 0.375rem;
}

// ////////////////////////////////////////////////////////////////////// Themes
.theme__picklewoodblue {
  border-color: blue;
  &:not([disabled]) {
    &:hover,
    &.selected {
      background-color: blue;
      color: $rangoonGreen;
    }
    &:focus-visible {
      @include focusBoxShadow;
    }
  }
  &[disabled] {
    box-shadow: none;
    cursor: no-drop;
    opacity: 0.5;
  }
  &.selected {
    background-color: blue;
    color: $rangoonGreen;
  }
}
</style>
