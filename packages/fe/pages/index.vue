<template>
  <div :class="`page page-${tag}`">
    <!-- hero -->
    <BlockBuilder :sections="pageContent" />

    <!-- filter heading -->
    <div class="grid-noGutter-middle-spaceBetween filter-heading">
      <h5>{{ datasetContent.explore }}</h5>
    </div>

    <!-- filter row1: searchbar, checkbox, sort, filter button -->
    <div class="grid-noGutter-middle-spaceBetween filter-row1">
      <div class="col-6">
        <div class="grid-noGutter-middle-spaceBetween">
          <div class="col-7">
            <Searchbar
              :placeholder="`Search ${count || '...'} datasets`"
              :loading="dataLoading"
              theme="line"
              class="datasets-searchbar" />
          </div>
          <Filterer
            filter-key="fullyStored"
            :filters="filters.fullyStored"
            :is-single-option="true"
            class="col-5 datasets-checkbox">
            <div slot-scope="{ applyFilter }">
              <FieldContainer
                field-key="toggle_fully_stored"
                :scaffold="{
                  type: 'checkbox',
                  required: false,
                  label: 'Show only fully stored datasets'
                }"
                @updateValue="applyFilter(0)" />
            </div>
          </Filterer>
        </div>
      </div>

      <div class="col-6">
        <Sorter :options="sortOptions">
          <div slot-scope="{ apply }">
            <FieldContainer
              field-key="sort_by"
              :scaffold="{
                type: 'select',
                required: false,
                label: 'Sort by',
                options: sortOptions
              }"
              @updateValue="apply" />
          </div>
        </Sorter>
        <Filters />
      </div>
    </div>

    <!-- filter row2: results count, selected filters, layout button selection -->
    <div class="grid-middle-spaceBetween filter-row2">
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

      <div class="col-3">
        <button @click="$clearSearchFilterSortAndLimit">
          clear all filters
        </button>
        <button @click="updateLayout('grid')">
          grid</button>
        <button @click="updateLayout('list')">
          list</button>
      </div>
    </div>

    <!-- cards - no result -->
    <div v-if="noResults" class="grid-middle-spaceBetween no-results">
      <h3>{{ datasetContent.empty }}</h3>
    </div>

    <!-- cards -->
    <div v-if="layout === 'grid'" class="grid-4-equalHeight_md-2_sm-1 results">
      <DatasetsCardGrid
        v-for="(data, index) in filteredDatasetList"
        :key="`dataset-${index}`"
        :data="data"
        :labels1="datasetContent.card.labels1"
        :labels2="datasetContent.card.labels2" />
    </div>
    <div v-if="layout === 'list'" class="grid-1">
      <DatasetsCardList
        v-for="(data, index) in filteredDatasetList"
        :key="`dataset-${index}`"
        :data="data"
        :labels1="datasetContent.card.labels1"
        :labels2="datasetContent.card.labels2" />
    </div>

    <!-- pagination -->
    <div class="grid-center-middle pagination">
      <div class="col-5">
        <PaginationControls
          v-if="totalPages > 1"
          :page="page"
          :total-pages="totalPages"
          :loading="dataLoading"
          store-key="datasets" />
      </div>
      <div class="col-5">
        <ResultsPerPage
          v-if="totalPages > 1"
          :options="limit" />
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import IndexPageData from '@/content/pages/index.json'
import BlockBuilder from '@/components/blocks/block-builder'
import DatasetsCardGrid from '@/components/datasets-card/datasets-card-grid'
import DatasetsCardList from '@/components/datasets-card/datasets-card-list'
import Filters from '@/components/filters'
import Searchbar from '@/components/searchbar'
import PaginationControls from '@/components/pagination-controls'
import ResultsPerPage from '@/components/results-per-page'
import FieldContainer from '@/components/form/field-container'
import Filterer from '@/modules/search/components/filterer'
import Sorter from '@/modules/search/components/sorter'
import ButtonFilters from '@/components/buttons/button-filters'

// ====================================================================== Export
export default {
  name: 'PageIndex',

  components: {
    BlockBuilder,
    DatasetsCardGrid,
    DatasetsCardList,
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
      tag: 'index'
    }
  },

  async fetch ({ app, store, route, error }) {
    await store.dispatch('general/getBaseData', { key: 'index', data: IndexPageData })
    await store.dispatch('datasets/getSortLimitFilters')
    await store.dispatch('datasets/getDatasetList', { route })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      filters: 'datasets/filters',
      sortOptions: 'datasets/sort',
      limit: 'datasets/limit',
      loading: 'datasets/loading',
      metadata: 'datasets/metadata',
      layout: 'datasets/layout'
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
    this.$clearSearchFilterSortAndLimit()
  },

  methods: {
    ...mapActions({
      resetStore: 'datasets/resetStore',
      setLoadingStatus: 'datasets/setLoadingStatus',
      setLayout: 'datasets/setLayout',
      getDatasetList: 'datasets/getDatasetList',
      resetFormModel: 'form/resetFormModel'
    }),
    stopLoading () {
      this.$nextTick(() => {
        if (typeof this.datasetList !== 'boolean') {
          this.setLoadingStatus({ status: false })
        }
      })
    },
    updateLayout (layout) {
      this.setLayout(layout)
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

.pagination {
  margin-top: toRem(50);
}

.filter-heading,
.filter-row1 {
  margin-bottom: toRem(20)
}
.filter-row2 {
  margin-bottom: toRem(55);
}
</style>
