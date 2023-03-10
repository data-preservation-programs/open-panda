<template>
  <span class="button-wrapper">
    <!-- have to duplicate the component and add a v-if to ensure :focus-visible is properly showing. nuxt gets confused when we have :to and :href as props and end up not showing href for <a> tags -->
    <component
      :is="tag"
      v-if="tag === 'a'"
      :to="tag === 'nuxt-link' ? to : false"
      :href="tag === 'a' ? to : false"
      :disabled="disabled || loading"
      :target="target"
      :class="['button', { selected }]"
      tabindex="0"
      role="link"
      @click="clickHandler($event)">
      <slot :loading="loading" />
    </component>
    <component
      :is="tag"
      v-if="tag !== 'a'"
      :to="tag === 'nuxt-link' ? to : false"
      :disabled="disabled || loading"
      :class="['button', { selected }]"
      tabindex="0"
      @click="clickHandler($event)">
      <slot :loading="loading" />
    </component>
  </span>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

// ====================================================================== Export
export default {
  name: 'Button',

  props: {
    tag: { // button, 'a' or nuxt-link
      type: String,
      required: false,
      default: 'button'
    },
    to: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    target: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    loader: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    selected: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      timeout: false
    }
  },

  computed: {
    ...mapGetters({
      loaders: 'button/loaders'
    }),
    loading () {
      return this.loaders.find(obj => obj === this.loader)
    }
  },

  methods: {
    ...mapActions({
      addLoader: 'button/addLoader',
      removeLoader: 'button/removeLoader'
    }),
    clickHandler (e) {
      e.stopPropagation()
      if (!this.disabled) {
        clearTimeout(this.timeout)
        const loader = this.loader
        if (typeof loader === 'string') {
          this.addLoader(loader)
          this.timeout = setTimeout(() => {
            this.removeLoader(loader)
            clearTimeout(this.timeout)
          }, 4000)
        }
        this.$emit('clicked', e)
      }
    }
  }
}
</script>
