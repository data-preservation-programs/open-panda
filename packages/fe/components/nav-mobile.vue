<template>
  <div class="mobile-nav-c">
    <div class="mobile-nav-inner">

      <!-- ====================================================== filter bar -->
      <div class="grid-noGutter mobile-nav-searchbar">
        <Filters class="col-12" :show-search="true" />
      </div>

      <!-- ============================================================= nav -->
      <div v-if="!$route.query.search" class="grid-noGutter">
        <Button
          v-for="(link, index) in header.nav"
          :key="index"
          :button="{
            text: link.label,
            selected: $isRouteCurrent($route, link.href ? link.href : null),
            disabled: typeof link.href === 'undefined' || link.href === '',
            url: link.href,
            tooltip: link.tooltip || ''
          }" />
      </div>

      <!-- =================================================== dataset cards -->
      <div v-if="$route.query.search" class="grid-noGutter">
        <h4 class="heading col-12">
          Datasets</h4>
        <div v-if="!metadata.count" class="no-result col-12">
          <h4>no results</h4>
        </div>
        <div
          v-for="(data, index) in datasetList"
          :key="`dataset-${index}`"
          class="col-12 result">
          <nuxt-link :to="`/dataset/${data.slug}`">
            <img class="card-img" :src="`/images/datasets/${data.slug}.jpg`" />
            <div class="grid">
              <div class="col-12 title" :title="data.name">
                {{ data.name }}
              </div>
              <div class="col-12">
                <span>
                  {{ data.data_size }}
                </span>
                <span>
                  Storage Providers
                  {{ data.storage }}
                </span>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// ====================================================================== Import
import { mapGetters, mapActions } from 'vuex'
import Button from '@/components/buttons/button'
import Filters from '@/components/filters'

// ====================================================================== Export
export default {
  name: 'NavMobile',

  components: {
    Button,
    Filters
  },

  props: {
    header: {
      type: Object,
      required: false,
      default: () => { }
    }
  },

  computed: {
    ...mapGetters({
      datasetList: 'datasets/datasetList',
      metadata: 'datasets/metadata'
    })
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

  methods: {
    ...mapActions({
      setLoadingStatus: 'datasets/setLoadingStatus',
      getDatasetList: 'datasets/getDatasetList'
    }),
    stopLoading () {
      this.$nextTick(() => {
        if (typeof this.datasetList !== 'boolean') {
          this.setLoadingStatus({ status: false })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.mobile-nav-c {
  background-color: white;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  overflow: hidden;
  display: none;
  z-index: 100;
  padding-top: toRem(100);
  @include medium {
    display: block;
  }
  .mobile-nav-inner {
    overflow: scroll;
    height: 100%;
  }
  .mobile-nav-searchbar {
    margin-bottom: toRem(50);
  }
  .heading {
    border-bottom: 1px solid $athensGray;
  }
  .result {
    display: flex;
  }
}

</style>
