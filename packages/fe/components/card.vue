<template>
  <div class="col">
    <div class="card">
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
            {{ data[key] || '-' }}
          </div>
        </div>
      </div>

      <div v-if="labels2" class="card-details">
        <div
          v-for="(label, key) in labels2"
          :key="key"
          class="grid-noGutter card-details-row">
          <div class="caption col-6">
            {{ label }}
          </div>
          <div
            v-if="key === 'locations'"
            class="col-6">
            <span v-if="!data[key]" class="card-data">-</span>
            <span
              v-for="(item, index) in data[key]"
              :key="index">
              {{ $getFlagIcon(item.country_code) }}
            </span>
          </div>
          <div
            v-if="key === 'file_extensions'"
            class="col-6">
            <span v-if="!data[key]" class="card-data">-</span>
            <span
              v-for="(item, index) in data[key]"
              :key="index">
              {{ item }}
            </span>
          </div>
        </div>
        <Button
          :button="{
            type: 'solid',
            href: `/dataset/${data.id}`,
            text: 'View dataset'
          }" />
      </div>

    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import Button from '@/components/buttons/button'

// ====================================================================== Export
export default {
  name: 'Card',

  components: {
    Button
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
  background-color: white;
  border-bottom-left-radius: toRem(10);
  border-bottom-right-radius: toRem(40);
  border-top-right-radius: toRem(10);
  @include shadow2;
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
  border-top: 1px solid $lavenderGray;
  .card-details-row {
    margin-bottom: toRem(12);
  }
  .card-data {
    @include caption;
    @include fontWeight_Bold;
  }
}
</style>
