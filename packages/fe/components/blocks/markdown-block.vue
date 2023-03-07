<template>
  <div v-if="content" class="block markdown-block">
    <MarkdownParser :markdown="content" />
  </div>
</template>

<script>
import MarkdownParser from '@/components/markdown-parser'

export default {
  name: 'MarkdownBlock',

  components: {
    MarkdownParser
  },

  props: {
    block: {
      type: Object,
      required: true
    }
  },

  computed: {
    content () {
      return this.block.content
    }
  }
}
</script>

<style lang="scss" scoped>
.markdown-block {
  position: relative;
}
</style>
