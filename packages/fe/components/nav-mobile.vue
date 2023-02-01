<template>
  <div class="mobile-nav-c">
    <div class="mobile-nav-inner">

      <!-- ====================================================== filter bar -->
      <div class="grid-noGutter mobile-nav-searchbar">
        <Filters class="col-12" :show-search="true" theme="line" />
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
          Datasets</h4>
        <div v-if="!metadata.count" class="no-result col-12">
          <h4>no results</h4>
        </div>
        <div
          v-for="(data, index) in datasetList"
          :key="`dataset-${index}`"
          class="col-12 result">
          <nuxt-link :to="`/${data.slug}`" @click.native="setNavigationOpen(false)">
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
                  Storage Providers
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
      getDatasetList: 'datasets/getDatasetList',
      setNavigationOpen: 'general/setNavigationOpen'
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
  .result a {
    display: flex;
    border-bottom: 1px solid $athensGray;
    padding: toRem(16) 0 toRem(11) 0;
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
