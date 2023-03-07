<template>
  <div class="error-page">
    <section class="content">
      <div class="grid-noGutter">

        <div class="col-5_sm-12_lg-first_sm-last">
          <ImageBlock :block="imageLeft" />
        </div>

        <div class="col-7_sm-12_lg-last_sm-first">
          <ImageBlock class="image-right" :block="topRightImageBlock" />
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
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.error-page {
  position: relative;
  overflow: hidden;

  @include small {
    margin-bottom: toRem(-60);
  }
}

.content {
  margin-top: toRem(20);
}

:deep(.text-block) {
  margin-top: toRem(90);
  margin-left: 5rem;
  @include small {
    margin-top: toRem(55);
    margin-bottom: toRem(55);
    margin-left: 1rem;
  }
  .heading {
    font-size: toRem(80);
    @include fontWeight_Bold;
    line-height: leading(75, 80);
    font-family: $font_Secondary;
    @include small {
      font-size: toRem(45);
      line-height: leading(45, 40);
    }
  }
  .description p {
    @include small {
      font-size: toRem(20);
    }
  }
}

</style>
