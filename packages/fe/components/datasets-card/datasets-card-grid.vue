<template>
  <div class="col card">
    <CardCutout :background-image="computedData.img_url">
      <div
        class="card-img-wrapper">
        <div
          class="card-img"
          :style="{ 'background-image': `url('${computedData.img_url}')` }">
        </div>
      </div>

      <!-- heading -->
      <div class="card-heading grid-noGutter">
        <div class="col-12 title" :title="computedData.name">
          {{ computedData.name }}
        </div>
      </div>

      <!-- details: section 1 -->
      <div class="card-details">
        <div
          v-for="(label, key) in labels1"
          :key="key"
          class="grid-noGutter">
          <div class="caption col-6" data-push-right="off-1">
            {{ label }}
          </div>
          <div class="card-data col-5">
            {{ computedData[key] || '-' }}
          </div>
        </div>
      </div>

      <!-- details: section 2 file ext -->
      <div class="card-details">
        <div class="grid-noGutter card-details-row">
          <div class="col-12">
            <span class="caption caption-bold">
              {{ labels2.file_extensions }}
            </span>
            <span v-if="!fileExtData" class="card-data">-</span>
            <span v-for="(item, index) in fileExtData" :key="index">
              <span v-if="index < computedData.limit" class="file-item">
                {{ item }}
              </span>
            </span>
            <span>
              <button
                v-if="fileExtData.length > 1"
                class="file-item"
                @click="toggleLimit()">
                {{ computedData.showMore ? `-` : `+` }} {{ fileExtData.length - 1 }}
              </button>
            </span>
          </div>
        </div>

        <!-- details: section 2 locations -->
        <div class="grid-noGutter card-details-row">
          <div class="col-12">
            <span class="caption caption-bold">
              {{ labels2.locations }}
            </span>

            <span v-if="!locationsData" class="card-data">-</span>
            <span v-for="(item, index) in locationsData" :key="index">
              <span v-if="index < 6">
                {{ $getFlagIcon(item.country_code) }}
              </span>
            </span>

          </div>
        </div>
      </div>

      <!-- button -->
      <div class="card-button grid-noGutter-right">
        <Button
          :button="{
            type: 'solid',
            url: `/dataset/${computedData.slug}`,
            text: 'View dataset',
            icon: 'arrow'
          }">
        </Button>
      </div>
    </CardCutout>
  </div>
</template>

<script>
// ===================================================================== Imports
import { cloneDeep } from 'lodash'
import Button from '@/components/buttons/button'
import CardCutout from '@/components/card-cutout'

// ====================================================================== Export
export default {
  name: 'DatasetsCardGrid',

  components: {
    Button,
    CardCutout
  },

  props: {
    data: {
      type: Object,
      required: true
    },
    labels1: {
      type: Object,
      required: true
    },
    labels2: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  computed: {
    computedData () {
      const data = cloneDeep(this.data)
      data.limit = 1
      data.showMore = false
      return data
    },
    fileExtData () {
      return this.computedData.file_extensions
    },
    locationsData () {
      return this.computedData.locations
    }
  },

  methods: {
    toggleLimit () {
      this.computedData.limit = this.computedData.showMore ? 1 : this.fileExtData.length
      this.computedData.showMore = !this.computedData.showMore
      this.$forceUpdate()
    }
  }

}
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: toRem(10);
}
.card-img-wrapper {
  height: toRem(113);
  overflow: hidden;
  border-top-right-radius: toRem(10);
}
.card-img {
  background-color: $tasman;
  height: toRem(122);
  object-fit: cover;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  transform: translateY(-9px);
  @include medium {
    height: toRem(118);
    transform: translateY(-4.5px);
  }
}
.card-heading,
.card-details {
  padding: toRem(20);
}
.card-button {
  padding: toRem(10) toRem(20);
}
.card-heading {
  min-height: toRem(116.5);
  .title {
    line-height: leading(26, 17);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
.card-details {
  border-top: 1px solid $athensGray;
  .card-details-row {
    margin-bottom: toRem(12);
  }
  .file-item {
    margin-bottom: toRem(9);
  }
}
</style>
