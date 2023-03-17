<template>
  <div :class="`tooltip-c align-${align}`">

    <div class="tooltip-btn-wrapper">
      <slot name="tooltip-btn" />
    </div>

    <div class="tooltip-box-wrapper">
      <slot name="tooltip-box" />
    </div>

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Tooltip',

  props: {
    align: {
      type: String,
      required: false,
      default: 'center'
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.tooltip-c {
  position: relative;
  z-index: 1000;
  &:hover {
    .tooltip-box-wrapper {
      // fade in
      opacity: 1;
      visibility: visible;
      transition: all 200ms ease-in;
      pointer-events: auto;
    }
  }
  &.align-right {
    .tooltip-box-wrapper {
      right: 0;
      left: auto;
      transform: none;
    }
  }
  &.align-left {
    .tooltip-box-wrapper {
      left: 0;
      right: auto;
      transform: none;
    }
  }
}

.tooltip-box-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 100%;
  // fade out
  opacity: 0;
  visibility: hidden;
  transition: all 200ms ease-in;
  pointer-events: none;
}
</style>
