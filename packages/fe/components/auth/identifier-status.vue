<template>
  <component :is="rootNode">

    <slot :identifier="identifier" />

  </component>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'IdentifierStatus',

  props: {
    rootNode: {
      type: String,
      required: false,
      default: 'div'
    }
  },

  data () {
    const self = this
    return {
      identifier: self.$authIdentifier,
      interval: false
    }
  },

  mounted () {
    this.interval = setInterval(() => {
      const identifier = this.$getCookie(document.cookie, 'identifier')
      if (identifier && !this.identifier) {
        this.identifier = JSON.parse(identifier)
      } else if (!identifier && this.identifier) {
        this.identifier = false
      }
    }, 50)
  },

  destroyed () {
    clearInterval(this.interval)
    this.interval = false
  }
}
</script>
