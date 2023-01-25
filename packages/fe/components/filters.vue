<template>
  <div class="filters">

    <button @click="togglePanel">
      Filters
    </button>

    <CardCutout v-if="open" class="filter-panel">
      <div class="header">
        <h3>Add Filters</h3>
        <button @click="togglePanel">
          close
        </button>
      </div>
      <Filterer
        v-for="(item, key) in filterPanelData.keys"
        :key="key"
        :filter-key="key"
        :filters="filters[key]"
        @filterApplied="clearPage">
        <div
          slot-scope="{ applyFilter, empty, clearFilters, isSelected }"
          class="button-list">
  
          <div class="filters-label">
            <span>{{ item }}</span>
            <ButtonFilters
              v-if="!empty"
              class="clear-button"
              @clicked="clearFilters">
              <IconClose />
              <span>Clear</span>
            </ButtonFilters>
          </div>
          <ButtonFilters
            v-for="(item2, index2) in filters[key]"
            :key="`${filters[key]}-${index2}`"
            :selected="isSelected(item2.value)"
            class="filter-button"
            @clicked="applyFilter(index2)">
            {{ item2.label }}
          </ButtonFilters>
        </div>
      </Filterer>

      <button @click="clearAll">
        clear
      </button>

      <button @click="onSearch">
        search
      </button>
    </CardCutout>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Filterer from '@/modules/search/components/filterer'
import ButtonFilters from '@/components/buttons/button-filters'
import CardCutout from '@/components/card-cutout'

import IconClose from '@/components/icons/close-thick'

// ====================================================================== Export
export default {
  name: 'Filters',

  components: {
    Filterer,
    ButtonFilters,
    IconClose,
    CardCutout
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
.filter-panel {
  position: absolute;
  max-width: toRem(960);
  width: 100%;
  right: 0;
  z-index: 100;
  padding: toRem(50);
}
</style>
