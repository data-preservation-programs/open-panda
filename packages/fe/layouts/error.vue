<template>
  <div class="error-page">
    <section class="content">
      <div class="grid">

        <div class="col-5">
          <ImageBlock
            class="image-left"
            :block="imageLeft" />
        </div>

        <div class="col-7">
          <ImageBlock :block="topRightImageBlock" />
          <TextBlock :block="textblock" />
        </div>

      </div>
    </section>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import TextBlock from '@/components/blocks/text-block'
import ImageBlock from '@/components/blocks/image-block'

// ====================================================================== Export
export default {
  name: 'ErrorPage',

  components: {
    TextBlock,
    ImageBlock
  },

  async fetch () {
    await this.$store.dispatch('general/getBaseData', 'general')
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    pageContent () {
      return this.siteContent.general['404_error_page']
    },
    textblock () {
      return this.pageContent.message
    },
    imageLeft () {
      return { src: '/images/error-page/pointilist-cube-and-colorful-static.png' }
    },
    topRightImageBlock () {
      return { src: '/images/error-page/television-color-test-and-pointlist-waves.png' }
    }
  },

  mounted () {
    console.log(this.siteContent)
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.error-page {
  position: relative;
  overflow: hidden;
}

:deep(.text-block) {
  margin-top: toRem(90);
  margin-left: 5rem;
  .heading {
    font-size: toRem(80);
    @include fontWeight_Bold;
    line-height: leading(75, 80);
    font-family: $font_Secondary;
  }
  .description {
    @include p1;
  }
  .button {
    border-top-left-radius: 0.125rem;
  }
}

</style>
