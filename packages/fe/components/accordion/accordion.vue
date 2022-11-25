<template>
  <div class="accordion">

    <slot :active="active" />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Accordion',

  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    toggleOnLoad: {
      type: Boolean,
      required: false,
      default: false
    },
    toggleWhenAdded: {
      type: Boolean,
      required: false,
      default: false
    },
    scrollToWhenAdded: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      active: this.multiple ? [] : false,
      children: []
    }
  },

  computed: {
    toggleState () {
      return {
        open: this.active.length,
        total: this.children.length
      }
    }
  },

  created () {
    this.$on('toggle', (id) => {
      if (this.multiple) {
        // Open multiple panels
        if (this.active.includes(id)) {
          this.active = this.active.filter(_id => _id !== id)
        } else {
          this.active.push(id)
        }
        this.$emit('toggleStateChanged', this.toggleState)
      } else {
        // Open single panel
        if (this.active === id) {
          this.active = false
        } else {
          this.active = id
        }
      }
    })
    this.$on('expand-all', () => {
      if (this.multiple) {
        const active = this.active
        const children = this.children
        if (active.length === children.length) {
          this.active = []
        } else {
          this.children.forEach((id) => {
            if (!active.includes(id)) {
              this.active.push(id)
            }
          })
        }
        this.$emit('toggleStateChanged', this.toggleState)
      }
    })
  },

  methods: {
    compileChildren (id) {
      this.children.push(id)
    },
    setSelected (id) {
      if (this.multiple) {
        this.active.push(id)
      } else {
        this.active = id
      }
    }
  }
}
</script>
