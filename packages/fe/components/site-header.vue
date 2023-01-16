<template>
  <header class="grid-spaceBetween-noGutter">
    <Searchbar />

    <nuxt-link to="/" class="logo-link">
      <SiteLogo />
    </nuxt-link>

    <nav>
      <Button
        v-for="(link, index) in links"
        :key="index"
        :button="{
          text: link.label,
          type: isRouteCurrent(link.href) ? 'solid' : 'default',
          url: link.href
        }" />
    </nav>
  </header>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Button from '@/components/buttons/button'
import SiteLogo from '@/components/icons/logo'
import Searchbar from '@/components/searchbar'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    Button,
    SiteLogo,
    Searchbar
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
header {
  padding-top: toRem(50);
  padding-bottom: toRem(70);
}
</style>
