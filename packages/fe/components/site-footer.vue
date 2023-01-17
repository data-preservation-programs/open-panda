<template>
  <footer>

    <div class="grid-bottom">
      <div class="col-5">
        <img src="/images/footer.png">
      </div>
  
      <div class="col-7">
        <div class="right">
          <h3>Access humanity's most important data</h3>
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
    </div>

    <div class="grid-right">
      Lorem ipsum 2021
    </div>

  </footer>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import Button from '@/components/buttons/button'

// ====================================================================== Export
export default {
  name: 'SiteFooter',

  components: {
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
  border-radius: toRem(50);
}
</style>
