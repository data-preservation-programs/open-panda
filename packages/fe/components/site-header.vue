<template>
  <header class="grid-noGutter">
    <div class="col">

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

    </div>
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

</style>
