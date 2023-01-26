<template>
  <div class="col card">
    <CardCutout>
      <img class="card-img" :src="`/images/datasets/${data.slug}.jpg`" />

      <!-- heading -->
      <div class="card-heading grid-noGutter">
        <div class="col-12 title">
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
            {{ (key === 'data_size') ? $formatBytes(data[key]) : data[key] || '-' }}
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
            url: `/${data.slug}`,
            text: 'View dataset'
          }">
          <ArrowRightIcon class="icon" />
        </Button>
      </div>
    </CardCutout>
  </div>
</template>

<script>
// ===================================================================== Imports
import Button from '@/components/buttons/button'
import CardCutout from '@/components/card-cutout'
import ArrowRightIcon from '@/components/icons/arrow-right'

// ====================================================================== Export
export default {
  name: 'DatasetsCardGrid',

  components: {
    Button,
    CardCutout,
    ArrowRightIcon
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
.card-button {
  padding: toRem(10) toRem(20);
  :deep(.button) {
    .icon {
      transition: transform 100ms ease-out;
      margin-left: toRem(15);
      transform: rotate(-40deg);
    }
  }
  &:hover {
    :deep(.button) {
      .icon {
        transition: transform 100ms ease-in;
        transform: rotate(0);
      }
    }
  }
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
