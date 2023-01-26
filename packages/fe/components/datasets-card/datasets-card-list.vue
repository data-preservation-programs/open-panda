<template>
  <CardCutout class="card col">
    
    <div class="grid-noGutter-middle">
      <div class="col-1">
        <img class="card-img" :src="`/images/datasets/${data.slug}.jpg`" />
      </div>
      <div class="col-9">
        <div class="title">
          {{ data.name }}
        </div>
        <div class="card-details">
          <span
            v-for="(label, key) in labels1"
            :key="key"
            class="">
            <span class="caption">
              {{ label }}
            </span>
            <span class="card-data">
              {{ data[key] || '-' }}
            </span>
          </span>
        </div>

        <div v-if="labels2" class="card-details">
          <span
            v-for="(label, key) in labels2"
            :key="key"
            class="">
            <span class="caption">
              {{ label }}
            </span>
            <span
              v-if="key === 'locations'"
              class="">
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
                v-for="(item, index) in data[key]"
                :key="index"
                class="file-item">
                {{ item }}
              </span>
            </span>
          </span>
        </div>
        
      </div>
      <div class="col-2">
        <Button
          :button="{
            type: 'solid',
            url: `/dataset/${data.id}`,
            text: 'View dataset'
          }" />
      </div>
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
