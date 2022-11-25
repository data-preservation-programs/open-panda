<template>
  <footer id="site-footer">

    FOOTER

  </footer>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// import ButtonA from '@/components/buttons/button-a'

// ====================================================================== Export
export default {
  name: 'SiteFooter',

  components: {
    // ButtonD
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    links () {
      return this.siteContent.general.navigation.footer
    },
    footerContent () {
      return this.siteContent.general.footer
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
// ///////////////////////////////////////////////////////////////////// General
#site-footer {
  position: relative;
  padding: 3.5rem 0;
  margin-top: 5rem;
  border-top: 0.25rem solid tomato;
}

// ///////////////////////////////////////////////////////////////////////// Nav
#footer-nav {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  height: 100%;
  margin-bottom: 0.75rem;
}
</style>
