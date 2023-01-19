<template>
  <div :class="`page page-${tag}`">
    <BlockBuilder :sections="sections" />

    <div class="grid-4-equalHeight_md-2_sm-1">
      <Card
        v-for="(data, index) in dataset.data"
        :key="`dataset-${index}`"
        :data="data" />
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// mock data
import dataset from '@/content/mocks/datasets.json'

import IndexPageData from '@/content/pages/index.json'
import BlockBuilder from '@/components/blocks/block-builder'
import Card from '@/components/card'

// ====================================================================== Export
export default {
  name: 'PageIndex',

  components: {
    BlockBuilder,
    Card
  },

  data () {
    return {
      tag: 'index',
      dataset
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
      return this.siteContent[this.tag]
    },
    sections () {
      return this.pageData.page_content
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.home-hero) {
  [data-block-id="col_2"] {
    .text-block {
      margin-left: $singleColumn;
      margin-top: toRem(90);
      @include medium {
        margin-left: 0;
      }
    }
  }
}
</style>
