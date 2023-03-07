<template>
  <div class="tabbed-slider" :style="{ '--slider-height': `${height}px` }">
    <div :class="`grid-noGutter${reverseGrid ? '-reverse' : ''}`">

      <div
        :class="gridCols.tabs.num"
        :data-push-left="gridCols.tabs.push_left"
        :data-push-right="gridCols.tabs.push_right">

        <slot name="before-tabs"></slot>

        <div
          ref="selector"
          class="tab-list">
          <button
            v-for="(tab, index) in collection"
            :key="`tab-${index}`"
            :class="['tab', { selected: positions[index] }]"
            tabindex="0"
            @keyup.tab="selectTab(index)"
            @click="selectTab(index)">

            <slot :name="`slider-tab-${index}`"></slot>

          </button>
        </div>
      </div>

      <div
        :class="gridCols.slide.num"
        :data-push-left="gridCols.slide.push_left"
        :data-push-right="gridCols.slide.push_right">

        <slot name="before-slides"></slot>

        <div
          class="slide-wrapper">
          <div
            v-for="(slide, index) in collection"
            :key="`slide-${index}`"
            ref="slides"
            :class="['slide', { selected: positions[index] }]">

            <slot :name="`slider-panel-${index}`"></slot>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// ====================================================================== Import
import { mapActions } from 'vuex'

// =================================================================== Functions
const handleSliderResize = (instance) => {
  if (instance.$refs.slides) {
    const slideHeights = []
    instance.$refs.slides.forEach((slide) => {
      slideHeights.push(slide.clientHeight)
    })
    instance.slideHeights = slideHeights
  }
}

// ====================================================================== Export
export default {
  name: 'TabbedSlider',

  props: {
    sliderId: {
      type: String,
      required: true
    },
    startPanelIndex: {
      type: Number,
      required: false,
      default: 0
    },
    gridCols: {
      type: Object,
      required: false,
      default: () => ({
        tabs: { num: 'col-6' },
        slide: { num: 'col-6' }
      })
    },
    reverseGrid: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    const localId = this.$uuid.v4()
    return {
      localId,
      selected: '',
      slideHeights: [],
      resize: false,
      height: false
    }
  },

  computed: {
    id () {
      return `${this.sliderId}|${this.localId}`
    },
    tabSlots () {
      return Object.keys(this.$slots).filter(key => key.startsWith('slider-tab'))
    },
    slideSlots () {
      return Object.keys(this.$slots).filter(key => key.startsWith('slider-panel'))
    },
    collection () {
      const collection = []
      this.tabSlots.forEach((key, i) => {
        if (key.replace('tab', '') === this.slideSlots[i].replace('panel', '')) {
          collection.push({
            tab: key,
            slide: this.slideSlots[i]
          })
        }
      })
      return collection
    },
    panelCount () {
      return this.$slider(this.sliderId).getPanelCount()
    },
    positions () {
      return this.$slider(this.sliderId).getPanelPositions()
    }
  },

  watch: {
    positions: {
      deep: true,
      handler () {
        const height = this.slideHeights[this.positions.indexOf(1)]
        this.$emit('slide-changed', height)
        this.height = height
      }
    }
  },

  mounted () {
    const panelCount = this.collection.length
    const startPanelIndex = this.startPanelIndex
    if (startPanelIndex < 0) {
      throw new Error(`The start panel index cannot be a negative number. You supplied a value of ${startPanelIndex}`)
    }
    if (startPanelIndex > panelCount - 1) {
      throw new Error(`You entered a start panel index (${startPanelIndex}) that is higher than the amount of panels available; (${panelCount}).`)
    }
    this.registerSlider({
      id: this.id,
      sliderId: this.sliderId,
      panelPositions: [...Array(panelCount)].map((el, i) => { return i === startPanelIndex ? 1 : 0 }),
      panelCount,
      refreshHeight: handleSliderResize(this)
    })
    handleSliderResize(this)
    this.resize = () => { handleSliderResize(this) }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    this.deregisterSlider(this.id)
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    ...mapActions({
      registerSlider: 'slider/registerSlider',
      deregisterSlider: 'slider/deregisterSlider',
      updateSlider: 'slider/updateSlider'
    }),
    selectTab (value) {
      const panelCount = this.panelCount
      this.updateSlider({
        sliderId: this.sliderId,
        panelPositions: [...Array(panelCount)].map((el, i) => { return i === value ? 1 : 0 })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
[class~="grid"], [class*="grid-"], [class*="grid_"] {
  @include small {
    flex-direction: column;
  }
}

.tabbed-slider {
  --slider-height: unset;
  .tab-list,
  .slide-wrapper {
    height: var(--slider-height);
  }
}

// //////////////////////////////////////////////////////////////////////// Tabs
.tab-list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

// ////////////////////////////////////////////////////////////////////// Slides
.slide-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  transition: height 200ms ease;
}

.slide {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  &.selected {
    opacity: 1;
  }
}

</style>
