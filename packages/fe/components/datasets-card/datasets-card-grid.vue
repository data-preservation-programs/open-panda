<template>
  <div class="col card">
    <CardCutout>
      <img class="card-img" :src="`/images/datasets/${data.slug}.jpg`" />

      <div class="card-heading grid-noGutter">
        <div class="col-12 title">
          {{ data.name }}
        </div>
      </div>

      <div class="card-details">
        <div
          v-for="(label, key) in labels1"
          :key="key"
          class="grid-noGutter card-details-row">
          <div class="caption col-6" data-push-right="off-1">
            {{ label }}
          </div>
          <div class="card-data col-5">
            {{ (key === 'data_size') ? $formatBytes(data[key]) : data[key] || '-' }}
          </div>
        </div>
      </div>

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
                {{ $getFlagIcon(item.country_code) }}
              </span>
            </span>
            <span v-if="key === 'file_extensions'">
              <span v-if="!data[key]" class="card-data">-</span>
              <span
                v-for="(item, index) in data[key].split(',').map(ext => ext.replaceAll(' ', ''))"
                :key="index"
                class="file-item">
                {{ item }}
              </span>
            </span>
          </div>
        </div>
        <Button
          :button="{
            type: 'solid',
            url: `/${data.slug}`,
            text: 'View dataset'
          }" />
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
.col {
  margin-bottom: toRem(10);
}
.card-img {
  background-color: $rangoonGreen;
  height: toRem(125);
  object-fit: cover;
  border-top-right-radius: toRem(10);
}
.card-heading,
.card-details {
  padding: toRem(20);
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
  .card-data {
    @include caption;
    @include fontWeight_Bold;
  }
  .caption {
    margin-right: toRem(12);
    &.caption-bold {
      @include fontWeight_Medium;
    }
  }
}
</style>
