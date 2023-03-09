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
  margin-top: toRem(10);
  &:hover {
    .tooltip-btn {
      color: $rangoonGreen;
    }
    .tooltip-box-wrapper {
      @include fadeIn;
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
.tooltip-btn-wrapper {
  cursor: pointer;
  align-items: center;
  display: flex;
  color: $blue;
  @include fontSize_14;
  @include fontWeight_Medium;
  .icon {
    margin-right: toRem(7);
  }
}
.tooltip-box-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 100%;
  @include fadeOut;
  width: toRem(275);
  background-color: $rangoonGreen;
  padding: toRem(15);
  color: white;
  border-radius: toRem(10);
  :deep(a) {
    color: $neptune;
    @include fontWeight_Semibold;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
