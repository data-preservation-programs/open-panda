<template>
  <div :class="['dataset-lister', `selected-layout-${layout}`]">

    <div class="grid-4-equalHeight_lg-3_md-2_sm-1 layout-grid">
      <CardGrid
        v-for="(card, index) in datasetList"
        :key="`card-grid-${index}`"
        :card="card"
        :labels="pageContent.layouts.grid.labels" />
    </div>

    <div class="grid-1-equalHeight layout-list">
      <CardList
        v-for="(card, index) in datasetList"
        :key="`card-list-${index}`"
        :card="card"
        :labels="pageContent.layouts.list.labels" />
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import CardGrid from '@/components/page-home/datasets-card-grid'
import CardList from '@/components/page-home/datasets-card-list'

// ====================================================================== Export
export default {
  name: 'Toolbar',

  components: {
    CardGrid,
    CardList
  },

  props: {
    pageContent: {
      type: Object,
      required: true
    },
    layout: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      datasetList: 'datasets/datasetList'
    })
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// Layouts
.dataset-lister {
  &.selected-layout-list {
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
  .layout-list {
    display: none;
  }
}
</style>
