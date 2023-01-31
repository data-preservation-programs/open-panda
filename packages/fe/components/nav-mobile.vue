<template>
  <nav>
    <Button :button="{}" />
  </nav>
</template>

<script>
import Button from '@/components/buttons/button'

export default {
  name: 'NavMobile',

  components: {
    Button
  }
}
</script>

<style lang="scss" scoped>

nav {
  background-color: white;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  overflow: hidden;
  display: none;
  z-index: 100;
  @include medium {
    display: block;
  }
}

</style>
