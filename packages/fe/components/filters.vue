<template>
  <div class="filters">

    <button class="button-filter" @click="togglePanel">
      <FiltersIcon class="icon" />
      <span>Filters</span>
    </button>

    <CardCutout v-if="open" class="filter-panel">
      <section class="grid-noGutter-spaceBetween">
        <h5>Add Filters</h5>
        <button @click="togglePanel">
          <IconClose />
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
            :selected="isSelected(item2.value)"
            class="filter-button"
            @clicked="applyFilter(index2)">
            {{ item2.label }}
            <span v-if="item2.count">&nbsp;({{ item2.count }})</span>
          </ButtonFilters>
        </section>
      </Filterer>

      <section class="grid-noGutter-right">
        <button @click="clearAll">
          clear
        </button>
        <button @click="onSearch">
          search
        </button>
      </section>
    </CardCutout>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Filterer from '@/modules/search/components/filterer'
import ButtonFilters from '@/components/buttons/button-filters'
import CardCutout from '@/components/card-cutout'
import FiltersIcon from '@/components/icons/filter'
import IconClose from '@/components/icons/close'

// ====================================================================== Export
export default {
  name: 'Filters',

  components: {
    Filterer,
    ButtonFilters,
    CardCutout,
    FiltersIcon,
    IconClose
  },

  data () {
    return {
      open: false
    }
  },

  computed: {
    ...mapGetters({
      filters: 'datasets/filters',
      siteContent: 'general/siteContent'
    }),
    filterPanelData () {
      return this.siteContent.general ? this.siteContent.general.filterPanel : false
    }
  },

  methods: {
    ...mapActions({
      setPage: 'datasets/setPage'
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
      console.log('onSearch panel')
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
.button-filter {
  display: flex;
  background-color: white;
  padding: toRem(15) toRem(28);
  box-shadow: 0px 4px 34px rgba(81, 106, 130, 0.25);
  border-radius: toRem(30);
  align-items: center;
  @include fontSize_16;
  .icon {
    margin-right: toRem(15);
  }
}
.filter-panel {
  position: absolute;
  width: 70vw;
  right: 0;
  top: 120%;
  z-index: 100;
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
}

</style>
