<template>
  <div class="col card">
    <CardCutout>
      <div class="card-inner grid-noGutter-middle">
        <img class="card-img col-1" :src="`/images/datasets/${data.slug}.jpg`" />
        <div class="col-11">
          <div class="card-details-c grid-noGutter-middle-bottom-spaceBetween">
            <div class="card-details">
              <div class="title">
                {{ data.name }}
              </div>
              <div class="card-details-row">
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
    
              <div v-if="labels2" class="card-details-row">
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
            <div class="card-button">
              <Button
                :button="{
                  type: 'solid',
                  url: `/dataset/${data.id}`,
                  text: 'View dataset'
                }" />
            </div>
          </div>
        </div>
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
.card {
  margin-bottom: toRem(10);
}
.card-inner {
  padding: toRem(25);
}
.card-img {
  background-color: $tasman;
  height: toRem(100);
  width: toRem(100);
  border-radius: toRem(2);
  object-fit: cover;
}
.card-details-c {
  padding-left: toRem(60)
}
</style>
