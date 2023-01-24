<template>
  <div :class="`page page-${tag}`">
    <BlockBuilder :sections="pageContent" />

    <div class="grid-noGutter-middle-spaceBetween">
      <Searchbar
        :placeholder="`Search ${count || '...'} datasets`"
        :loading="dataLoading"
        theme="line"
        class="dataset-searchbar col-4" />

      <Filterer
        filter-key="fullyStored"
        :filters="filters.fullyStored"
        :is-single-option="true">
        <div
          slot-scope="{ applyFilter, isSelected }"
          class="col-2">
          <FieldContainer
            :form-id="formId"
            :scaffold="{
              type: 'checkbox',
              required: false,
              label: 'Show only fully stored datasets',
              model_key: 'fullyStored'
            }"
            :value="isSelected('fullyStored')"
            @updateValue="applyFilter(0)" />
        </div>
      </Filterer>

      <Sorter :options="sort">
        <div
          slot-scope="{ index, apply }"
          class="col-3">
          <FieldContainer
            :form-id="formId"
            :scaffold="{
              type: 'select',
              required: false,
              label: 'Sort by',
              model_key: 'sort',
              options: sort
            }"
            :value="index || 0"
            @updateValue="apply(getSelectedValue('sort'))" />
        </div>
      </Sorter>

      <div class="col-1">
        <Filters />
      </div>
    </div>

    <div class="grid-noGutter-middle-spaceBetween">
      <div class="col-9">
        {{ resultCount }}
        <Filterer
          v-for="(item, key) in filterPanelData.keys"
          :key="key"
          :filter-key="key"
          :filters="filters[key]">
          <span
            slot-scope="{ applyFilter, isSelected }"
            class="button-list">
            <span
              v-for="(item2, index2) in filters[key]"
              :key="`${filters[key]}-${index2}`">
              <ButtonFilters
                v-if="isSelected(item2.value)"
                :selected="isSelected(item2.value)"
                class="filter-button"
                @clicked="applyFilter(index2)">
                {{ item2.label }}
              </ButtonFilters>
            </span>
          </span>
        </Filterer>
      </div>

      <div class="col">
        <button @click="$clearAllFilters">
          clear all filters
        </button>
      </div>

      <div class="col">
        <button>grid</button>
        <button>list</button>
      </div>
    </div>

    <div class="grid-noGutter-middle-spaceBetween">
      <div v-if="noResults">
        <h3>{{ datasetContent.empty }}</h3>
      </div>
    </div>

    <div class="grid-4-equalHeight_md-2_sm-1">
      <Card
        v-for="(data, index) in filteredDatasetList"
        :key="`dataset-${index}`"
        :data="data"
        :labels1="datasetContent.card.labels1"
        :labels2="datasetContent.card.labels2" />
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
        <ResultsPerPage
          v-if="totalPages > 1"
          :options="limit"
          :loading="dataLoading"
          store-key="datasets" />
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import { findIndex } from 'lodash'

import IndexPageData from '@/content/pages/index.json'
import BlockBuilder from '@/components/blocks/block-builder'
import Card from '@/components/card'
import Filters from '@/components/filters'
import Searchbar from '@/components/searchbar'
import PaginationControls from '@/components/pagination-controls'
import ResultsPerPage from '@/components/results-per-page'
import FieldContainer from '@/components/form/field-container'
import Filterer from '@/modules/search/components/filterer'
import Sorter from '@/modules/search/components/sorter'
import ButtonFilters from '@/components/buttons/button-filters'

const formId = 'datasets|form'

// ====================================================================== Export
export default {
  name: 'PageIndex',

  components: {
    BlockBuilder,
    Card,
    Filters,
    Searchbar,
    PaginationControls,
    FieldContainer,
    Filterer,
    Sorter,
    ResultsPerPage,
    ButtonFilters
  },

  data () {
    return {
      tag: 'index',
      formId
    }
  },

  async fetch ({ app, store, route, error }) {
    await store.dispatch('general/getBaseData', { key: 'index', data: IndexPageData })
    await store.dispatch('datasets/getFilters')
    await store.dispatch('datasets/getSort')
    await store.dispatch('datasets/getLimit')
    await store.dispatch('datasets/getDatasetList', { route })
    await store.dispatch('form/registerFormModel', {
      formId,
      state: 'valid'
    })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      filters: 'datasets/filters',
      sort: 'datasets/sort',
      limit: 'datasets/limit',
      loading: 'datasets/loading',
      metadata: 'datasets/metadata',
      basicStats: 'datasets/basicStats',
      clipboard: 'general/clipboard',
      searchValue: 'search/searchValue'
    }),
    filterPanelData () {
      return this.siteContent.general ? this.siteContent.general.filterPanel : false
    },
    datasetContent () {
      return this.siteContent[this.tag].datasets_content
    },
    pageContent () {
      return this.siteContent[this.tag].page_content
    },
    datasetList () {
      return this.$store.getters['datasets/datasetList']
    },
    filteredDatasetList () {
      return this.datasetList.filter(obj => !obj.new)
    },
    dataLoading () {
      return this.loading
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
    },
    // checkbox and dropdowns
    formList () {
      return this.$store.getters['form/fields']
    }
  },

  watch: {
    '$route' (route) {
      this.getDatasetList({ route })
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
    },
    getSelectedValue (modelKey) {
      const idx = findIndex(this.formList, function (o) { return o.model_key === modelKey })
      return this.formList[idx] ? this.formList[idx].value : false
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
