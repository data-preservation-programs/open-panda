<template>
  <div :class="`page page-${tag} grid`">

    <div class="col-5">
    </div>

    <div class="col-7">
      <h1>Explore the world's largest open datasets</h1>
    </div>

    <Slider
      slider-id="000000"
      :display-options="{ large: 4, mini: 2 }"
      :grid-cols="gridColumns"
      class="col-12">

      <template #icon-previous>
        back
      </template>

      <template #icon-next>
        next
      </template>

      <template
        v-for="(slide, i) in collection"
        #[`slider-panel-${i}`]>
        <div
          :key="`slide-${i}`"
          class="test-panel"
          :style="{ 'background-color': `rgba(200, ${greens[i]}, 200, 0.5)` }">
          {{ slide }}
        </div>
      </template>

    </Slider>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import IndexPageData from '@/content/pages/index.json'
import Slider from '@/modules/slider/components/slider'

// ====================================================================== Export
export default {
  name: 'IndexPage',

  components: {
    Slider
  },

  data () {
    return {
      tag: 'index',
      collection: ['a', 'b', 'c', 'd', 'e', 'f'],
      greens: [...Array(6)].map(i => Math.floor(Math.random() * 255)),
      gridColumns: {
        before: {
          num: 'col-12'
        },
        after: {
          num: 'col-10',
          push_left: 'off-1',
          push_right: 'off-1'
        }
      }
    }
  },

  async fetch ({ store, route }) {
    await store.dispatch('general/getBaseData', { key: 'index', data: IndexPageData })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    pageData () {
      return this.siteContent.index.page_content
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page {
  margin-top: 8.5rem;
}

.test-panel {
  position: relative;
  width: 100%;
  height: 8rem;
}

:deep(.panel-before) {
  min-height: 0 !important;
}

:deep(.slider-controls) {
  position: absolute;
  width: 100%;
  transform: translateY(74px);
}

:deep(.slide-selector) {
  justify-content: space-between;
}

</style>
