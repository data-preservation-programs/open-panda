<template>
  <div class="cid-table">

    <div class="toolbar">
      <Searchbar
        placeholder="Search for a file or storage provider"
        :loading="cidsLoading"
        :redirect-search="false"
        field-key="cid-search"
        theme="line"
        class="cids-searchbar" />
      <div class="checkboxes">
      </div>
    </div>

    <div :class="['table', { 'null-state': !cidList || !cidList.length }]">

      <template v-if="cidList && cidList.length">
        <CIDCard
          v-for="(cid, i) in cidList"
          :key="`cid-${i}`"
          :cid-data="cid"
          :mobile="mobileTable" />
      </template>

      <template v-else>
        <h3 class="heading">
          This dataset hasn’t been onboarded to the network yet
        </h3>
      </template>

    </div>

    <div class="pagination">

      <PaginationControls
        v-if="totalPages > 1"
        :page="page"
        :total-pages="totalPages"
        :loading="cidsLoading"
        @filterApplied="getCidList({ route: $route })" />

      <Limit
        v-if="totalPages > 1 && limitOptions"
        :options="limitOptions"
        @filterApplied="getCidList({ route: $route })" />

    </div>

  </div>
</template>

<script>
// ====================================================================== Import
import { mapGetters, mapActions } from 'vuex'

import CIDCard from '@/components/cid-card'
import PaginationControls from '@/components/pagination-controls'
import Limit from '@/components/limit'
import Searchbar from '@/components/searchbar'

// =================================================================== Functions
const handleTableResize = (instance) => {
  if (window.matchMedia('(max-width: 64rem)').matches) {
    if (!instance.mobileTable) {
      instance.mobileTable = true
    }
  } else {
    if (instance.mobileTable) {
      instance.mobileTable = false
    }
  }
}

// ====================================================================== Export
export default {
  name: 'CIDTable',

  components: {
    CIDCard,
    PaginationControls,
    Limit,
    Searchbar
  },

  data () {
    return {
      mobileTable: false,
      resize: false
    }
  },

  computed: {
    ...mapGetters({
      cidList: 'dataset/cidList',
      metadata: 'dataset/metadata',
      cidsLoading: 'dataset/loading',
      limitOptions: 'datasets/limitOptions'
    }),
    totalPages () {
      return this.metadata.totalPages
    },
    page () {
      return this.metadata.page
    }
  },

  watch: {
    '$route' () {
      this.$nextTick(() => {
        this.getCidList({ route: this.$route })
      })
    },
    cidList () {
      this.stopLoading()
    }
  },

  mounted () {
    handleTableResize(this)
    this.resize = () => { handleTableResize(this) }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    ...mapActions({
      getCidList: 'dataset/getCidList',
      setCidLoadingStatus: 'dataset/setCidLoadingStatus'
    }),
    stopLoading () {
      this.$nextTick(() => {
        if (typeof this.cidList !== 'boolean') {
          this.setCidLoadingStatus({ status: false })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.card-cutout-wrapper) {
  margin-bottom: 1.875rem;
}

.table {
  margin-bottom: 3.5rem;
  @include tiny {
    margin-bottom: 2.5rem;
  }
  &.null-state {
    padding: 1.8125rem 25%;
    @include small {
      padding: 1.8125rem 17%;
    }
    @include mini {
      padding: 1.8125rem 1rem;
    }
    @include tiny {
      padding: 1.8125rem 0;
    }
  }
  .heading {
    text-align: center;
    margin-bottom: 1.5rem;
  }
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  :deep(.searchbar) {
    flex-grow: 0;
    flex-direction: row-reverse;
    min-width: 24rem;
    .search-button {
      margin-left: 0.25rem;
      margin-right: 1.125rem;
    }
  }
}

.pagination {
  display: flex;
  justify-content: space-between;
  padding: 0 1.5625rem;
  @include medium {
    flex-direction: column;
    align-items: center;
  }
  @include mini {
    padding: 0;
  }
  :deep(#pagination-controls) {
    width: unset;
    @include tiny {
      width: 100%;
      padding: 0 0.5rem;
      justify-content: space-between;
    }
  }
  :deep(.field-wrapper) {
    @include medium {
      margin-top: 1.875rem;
    }
    .field-label {
      white-space: nowrap;
    }
  }
}
</style>
