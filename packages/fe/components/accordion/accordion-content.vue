<template>
  <div class="accordion-content" :style="styles">

    <slot />

  </div>
</template>

<script>
// ===================================================================== Imports
import Throttle from 'lodash/throttle'

// ====================================================================== Export
export default {
  name: 'AccordionContent',

  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      content: false,
      height: '0px',
      resize: false
    }
  },

  computed: {
    styles () {
      return this.disabled ? { height: 'auto' } : { height: this.height }
    }
  },

  created () {
    this.$on('refresh-height', () => {
      this.height = this.content.clientHeight + 'px'
    })
  },

  mounted () {
    this.$nextTick(() => {
      this.content = this.$slots.default[0].elm
      this.resize = Throttle(() => {
        if (this.height !== '0px') {
          this.height = this.content.clientHeight + 'px'
        }
      }, 100)
      window.addEventListener('resize', this.resize)
      if (this.content.$on) {
        this.content.$on('changed', () => {
          this.$nextTick(() => {
            const height = this.content.clientHeight + 'px'
            if (height !== this.height) {
              this.height = height
            }
          })
        })
      }
    })
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    toggleOpen () {
      const height = this.height
      if (height === '0px') {
        this.height = this.content.clientHeight + 'px'
      } else {
        this.height = '0px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.accordion-content {
  transition: height 150ms ease-in-out;
}
</style>
