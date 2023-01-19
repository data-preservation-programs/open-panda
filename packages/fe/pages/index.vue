<template>
  <div :class="`page page-${tag}`">
    <BlockBuilder :sections="sections" />

    <div class="grid">
      <Searchbar
        placeholder="Search by dataset ID, name, slug or description..."
        :loading="dataLoading"
        theme="standalone"
        format="mini"
        class="dataset-searchbar col-4" />

      <div class="col-4 results-count">
        {{ resultCount }}
      </div>
      
      <Filters />
  
      <div v-if="noResults">
        <h3>There are no projects matching this search, please try again.</h3>
      </div>
    </div>

    <div class="grid-4-equalHeight_md-2_sm-1">
      <Card
        v-for="(data, index) in filteredDatasetList"
        :key="`dataset-${index}`"
        :data="data" />
    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import IndexPageData from '@/content/pages/index.json'
import BlockBuilder from '@/components/blocks/block-builder'
import Card from '@/components/card'
import Filters from '@/components/filters'
import Searchbar from '@/components/searchbar'

// ====================================================================== Export
export default {
  name: 'PageIndex',

  components: {
    BlockBuilder,
    Card,
    Filters,
    Searchbar
  },

  data () {
    return {
      tag: 'index',
      subtag: 'explorer'
    }
  },

  async fetch ({ app, store, route, error }) {
    await store.dispatch('general/getBaseData', { key: 'index', data: IndexPageData })
    await store.dispatch('modify/setLoadingStatus', { tag: 'explorerNav', status: true })
    await store.dispatch('modify/getFilters')
    await store.dispatch('modify/getDatasetList', {
      tag: 'explorer',
      route
    })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      filters: 'search/filters',
      loading: 'modify/loading',
      metadata: 'modify/metadata',
      basicStats: 'modify/basicStats',
      clipboard: 'general/clipboard',
      searchValue: 'search/searchValue'
    }),
    pageData () {
      return this.siteContent[this.tag]
    },
    sections () {
      return this.pageData.page_content
    },
    datasetList () {
      return this.$store.getters['modify/datasetList'][this.subtag]
    },
    filteredDatasetList () {
      return this.datasetList.filter(obj => !obj.new)
    },
    dataLoading () {
      return this.loading.explorerData
    },
    count () {
      return this.metadata[this.subtag].count
    },
    resultCount () {
      const count = this.count
      if (!count) { return '0 results' }
      if (count === 1) { return '1 result' }
      return `${count} results`
    },
    page () {
      return this.metadata[this.subtag].page
    },
    totalPages () {
      return this.metadata[this.subtag].totalPages
    },
    noResults () {
      return !this.count
    }
  },

  watch: {
    '$route' (route) {
      this.getDatasetList({
        tag: 'explorer',
        route
      })
    },
    datasetList () {
      this.stopLoading()
    }
  },

  mounted () {
    this.stopLoading()
  },

  beforeDestroy () {
    this.resetStore()
    this.$clearSearchAndFilters()
  },

  methods: {
    ...mapActions({
      resetStore: 'modify/resetStore',
      setLoadingStatus: 'modify/setLoadingStatus',
      getDatasetList: 'modify/getDatasetList',
      removeLoader: 'button/removeLoader',
      setClipboard: 'general/setClipboard'
    }),
    stopLoading () {
      this.$nextTick(() => {
        if (typeof this.datasetList !== 'boolean') {
          this.setLoadingStatus({ tag: 'explorerNav', status: false })
          this.setLoadingStatus({ tag: 'explorerData', status: false })
        }
      })
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
