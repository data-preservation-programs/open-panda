<template>
  <div class="mobile-nav-c">
    <div class="mobile-nav-inner">

      <!-- ====================================================== filter bar -->
      <div class="grid-noGutter-middle mobile-nav-searchbar">
        <button v-if="$route.query.search" class="circle-border" @click="$clearSearchAndFilters">
          <ArrowLeftIcon :width="20" :height="14" />
        </button>
        <Filters :show-search="true" theme="line" @searchbarUpdated="shouldCallEndpoint = true" @filterPanelOnSearch="setNavigationOpen(false)" />
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
            type: 'default',
            tooltip: link.tooltip || ''
          }"
          class="col-12 mobile-nav-buttons"
          @click.native="setNavigationOpen(false)" />
      </div>

      <!-- =================================================== dataset cards -->
      <div v-if="$route.query.search" class="grid-noGutter">
        <h4 class="heading col-12">
          {{ header.mobileNavFilter.datasets }}</h4>
        <div v-if="!metadata.count" class="no-result col-12">
          <p>{{ header.mobileNavFilter.noResults }}</p>
        </div>
        <div
          v-for="(data, index) in datasetList"
          :key="`dataset-${index}`"
          class="col-12 result"
          @click="goToPage(data.slug)">
          <div class="card-img" :style="`background-image: url(/images/datasets/${data.slug}.jpg)`" />
          <div class="card-data grid-noGutter">
            <div class="col-12 title" :title="data.name">
              {{ data.name }}
            </div>
            <div class="col-12 data">
              <span>
                {{ data.data_size }}
              </span>
              <span v-if="data.storage">
                {{ header.mobileNavFilter.storage }}
                <strong>{{ data.storage }}</strong>
              </span>
            </div>
            <div class="col-12 cat">
              <Button
                v-for="(cat, catIndex) in data.categories"
                :key="`cat-${catIndex}`"
                :button="{
                  text: cat,
                  type: 'outline'
                }" />
            </div>
          </div>
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
import ArrowLeftIcon from '@/components/icons/arrow-left'

// ====================================================================== Export
export default {
  name: 'NavMobile',

  components: {
    Button,
    Filters,
    ArrowLeftIcon
  },

  props: {
    header: {
      type: Object,
      required: false,
      default: () => { }
    }
  },

  data () {
    return {
      shouldCallEndpoint: false
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
      this.callGetDatasetList(route)
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
      getDatasetList: 'datasets/getDatasetList',
      setNavigationOpen: 'general/setNavigationOpen'
    }),
    stopLoading () {
      this.$nextTick(() => {
        if (typeof this.datasetList !== 'boolean') {
          this.setLoadingStatus({ status: false })
        }
      })
    },
    goToPage (slug) {
      this.$router.push({
        path: `/dataset/${slug}`
      }, this.setNavigationOpen(false))
    },
    callGetDatasetList (route) {
      /**
       * this.shouldCallEndpoint flag is here because @filterApplied gets triggered before the route has been registered
       * so we need to watch the route first and then call the endpoint if flag is true
       */
      if (this.shouldCallEndpoint) {
        this.getDatasetList({ route })
        this.shouldCallEndpoint = false
      }
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
    display: flex;
    .circle-border {
      margin-right: toRem(10);
      flex-shrink: 0;
    }
    :deep(.filters) {
      width: calc(100% - 50px);
      flex-grow: 1;
    }
  }
  .heading {
    border-bottom: 1px solid $athensGray;
  }
  .no-result {
    margin-top: toRem(10);
  }
  .result {
    display: flex;
    border-bottom: 1px solid $athensGray;
    padding: toRem(16) 0 toRem(11) 0;
    cursor: pointer;
  }
  .card-img {
    border-radius: 50%;
    border-bottom-left-radius: 0.125rem;
    width: toRem(45);
    height: toRem(45);
    background-size: cover;
    background-position: center center;
    background-color: $tasman;
    flex-shrink: 0;
  }
  .card-data {
    margin-left: toRem(20);
    .title {
      @include fontWeight_Medium;
      line-height: 1.3;
      margin-bottom: toRem(5);
    }
    .data {
      margin-bottom: toRem(5);
      @include fontSize_14;
      span {
        margin-right: toRem(20);
      }
    }
    .cat {
      :deep(.button) {
        margin-right: toRem(5);
        margin-bottom: toRem(5);
      }
    }
  }
  .mobile-nav-buttons {
    @include fontSize_24;
    margin-bottom: toRem(22);
    justify-content: left;
  }
}
</style>
