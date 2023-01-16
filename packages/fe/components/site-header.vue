<template>
  <header
    v-if="links"
    id="site-header"
    ref="header"
    :class="{ mini }">

    <div class="grid-noGutter">
      <div class="col">
        <div class="inner-container">

          <nuxt-link to="/" class="logo-link">
            <SiteLogo />
          </nuxt-link>

          <nav id="site-nav">
            <ButtonA
              v-for="(link, index) in links"
              :key="index"
              :to="link.href"
              :text="link.label"
              :selected="isRouteCurrent(link.href)"
              tag="nuxt-link"
              class="site-nav-link" />
          </nav>

        </div>
      </div>
    </div>

  </header>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import ButtonA from '@/components/buttons/button-a'
import SiteLogo from '@/components/icons/logo'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    ButtonA,
    SiteLogo
  },

  data () {
    return {
      mini: false,
      scroll: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    links () {
      const siteContent = this.siteContent
      return siteContent.general ? siteContent.general.navigation.header : false
    }
  },

  mounted () {
    const scrollHandler = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop
      const mini = this.mini
      if (y > 0) {
        if (!mini) { this.mini = true }
      } else {
        if (mini) { this.mini = false }
      }
    }; scrollHandler()
    this.scroll = this.$throttle(scrollHandler, 1)
    window.addEventListener('scroll', this.scroll)
  },

  beforeDestroy () {
    if (this.scroll) { window.removeEventListener('scroll', this.scroll) }
  },

  methods: {
    isRouteCurrent (href) {
      const route = this.$route
      if (route.path === href) { return true }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
