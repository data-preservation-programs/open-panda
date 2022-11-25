<template>
  <div class="slider">
    <div
      ref="track"
      :style="{ width, height, transform }"
      class="track">

      <slot />

    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapActions } from 'vuex'

// ====================================================================== Export
export default {
  name: 'Slider',

  props: {
    sliderId: {
      type: String,
      required: true
    },
    startPanelIndex: {
      type: Number,
      required: false,
      default: 0
    }
  },

  data () {
    const localId = this.$uuid.v4()
    return {
      localId,
      height: false,
      transitionend: false
    }
  },

  computed: {
    id () {
      return `${this.sliderId}|${this.localId}`
    },
    panelCount () {
      return this.$slider(this.sliderId).getPanelCount()
    },
    currentPanel () {
      return this.$slider(this.sliderId).getCurrentPanel()
    },
    width () {
      return `${this.panelCount * 100}%`
    },
    transform () {
      return `translateX(-${this.currentPanel * 50}%)`
    }
  },

  watch: {
    currentPanel (index) {
      this.setHeight()
    }
  },

  mounted () {
    const panelCount = this.getSlots().length
    const startPanelIndex = this.startPanelIndex
    if (startPanelIndex < 0) {
      throw new Error(`The start panel index cannot be a negative number. You supplied a value of ${startPanelIndex}`)
    }
    if (startPanelIndex > panelCount - 1) {
      throw new Error(`You entered a start panel index (${startPanelIndex}) that is higher than the amount of panels available (${panelCount})`)
    }
    this.registerSlider({
      id: this.id,
      sliderId: this.sliderId,
      currentPanel: this.startPanelIndex,
      panelCount,
      refreshHeight: this.setHeight
    })
    this.transitionend = (e) => {
      const propertyName = e.propertyName
      if (propertyName === 'height' || propertyName === 'transform') {
        this.$emit('sliderTransitionEnd')
      }
    }
    this.$refs.track.addEventListener('transitionend', this.transitionend)
    this.setHeight()
  },

  beforeDestroy () {
    this.deregisterSlider(this.id)
    if (this.transitionend) { this.$refs.track.removeEventListener('transitionend', this.transitionend) }
  },

  methods: {
    ...mapActions({
      registerSlider: 'slider/registerSlider',
      deregisterSlider: 'slider/deregisterSlider'
    }),
    getSlots () {
      return this.$slots.default.filter(slot => slot.tag)
    },
    setHeight () {
      this.$nextTick(() => {
        const slots = this.getSlots()
        this.height = `${slots[this.currentPanel].elm.clientHeight}px`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.track {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  overflow: hidden;
  transition: transform 150ms ease-in-out, height 150ms ease-in-out;
}
</style>
