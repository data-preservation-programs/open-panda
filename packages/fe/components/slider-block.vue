<template>
  <div class="slider-block">
    <CircularSlider
      v-if="sliderType === 'circular'"
      slider-id="000000"
      :display-options="{ large: 4, mini: 2 }"
      :grid-cols="sliderGrid"
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
        <!-- TODO: replace this div with actual card component  -->
        <div
          :key="`slide-${i}`"
          class="test-panel"
          :style="{ 'background-color': `rgba(200, ${greens[i]}, 200, 0.5)` }">
          {{ slide }}
        </div>
      </template>

    </CircularSlider>

    <TabbedSlider
      v-if="sliderType === 'tabbed'"
      slider-id="000000"
      :grid-cols="sliderGrid">

      <template
        v-for="(tab, i) in collection"
        #[`slider-tab-${i}`]>
        <div :key="`tab-${i}`">
          {{ tab }}
        </div>
      </template>

      <template
        v-for="(slide, i) in collection"
        #[`slider-panel-${i}`]>
        <!-- TODO: replace this div with actual card component  -->
        <div
          :key="`slide-${i}`"
          class="test-panel"
          :style="{ 'background-color': `rgba(200, ${greens[i]}, 200, 0.5)`, height: `${heights[i]}px` }">
          {{ slide }}
        </div>
      </template>

    </TabbedSlider>

  </div>
</template>

<script>
// ====================================================================== Import
import CircularSlider from '@/modules/slider/components/circular-slider'
import TabbedSlider from '@/modules/slider/components/tabbed-slider'

// ====================================================================== Export
export default {
  name: 'SliderBlock',

  components: {
    CircularSlider,
    TabbedSlider
  },

  props: {
    block: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  data () {
    const len = this.block.collection.length
    return {
      greens: [...Array(len)].map(i => Math.floor(Math.random() * 255)), // this is just for testing and can be removed
      heights: [...Array(len)].map(i => Math.random() * 100 + 100) // this is also just for testing and can be removed
    }
  },

  computed: {
    sliderType () {
      return ['circular', 'tabbed'].includes(this.block.slider_type) ? this.block.slider_type : 'circular'
    },
    collection () {
      return this.block.collection
    },
    sliderGrid () {
      return this.block.sliderGrid
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.test-panel {
  position: relative;
  width: 100%;
  height: 8rem;
}

// ////////////////////////////////////////////////////////////// CircularSlider
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
