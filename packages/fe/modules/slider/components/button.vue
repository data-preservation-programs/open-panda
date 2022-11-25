<script>
// ===================================================================== Imports
import { mapActions } from 'vuex'

// ====================================================================== Export
export default {
  name: 'SliderButton',

  props: {
    sliderId: {
      type: String,
      required: true
    },
    panelIndex: {
      type: Number,
      required: true
    }
  },

  computed: {
    currentPanel () {
      return this.$slider(this.sliderId).getCurrentPanel()
    },
    selected () {
      return this.panelIndex === this.currentPanel
    }
  },

  methods: {
    ...mapActions({
      updateSlider: 'slider/updateSlider'
    }),
    changePanel () {
      this.updateSlider({
        sliderId: this.sliderId,
        currentPanel: this.panelIndex
      })
    }
  },

  render () {
    return this.$scopedSlots.default({
      changePanel: this.changePanel,
      selected: this.selected
    })
  }
}
</script>
