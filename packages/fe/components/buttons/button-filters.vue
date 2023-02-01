<template>
  <Button
    v-bind="$props"
    :class="['button-filters']"
    v-on="$listeners">
    <div slot-scope="{ loading }" class="inner-content">

      <LoaderTripleDot :class="{ show: loadingForced || loading }" />

      <div :class="['button-content', { hide: loadingForced || loading }]">
        <slot />
        <span v-if="selected">
          <IconClose class="close" />
        </span>
      </div>

    </div>
  </Button>
</template>

<script>
// ===================================================================== Imports
import Button from '@/modules/button/components/button'
import LoaderTripleDot from '@/components/spinners/triple-dot'
import IconClose from '@/components/icons/close'

// ====================================================================== Export
export default {
  name: 'ButtonFilters',

  components: {
    Button,
    LoaderTripleDot,
    IconClose
  },

  props: {
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
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.button {
  position: relative;
  padding: toRem(7) toRem(15);
  border: 1px solid $rangoonGreen;
  border-radius: toRem(20);
  white-space: nowrap;
  cursor: pointer;
  margin-right: toRem(8);
  &[disabled] {
    box-shadow: none;
    cursor: no-drop;
    opacity: 0.5;
  }
  &.selected {
    background-color: $rangoonGreen;
    color: white;
  }
  :deep(.close) {
    margin-left: toRem(10);
    path {
      fill: white;
    }
  }
  &:hover {
    background-color: $athensGray;
    color: $rangoonGreen;
    &:hover {
      :deep(.close) {
        path {
          fill: $rangoonGreen;
        }
      }
    }
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
  font-family: $font_Primary;
  @include fontWeight_Medium;
  @include fontSize_16;
  line-height: leading(24, 16);
  &.hide {
    opacity: 0;
  }
}

</style>
