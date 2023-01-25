<template>
  <CardCutout class="card col">
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
        <div class="caption">
          {{ label }}
        </div>
        <div class="card-data">
          {{ data[key] || '-' }}
        </div>
      </div>
    </div>

    <div v-if="labels2" class="card-details">
      <div
        v-for="(label, key) in labels2"
        :key="key"
        class="grid-noGutter card-details-row">
        <div class="caption">
          {{ label }}
        </div>
        <div
          v-if="key === 'locations'"
          class="">
          <span v-if="!data[key]" class="card-data">-</span>
          <span
            v-for="(item, index) in data[key]"
            :key="index">
            {{ $getFlagIcon(item.country_code) }}
          </span>
        </div>
        <div
          v-if="key === 'file_extensions'"
          class="">
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

  </CardCutout>
</template>

<script>
// ===================================================================== Imports
import Button from '@/components/buttons/button'
import CardCutout from '@/components/card-cutout'

// ====================================================================== Export
export default {
  name: 'DatasetsCardList',

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

</style>
