<template>
  <div :class="['filters', `direction-${openDirection}`, showSearch ? 'has-search' : 'no-search']">

    <div class="button-c">
      <Searchbar
        v-if="showSearch"
        :placeholder="`Search ${basicStats.count__datasets__total || '...'} datasets`"
        theme="solid" />
      <button class="button-filter" @click="togglePanel">
        <FiltersIcon class="icon" />
        <div class="button-content">
          <span v-if="!$filter.isEmpty()" class="has-filters-dot"></span>
          <span>{{ filterPanelData.labels.buttonText }}</span>
        </div>
      </button>
    </div>

    <CardCutout v-if="open" class="filter-panel">
      <section class="grid-noGutter-spaceBetween">
        <h5>{{ filterPanelData.labels.add }}</h5>
        <button class="circle-border" @click="togglePanel">
          <IconClose :width="13" :height="13" />
        </button>
      </section>
      <Filterer
        v-for="(item, key) in filterPanelData.keys"
        :key="key"
        :filter-key="key"
        :filters="filters[key]"
        @filterApplied="clearPage">
        <section
          slot-scope="{ applyFilter, isSelected }"
          class="grid-noGutter">
          <div class="filters-label col-12">
            <span>{{ item }}</span>
          </div>
          <ButtonFilters
            v-for="(item2, index2) in filters[key]"
            :key="`${filters[key]}-${index2}`"
            :selected="isSelected(index2)"
            class="filter-button"
            @clicked="applyFilter(index2)">
            {{ item2.label }}
            <span v-if="item2.count">&nbsp;({{ item2.count }})</span>
          </ButtonFilters>
        </section>
      </Filterer>

      <section class="grid-noGutter-right filter-button">
        <Button :button="{}" @click.native="clearAll">
          {{ filterPanelData.labels.clear }}
        </Button>
        <Button :button="{type:'solid'}" @click.native="onSearch">
          {{ filterPanelData.labels.search }}
        </Button>
      </section>
    </CardCutout>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Filterer from '@/modules/search/components/filterer'
import ButtonFilters from '@/components/buttons/button-filters'
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
    showSearch: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      open: false
    }
  },

  computed: {
    ...mapGetters({
      filters: 'datasets/filters',
      siteContent: 'general/siteContent',
      basicStats: 'datasets/basicStats',
      selectedFilters: 'search/filters'
    }),
    filterPanelData () {
      return this.siteContent.general ? this.siteContent.general.filterPanel : false
    }
  },

  methods: {
    ...mapActions({
      setPage: 'datasets/setPage',
      getDatasetList: 'datasets/getDatasetList'
    }),
    clearPage () {
      this.setPage({ page: 1 })
    },
    togglePanel () {
      this.open = !this.open
    },
    clearAll () {
      // do not clear fullyStored because that's outside the filter dropdown
      this.$clearAllFilters('fullyStored')
    },
    onSearch () {
      this.open = false
      this.getDatasetList({ route: this.$route })
    }
  }
}
</script>

<style lang="scss" scoped>
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
      border-left: 1px solid $grayNurse;
    }
    .icon {
      margin-right: toRem(15);
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

// panel
.filter-panel {
  position: absolute;
  width: 70vw;
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
  .filter-button {
    margin-bottom: 0.5rem;
    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
  .filter-button {
    button {
      margin-left: toRem(30);
    }
  }
}

</style>
