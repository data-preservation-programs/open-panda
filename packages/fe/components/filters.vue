<template>
  <div v-click-outside="closePanel" :class="['filters', `direction-${openDirection}`, showSearch || showTypeahead ? 'has-search' : 'no-search', `theme-${theme}`]">

    <div class="button-c">
      <Searchbar
        v-if="showSearch || showTypeahead"
        :show-typeahead="showTypeahead"
        :placeholder="`Search ${datasetListTypeahead.length || '...'} datasets`"
        theme="solid"
        v-on="$listeners" />
      <button class="button-filter" @click="togglePanel">
        <FiltersIcon class="icon" />
        <div class="button-content">
          <span v-if="filterSelectionsExist" class="has-filters-dot"></span>
          <span>{{ filterPanelData.labels.buttonText }}</span>
        </div>
      </button>
    </div>

    <div v-if="open" class="filter-panel">
      <CardCutout>
        <section class="grid-noGutter-middle-spaceBetween">
          <h5>{{ filterPanelData.labels.add }}</h5>
          <button class="circle-border" @click="togglePanel">
            <IconClose :width="13" :height="13" />
          </button>
        </section>
        <Filterer
          v-for="(parentItem, parentIndex) in parentItems"
          :key="parentItem.id"
          :filter-key="parentItem.id"
          :filters="filters[parentItem.id]">
          <section
            slot-scope="{ applyFilter, isSelected }"
            class="grid-noGutter">
            <div class="filters-label col-12">
              <span>{{ parentItem.label }}</span>
            </div>

            <span
              v-for="(childItem, childIndex) in filters[parentItem.id]"
              :key="`${filters[parentIndex.id]}-${childIndex}`">
              <ButtonFilters
                v-if="childIndex < parentItem.limit"
                :selected="isSelected(childIndex)"
                class="filter-button"
                @clicked="applyFilter(childIndex)">
                {{ childItem.label }}
                <span v-if="childItem.count">&nbsp;({{ childItem.count }})</span>
              </ButtonFilters>
            </span>

            <ButtonToggle
              theme="light"
              :class="[{ active: parentItem.showMore }]"
              @click="toggleLimit(parentIndex, filters[parentItem.id])">
              {{ parentItem.showMore ? filterPanelData.labels.seeLess : filterPanelData.labels.seeMore }}
            </ButtonToggle>

          </section>
        </Filterer>
        <section class="grid-noGutter-right filter-button">
          <Button class="btn-clear" :button="{type: 'default'}" @click.native="clearAll">
            {{ filterPanelData.labels.clear }}
          </Button>
          <Button :button="{type:'solid'}" @click.native="onSearch">
            {{ filterPanelData.labels.search }}
          </Button>
        </section>
      </CardCutout>
    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Filterer from '@/modules/search/components/filterer'
import ButtonFilters from '@/components/buttons/button-filters'
import ButtonToggle from '@/components/buttons/button-toggle'
import Button from '@/components/buttons/button'
import CardCutout from '@/components/card-cutout'
import FiltersIcon from '@/components/icons/filter'
import IconClose from '@/components/icons/close'
import Searchbar from '@/components/searchbar'

// ====================================================================== Export
export default {
  name: 'Filters',

  components: {
    Filterer,
    ButtonFilters,
    ButtonToggle,
    Button,
    CardCutout,
    FiltersIcon,
    IconClose,
    Searchbar
  },

  props: {
    openDirection: {
      type: String,
      required: false,
      default: 'left'
    },
    theme: {
      type: String,
      required: false,
      default: 'solid'
    },
    showSearch: {
      type: Boolean,
      required: false,
      default: false
    },
    showTypeahead: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      open: false,
      parentItems: [{
        id: 'categories',
        label: 'Categories',
        limit: 10,
        showMore: false
      }, {
        id: 'licenses',
        label: 'Licenses',
        limit: 10,
        showMore: false
      }, {
        id: 'fileTypes',
        label: 'File Types',
        limit: 10,
        showMore: false
      }],
      filterSelectionsExist: false
    }
  },

  computed: {
    ...mapGetters({
      filters: 'datasets/filters',
      siteContent: 'general/siteContent',
      selectedFilters: 'search/filters',
      datasetListTypeahead: 'datasets/datasetListTypeahead'
    }),
    filterPanelData () {
      return this.siteContent.general ? this.siteContent.general.filterPanel : false
    }
  },

  watch: {
    '$route' () {
      this.filterSelectionsExist = !this.$filter.isEmpty(['categories', 'licenses', 'fileTypes'])
    }
  },

  methods: {
    ...mapActions({
      getDatasetList: 'datasets/getDatasetList'
    }),
    togglePanel () {
      this.open = !this.open
    },
    closePanel () {
      this.open = false
    },
    clearAll () {
      // do not clear fullyStored because that's outside the filter dropdown
      this.$filter.clearAll(['fullyStored'])
    },
    toggleLimit (index, child) {
      this.parentItems[index].limit = this.parentItems[index].showMore ? 10 : child.length
      this.parentItems[index].showMore = !this.parentItems[index].showMore
    },
    onSearch () {
      this.closePanel()
      this.getDatasetList({ route: this.$route })
      // need to emit this to close the modal
      this.$emit('filterPanelOnSearch')
      // go to home page and scroll to dataset section
      this.$router.push({
        path: '/',
        hash: '#datasets',
        query: this.$route.query
      })
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.button-toggle) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}

.filters {
  position: relative;
  @include fontWeight_Medium;
}

// main button toggle to open panel
.button-c {
  display: flex;
  height: toRem(50);
  .has-search & {
    @include shadow3;
    border-radius: toRem(30);
  }
  .button-filter {
    height: toRem(50);
    display: flex;
    align-items: center;
    @include fontSize_16;
    background-color: white;
    padding: toRem(15) toRem(28);
    border-radius: 0 toRem(30) toRem(30) 0;
    .no-search & {
      box-shadow: 0px 4px 34px rgba(81, 106, 130, 0.25);
      border-radius: toRem(30);
    }
    .has-search & {
      padding-left: toRem(20);
      border-left: 1px solid $tasman;
    }
    .icon {
      margin-right: toRem(15);
    }
    &:hover {
      background-color: $rangoonGreen;
      color: white;
      :deep(.icon path) {
        fill: white;
      }
    }
  }
  .button-content {
    position: relative;
    .has-filters-dot {
      background-color: $dodgerBlue;
      border-radius: 100%;
      position: absolute;
      width: toRem(10);
      height: toRem(10);
      top: toRem(-5);
      right: toRem(-12);
    }
  }
}

.theme-line {
  border: 1px solid $tasman;
  border-radius: toRem(30);
  :deep(.searchbar) {
    background-color: transparent;
  }
  &.has-search {
    .button-c {
      box-shadow: none;
    }
  }
}

// panel
.filter-panel {
  position: absolute;
  width: 70vw;
  max-width: toRem(800);
  right: 0;
  top: 120%;
  z-index: 100;
  @include medium {
    width: 88vw;
  }
  .direction-right & {
    left: 0;
    top: 135%;
  }
  section {
    padding: toRem(20) toRem(40);
    &:first-child {
      padding-bottom: toRem(15);
    }
    &:last-child {
      padding-bottom: toRem(10);
    }
    @include medium {
      padding: toRem(20);
    }
    border-bottom: 1px solid $athensGray;
    display: flex;
    &:last-child {
      border-bottom: 0;
    }
  }
  .header {
    justify-content: space-between;
  }
  .filters-label {
    margin-bottom: toRem(15);
    @include fontSize_20;
  }
}

.btn-clear {
  margin-right: toRem(30);
}

</style>
