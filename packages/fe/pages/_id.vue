<template>
  <div class="page page-singular">

    <!-- ============================================================ HEADER -->
    <section id="section-header">
      <div class="grid">

        <div class="col-3" data-push-left="off-1">
          <ImageBlock :block="headerImage" />
        </div>

        <div class="col-6" data-push-right="off-2">
          <div class="header-matter">

            <div class="message-banner"></div>

            <h1 class="heading">
              {{ heading }}
            </h1>

            <div class="tag-list"></div>

          </div>
        </div>

      </div>
    </section>

    <!-- ============================================================= INTRO -->
    <section id="section-intro">
      <div class="grid">

        <div class="col-6" data-push-left="off-1">

          <TextBlock :block="descriptionBlock" />

          <div class="stats-card-list">
            <CardCutout
              v-for="stat in stats"
              :key="stat.label"
              class="stat-card">
              <div class="stat-inner-wrapper">
                <div class="icon">
                  {{ stat.icon }}
                </div>
                <div>
                  <h3 class="heading">
                    {{ stat.data }}
                  </h3>
                  <div class="label">
                    {{ stat.label }}
                  </div>
                </div>
              </div>
            </CardCutout>
          </div>

        </div>

        <div class="col-4" data-push-left="off-1">
          <div class="dataset-info-card">
            <CardCutout>
              <div class="info-card">

                <div class="resources">
                  <h6>
                    Resources
                  </h6>
                  <div class="links">
                    <a
                      v-for="(link, i) in resources"
                      :key="`resource-${i}`"
                      :href="link">
                      {{ link }}
                    </a>
                  </div>
                </div>

                <div class="information">

                  <h6>
                    Information
                  </h6>

                  <div class="info-items">
                    <div
                      v-for="(item, i) in infoItems"
                      :key="`info-${i}`"
                      class="row">
                      <div class="label">
                        {{ item.label }}
                      </div>
                      <div class="value">
                        {{ item.value }}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </CardCutout>
          </div>
        </div>

      </div>
    </section>

    <!-- ======================================================= SP EXPLORER -->
    <section id="section-explorer">
      <div class="grid">
        <div class="col-10" data-push-left="off-1" data-push-right="off-1">
        </div>
      </div>
    </section>

  </div>
</template>

<script>
// ====================================================================== Import
import { mapGetters } from 'vuex'

import ImageBlock from '@/components/blocks/image-block'
import TextBlock from '@/components/blocks/text-block'
import CardCutout from '@/components/card-cutout'

// ====================================================================== Export
export default {
  name: 'SingularPage',

  components: {
    ImageBlock,
    TextBlock,
    CardCutout
  },

  data () {
    const id = this.$route.params.id
    return {
      id
    }
  },

  async fetch ({ store, route }) {
    await store.dispatch('general/getBaseData', 'general')
    await store.dispatch('datasets/getDatasetList', { route })
  },

  // head () {
  //   return this.$compileSeo(this.$getSeo(this.tag))
  // },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      datasetList: 'datasets/datasetList'
    }),
    dataset () {
      return this.datasetList[0] ? this.datasetList[0] : {}
    },
    headerImage () {
      return {
        src: '/images/singular-page/genome-in-a-bottle.png',
        alt: ''
      }
    },
    heading () {
      return this.dataset.name
    },
    descriptionBlock () {
      return {
        description: this.dataset.description
      }
    },
    datasetSize () {
      return this.dataset.data_size
    },
    totalData () {
      return '3.9 PiB'
    },
    storageProviders () {
      return 83
    },
    stats () {
      const stats = []
      if (this.datasetSize) {
        stats.push({ icon: 'bar-graph', data: this.$formatBytes(this.datasetSize), label: 'Dataset Size' })
      }
      if (this.totalData) {
        stats.push({ icon: 'pie-chart', data: this.totalData, label: 'Total Data on Network' })
      }
      if (this.storageProviders) {
        stats.push({ icon: 'profile', data: this.storageProviders, label: 'Storage Providers' })
      }
      return stats
    },
    resources () {
      return [this.dataset.documentation_url]
    },
    infoItems () {
      const claimant = this.dataset.claimant ? this.dataset.claimant.firstName : ''
      const extensions = Array.isArray(this.dataset.file_extensions) ? this.dataset.file_extensions : ''
      return [
        { label: 'Author', value: claimant },
        { label: 'Date Created', value: this.$moment(this.dataset.createdAt, 'YYYY') },
        { label: 'Funder', value: '' },
        { label: 'File Types', value: extensions.split(',').map(ext => ext.replaceAll(' ', '')) },
        { label: 'Data Stored', value: false },
        { label: 'Storage Providers', value: this.storageProviders },
        { label: 'Locations', value: this.dataset.region }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General

// ///////////////////////////////////////////////////////////////////// SECTION
// ---------------------------------------------------------------------[HEADER]
#section-header {
  margin-bottom: toRem(42);
}

:deep(.image-block) {
  margin-right: toRem(44);
}

.header-matter {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  .heading {
    @include h2;
  }
}

// ///////////////////////////////////////////////////////////////////// SECTION
// ----------------------------------------------------------------------[INTRO]
:deep(.text-block) {
  padding-top: 1.625rem;
  margin-bottom: 4rem;
  .description {
    p {
      @include p2;
    }
  }
}

.stats-card-list {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.stat-card {
  padding: 1.125rem 1.3125rem;
  width: calc(33.333% - 0.9375rem);
  &:not(:last-child) {
    margin-right: 1.375rem;
  }
  .heading {
    font-size: toRem(30);
    line-height: leading(45, 30);
  }
  .label {
    @include p2;
    white-space: nowrap;
    letter-spacing: 0;
  }
  :deep(.card-contents) {
    height: 100%;
  }
}

.stat-inner-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.info-card {
  padding: 1.625rem;
}

.info-items {
  display: flex;
  flex-direction: column;
  .row {
    display: flex;
    flex-direction: row;
  }
}

</style>
