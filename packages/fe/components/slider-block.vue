<template>
  <div class="slider-block">
    <CircularSlider
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
  </div>
</template>

<script>
// ====================================================================== Import
import CircularSlider from '@/modules/slider/components/circular-slider'

// ====================================================================== Export
export default {
  name: 'SliderBlock',

  components: {
    CircularSlider
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
    }
  },

  computed: {
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
