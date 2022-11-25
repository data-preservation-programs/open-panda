<template>
  <div :class="`page page-${tag}`">
    <div class="grid">
      <div class="col">
        <div class="inner-content">

          <MarkdownParser :markdown="markdown" />

        </div>
      </div>
    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import MarkdownParser from '@/components/markdown-parser'

import StaticPageData from '@/content/pages/static.json'
import StaticContent from '@/content/markdown/static.md'

// ====================================================================== Export
export default {
  name: 'StaticPage',

  components: {
    MarkdownParser
  },

  data () {
    return {
      tag: 'static'
    }
  },

  async fetch ({ store, route }) {
    await store.dispatch('general/getBaseData', { key: 'static', data: StaticPageData })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    pageContent () {
      return this.siteContent[this.tag]
    },
    markdown () {
      return StaticContent
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
</style>
