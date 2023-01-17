<template>
  <div class="block image-block">

    <img
      :src="block.src"
      :alt="block.alt ? block.alt : $GetPrettyNameFromUrl(block.src)" />

    <caption v-if="block.caption">
      {{ block.caption }}
    </caption>

  </div>
</template>

<script>

export default {
  name: 'ImageBlock',

  props: {
    block: {
      /**
       * src: String
       * alt: String
       * caption: String
       */
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.image-block {
  position: relative;

  img {
    display: block;
    position: relative;
    width: 100%;
    user-select: none;
  }
}
</style>
