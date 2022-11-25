<template>
  <div class="slider-panel">

    <slot />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'SliderPanel'
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.slider-panel {
  flex: 1;
}
</style>
