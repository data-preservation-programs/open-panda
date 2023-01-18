<template>
  <div :class="`page page-${tag} grid`">

    <div class="col-5">
    </div>

    <div class="col-7">
      <h1>Explore the world's largest open datasets</h1>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import IndexPageData from '@/content/pages/index.json'

// ====================================================================== Export
export default {
  name: 'IndexPage',

  data () {
    return {
      tag: 'index'
    }
  },

  async fetch ({ store, route }) {
    await store.dispatch('general/getBaseData', { key: 'index', data: IndexPageData })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    pageData () {
      return this.siteContent.index.page_content
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
</style>
