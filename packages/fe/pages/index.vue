<template>
  <div :class="`page page-${tag}`">
    <!-- ============================================================== hero -->
    <BlockBuilder :sections="pageContent" />

    <!-- ==================================================== filter heading -->
    <div id="datasets" class="grid-noGutter-middle-spaceBetween filter-heading">
      <h5>{{ datasetContent.explore }}</h5>
    </div>

    <!-- ============= filter row1: searchbar, checkbox, sort, filter button -->
    <div class="grid-noGutter-middle-spaceBetween filter-row1">
      <div class="col-8_mi-12 datasets-search-c">
        <Searchbar
          :placeholder="`Search ${count || '...'} datasets`"
          :loading="dataLoading"
          theme="line"
          class="datasets-searchbar" />
        <!-- ============================================== desktop checkbox -->
        <!-- <CheckboxFullyStored
          :options="filters.fullyStored"
          class="datasets-checkbox show-desktop-only"
          @filterApplied="refreshDatasetList" /> -->
      </div>

      <div class="col-4_mi-12 datasets-sort-c">
        <!-- ================================================== desktop sort -->
        <Sort
          :options="sortOptions"
          class="show-desktop-only"
          @filterApplied="refreshDatasetList" />
        <Filters />
      </div>
    </div>

    <!-- =========================== filter row2 mobile only: checkbox, sort -->
    <div class="grid-noGutter-middle-spaceBetween show-mobile-only filter-row2-mobile">
      <!-- ================================================= mobile checkbox -->
      <!-- <CheckboxFullyStored
        :options="filters.fullyStored"
        class="col-6_mi-12 datasets-checkbox" /> -->
      <!-- ===================================================== mobile sort -->
      <Sort
        :options="sortOptions"
        class="col-6_mi-12"
        @filterApplied="refreshDatasetList" />
    </div>

    <!-- filter row2 desktop only: results count, selected filters, layout button selection -->
    <div class="grid-middle-noGutter-spaceBetween filter-row2 show-desktop-only">
      <div class="col-8">
        <div class="button-list-panel">
          <span class="datasets-results">{{ resultCount }}</span>
          <ButtonFilters
            v-for="(option, index) in selectedFilterOptions"
            :key="`${option.value}-${index}`"
            :selected="true"
            class="filter-button"
            @clicked="deselectFilterOption(option)">
            {{ option.label }}
          </ButtonFilters>
        </div>
      </div>

      <div class="col-4 flex-end">
        <Button
          :button="{type: 'outline'}"
          @clicked="clearAllFilters">
          {{ datasetContent.clearAllFilters }}
        </Button>
        <button
          :class="['button-layout button-layout-grid', layout === 'grid' ? 'selected' : '']"
          @click="updateLayout('grid')">
          <GridIcon />
        </button>
        <button
          :class="['button-layout button-layout-list', layout === 'list' ? 'selected' : '']"
          @click="updateLayout('list')">
          <ListIcon />
        </button>
      </div>
    </div>

    <!-- ================================================= cards - no result -->
    <div v-if="noResults" class="grid-middle-center no-results">
      <h3 class="col-8">
        {{ datasetContent.empty }}
      </h3>
    </div>

    <!-- ============================================================= cards -->
    <div :class="`selected-layout-${layout}`">
      <div class="grid-4-equalHeight_lg-3_md-2_sm-1 layout-grid">
        <DatasetsCardGrid
          v-for="(data, index) in datasetList"
          :key="`dataset-${index}`"
          :data="data"
          :labels1="datasetContent.gridLayout.labels1"
          :labels2="datasetContent.gridLayout.labels2" />
      </div>
      <div class="grid-1-equalHeight layout-list">
        <DatasetsCardList
          v-for="(data, index) in datasetList"
          :key="`dataset-${index}`"
          :data="data"
          :labels1="datasetContent.listLayout.labels1"
          :labels2="datasetContent.listLayout.labels2" />
      </div>
    </div>

    <!-- ======================================================== pagination -->
    <div class="grid-center-noGutter-middle pagination">
      <div class="col-5_md-12">
        <PaginationControls
          v-if="totalPages > 1"
          :page="page"
          :total-pages="totalPages"
          :loading="dataLoading"
          @filterApplied="getDatasetList({ route: $route, resetPage: false })" />
      </div>
      <div class="col-5_md-12 flex-end">
        <ResultsPerPage
          v-if="totalPages > 1"
          :options="limitOptions"
          @filterApplied="getDatasetList({ route: $route, resetPage: false })" />
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
// import CheckboxFullyStored from '@/components/checkbox-fully-stored'
import Sort from '@/components/sort'
import ButtonFilters from '@/components/buttons/button-filters'
import Button from '@/components/buttons/button'
import GridIcon from '@/components/icons/grid'
import ListIcon from '@/components/icons/list'

// ====================================================================== Export
export default {
  name: 'PageIndex',

  components: {
    BlockBuilder,
    DatasetsCardGrid,
    DatasetsCardList,
    // CheckboxFullyStored,
    Filters,
    Button,
    Searchbar,
    PaginationControls,
    ResultsPerPage,
    ButtonFilters,
    GridIcon,
    ListIcon,
    Sort
  },

  data () {
    return {
      tag: 'index',
      layout: (this.$ls && this.$ls.get('layout')) ? this.$ls.get('layout') : 'grid'
    }
  },

  async fetch ({ app, store, route, error }) {
    await store.dispatch('general/getBaseData', { key: 'index', data: IndexPageData })
    await store.dispatch('datasets/getFiltersAndTypeahead')
    await store.dispatch('datasets/getDatasetList', { route })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      filters: 'datasets/filters',
      sortOptions: 'datasets/sortOptions',
      limitOptions: 'datasets/limitOptions',
      loading: 'datasets/loading',
      metadata: 'datasets/metadata',
      datasetList: 'datasets/datasetList'
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
    dataLoading () {
      return this.loading
    },
    count () {
      return this.metadata.count
    },
    resultCount () {
      const count = this.count
      if (!count) { return '0 Results' }
      if (count === 1) { return '1 Result' }
      return `${count} Results`
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
    selectedFilterOptions () {
      const filters = ['categories', 'licenses', 'fileExtensions']
      const len = filters.length
      let selected = []
      for (let i = 0; i < len; i++) {
        selected = selected.concat(
          this.$filter(filters[i]).getSelectionOptions()
        )
      }
      return selected
    }
  },

  watch: {
    datasetList () {
      this.stopLoading()
    }
  },

  mounted () {
    this.stopLoading()
    this.scrollToResultList()
  },

  methods: {
    ...mapActions({
      resetStore: 'datasets/resetStore',
      setLoadingStatus: 'datasets/setLoadingStatus',
      getDatasetList: 'datasets/getDatasetList'
    }),
    stopLoading () {
      this.$nextTick(() => {
        if (typeof this.datasetList !== 'boolean') {
          this.setLoadingStatus({ status: false })
        }
      })
    },
    updateLayout (layout) {
      this.$ls.set('layout', layout)
      this.layout = layout
    },
    async deselectFilterOption (option) {
      await this.$filter(option.filterKey).toggleTerm({
        index: option.index
      })
      this.refreshDatasetList()
    },
    refreshDatasetList () {
      this.getDatasetList({ route: this.$route, resetPage: true })
    },
    async clearAllFilters () {
      await this.$clearSearchAndFilters(['categories', 'licenses', 'fileExtensions', 'sort', 'limit', 'fullyStored'])
      this.refreshDatasetList()
    },
    /**
     * If search and filters are not empty, scroll to the results section
     */
    scrollToResultList () {
      const filterSelectionsExist = this.$checkIfFilterSelectionsExist(['categories', 'licenses', 'fileExtensions', 'fullyStored'])
      const searchExists = !this.$search('search').isEmpty()
      if (filterSelectionsExist || searchExists) {
        this.$scrollToElement(document.getElementById('datasets'), 200, -50)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.home-hero) {
  padding-bottom: toRem(60);
  @include medium {
    padding-bottom: 0;
  }
  [data-block-id="col_2"] {
    .text-block {
      margin-left: $singleColumn;
      margin-top: toRem(90);
      @include medium {
        margin-left: 0;
        margin-top: toRem(20);
      }
    }
  }
  [data-block-id="col_1"] {
    .image-block {
      margin-top: -10%;
    }
  }
  @include medium {
    .button-row {
      display: none;
    }
  }
}

.pagination {
  margin-top: toRem(50);
  @include medium {
    > div {
      display: flex;
      justify-content: center;
      &:first-child {
        margin-bottom: toRem(20);
      }
    }
    :deep(#pagination-controls) {
      display: flex;
      justify-content: center;
    }
  }
}

.filter-heading,
.filter-row1 {
  margin-bottom: toRem(20);
  @include mini {
        margin-bottom: toRem(10);
      }
}

.filter-row2-mobile {
  margin-bottom: toRem(25);
  :deep(.field-select) {
    width: 100%;
  }
  .datasets-checkbox {
    @include mini {
      margin-bottom: toRem(10);
    }
  }
}
.filter-row2 {
  margin-bottom: toRem(55);
}

.filter-row1 {
  .datasets-search-c {
    display: flex;
    align-items: center;
    .datasets-searchbar {
      max-width: toRem(400);
      margin-right: toRem(17);
      @include medium {
        margin-right: 0;
        width: 100%;
        max-width: none;
      }
      @include mini {
        margin-bottom: toRem(10);
      }
    }
  }
  .datasets-sort-c {
    @include mini {
      :deep(.button-filter) {
        width: 100%;
      }
    }
    @include customMinMQ($breakpoint_Mini) {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  @include medium {
    flex-basis: auto;
    max-width: none;
  }
}

.filter-row2 {
  .datasets-results {
    margin-right: toRem(20);
    margin-bottom: 0.5rem;
  }
}

.button-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: toRem(10);
  width: toRem(36);
  height: toRem(36);
  margin-left: toRem(10);
  :deep(path) {
    fill: $rangoonGreen;
  }
  &.selected {
    background-color: $rangoonGreen;
    :deep(path) {
      fill: white;
    }
  }
  &.button-layout-grid {
    margin-left: toRem(20);
  }
}

.no-results {
  text-align: center;
}

.selected-layout-grid {
  .layout-grid {
    display: flex;
  }
  .layout-list {
    display: none;
  }
}

.selected-layout-list {
  .layout-list {
    display: flex;
    @include medium {
      display: none;
    }
  }
  .layout-grid {
    display: none;
    @include medium {
      display: flex;
    }
  }
}

.button-list-panel {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 0.25rem;
}

.filter-button {
  margin-bottom: 0.5rem;
}
</style>
