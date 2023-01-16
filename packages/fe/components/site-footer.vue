<template>
  <footer>

    <div class="grid-bottom-noGutter">
      <div class="col-5">
        <nuxt-link to="/" class="logo-link">
          <SiteLogo />
        </nuxt-link>
      </div>
  
      <div class="col-7 right">
        Access humanity's most important data
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
    </div>

    <div class="grid-bottom-noGutter">
      Lorem ipsum 2021
    </div>

  </footer>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Button from '@/components/buttons/button'
import SiteLogo from '@/components/icons/logo'

// ====================================================================== Export
export default {
  name: 'SiteFooter',

  components: {
    SiteLogo,
    Button
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    links () {
      return this.siteContent.general.navigation.footer
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
footer {
  padding: toRem(50) 0 toRem(10) 0;
}
.right {
  background-color: $rangoonGreen;
  color: $grayNurse;
  padding: toRem(80) toRem(150);
  border-radius: 50px;
}
</style>
