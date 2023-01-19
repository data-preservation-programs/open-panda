<template>
  <div :class="`page page-${tag}`">
    <BlockBuilder :sections="sections" />

    <div class="grid">
      <Searchbar
        :placeholder="`Search ${count} datasets`"
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
        :data="data"
        :labels1="{
          cid: 'CIDs',
          replication: 'Replication Factor',
          data_size: 'Dataset Size',
          total: 'Total Data on Network',
          storage: 'Storage Providers'
        }"
        :labels2="{
          file_extensions: 'File Types',
          locations: 'Locations'
        }" />
    </div>

    <div class="grid-center-middle">
      <div class="col-6">
        <PaginationControls
          v-if="totalPages > 1"
          :page="page"
          :total-pages="totalPages"
          :loading="dataLoading"
          store-key="datasets" />
      </div>
      <div class="col-6">
        results per page
      </div>
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
import PaginationControls from '@/components/pagination-controls'

// ====================================================================== Export
export default {
  name: 'PageIndex',

  components: {
    BlockBuilder,
    Card,
    Filters,
    Searchbar,
    PaginationControls
  },

  data () {
    return {
      tag: 'index'
    }
  },

  async fetch ({ app, store, route, error }) {
    await store.dispatch('general/getBaseData', { key: 'index', data: IndexPageData })
    await store.dispatch('datasets/getFilters')
    await store.dispatch('datasets/getDatasetList', { route })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      filters: 'search/filters',
      loading: 'datasets/loading',
      metadata: 'datasets/metadata',
      basicStats: 'datasets/basicStats',
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
      return this.$store.getters['datasets/datasetList']
    },
    filteredDatasetList () {
      return this.datasetList.filter(obj => !obj.new)
    },
    dataLoading () {
      return this.loading.indexData
    },
    count () {
      return this.metadata.count
    },
    resultCount () {
      const count = this.count
      if (!count) { return '0 results' }
      if (count === 1) { return '1 result' }
      return `${count} results`
    },
    page () {
      return this.metadata.page
    },
    totalPages () {
      return this.metadata.totalPages
    },
    noResults () {
      return !this.count
    }
  },

  watch: {
    '$route' (route) {
      this.getDatasetList({
        tag: 'index',
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
      resetStore: 'datasets/resetStore',
      setLoadingStatus: 'datasets/setLoadingStatus',
      getDatasetList: 'datasets/getDatasetList',
      removeLoader: 'button/removeLoader'
    }),
    stopLoading () {
      this.$nextTick(() => {
        if (typeof this.datasetList !== 'boolean') {
          this.setLoadingStatus({ status: false })
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
