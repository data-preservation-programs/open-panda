<template>
  <div
    ref="filtersContainer"
    class="filters">

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
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Filterer from '@/modules/search/components/filterer'
import ButtonFilters from '@/components/buttons/button-filters'

import IconClose from '@/components/icons/close-thick'

// ====================================================================== Export
export default {
  name: 'Filters',

  components: {
    Filterer,
    ButtonFilters,
    IconClose
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
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.filters-label {
  margin-bottom: 1rem;
  font-weight: 500;
}

::v-deep .clear-button {
  margin-left: 0.25rem;
  &:hover {
    .svg-icon path {
      transition: 150ms ease-in;
      fill: red;
    }
  }
  .svg-icon {
    width: 8px;
    margin-right: 0.25rem;
    path {
      transition: 150ms ease-out;
      fill: $rangoonGreen;
    }
  }
}

.filters-button-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.filter-button:not([disabled]).selected,
.filter-button {
  margin-bottom: 0.5rem;
  &:not(:last-child) {
    margin-right: 0.5rem;
  }
}

</style>
