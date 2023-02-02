<template>
  <div class="col card">
    <CardCutout :background-image="`/images/datasets/${data.slug}.jpg`">
      <div
        class="card-img-wrapper">
        <div
          class="card-img"
          :style="{ 'background-image': `url('/images/datasets/${data.slug}.jpg')` }">
        </div>
      </div>

      <!-- heading -->
      <div class="card-heading grid-noGutter">
        <div class="col-12 title" :title="data.name">
          {{ data.name }}
        </div>
      </div>

      <!-- details: section 1 -->
      <div class="card-details">
        <div
          v-for="(label, key) in labels1"
          :key="key"
          class="grid-noGutter card-details-row">
          <div class="caption col-6" data-push-right="off-1">
            {{ label }}
          </div>
          <div class="card-data col-5">
            {{ data[key] || '-' }}
          </div>
        </div>
      </div>

      <!-- details: section 2 -->
      <div v-if="labels2" class="card-details">
        <div
          v-for="(label, key) in labels2"
          :key="key"
          class="grid-noGutter card-details-row">
          <div class="col-12">
            <span class="caption caption-bold">
              {{ label }}
            </span>
            <span v-if="key === 'locations'">
              <span v-if="!data[key]" class="card-data">-</span>
              <span
                v-for="(item, index) in data[key]"
                :key="index">
                <span v-if="index < 6">
                  {{ $getFlagIcon(item.country_code) }}
                </span>
              </span>
            </span>
            <span v-if="key === 'file_extensions'">
              <span v-if="!data[key]" class="card-data">-</span>
              <span
                v-for="(item, index) in data[key]"
                :key="index">
                <span v-if="index < 3" class="file-item">
                  {{ item }}
                </span>
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
            url: `/dataset/${data.slug}`,
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
}
</style>
