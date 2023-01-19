<template>
  <div
    ref="filtersContainer"
    class="filters">

    <!-- ////////////////////////////////////////////// Preparation Progress -->
    <Filterer
      filter-key="preparation_progress"
      :filters="filters.preparation_progress"
      @filterApplied="clearPage">
      <div
        slot-scope="{ applyFilter, empty, clearFilters, isSelected }"
        class="button-list section">

        <div class="filters-label">
          <span>Preparation Progress</span>
          <ButtonB
            v-if="!empty"
            format="tiny"
            class="clear-button"
            @clicked="clearFilters">
            <IconClose />
            <span>Clear</span>
          </ButtonB>
        </div>

        <ButtonB
          v-for="(item, index) in filters.preparation_progress"
          :key="`preparation-progress-${index}`"
          :selected="isSelected(item.value)"
          format="mini"
          theme="picklewoodblue"
          class="filter-button"
          @clicked="applyFilter(item.value)">
          {{ item.label }}
        </ButtonB>

      </div>
    </Filterer>

    <!-- //////////////////////////////////////////////////////////// Region -->
    <Filterer
      filter-key="region"
      :filters="filters.region"
      @filterApplied="clearPage">
      <div
        slot-scope="{ applyFilter, isSelected, empty, clearFilters }"
        class="button-list section">

        <div class="filters-label">
          <span>Region</span>
          <ButtonB
            v-if="!empty"
            format="tiny"
            class="clear-button"
            @clicked="clearFilters">
            <IconClose />
            <span>Clear</span>
          </ButtonB>
        </div>

        <ButtonB
          v-for="(item, index) in filters.region"
          :key="`region-${index}`"
          :selected="isSelected(item.value)"
          format="mini"
          theme="picklewoodblue"
          class="filter-button"
          @clicked="applyFilter(index)">
          {{ item.label }}
        </ButtonB>

      </div>
    </Filterer>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Filterer from '@/modules/search/components/filterer'
import ButtonB from '@/components/buttons/button-b'

import IconClose from '@/components/icons/close-thick'

// ====================================================================== Export
export default {
  name: 'Filters',

  components: {
    Filterer,
    ButtonB,
    IconClose
  },

  computed: {
    ...mapGetters({
      filters: 'modify/filters'
    })
  },

  methods: {
    ...mapActions({
      setPage: 'modify/setPage'
    }),
    clearPage () {
      this.setPage({ page: 1, tag: 'explorer' })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.section {
  &:not(:first-child) {
    margin-top: 2rem;
  }
}

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
