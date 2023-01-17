<template>
  <div class="col">
    <div class="card">
      <img class="card-img" :src="`/images/datasets/${data.id}.jpg`" />

      <div class="card-heading grid-noGutter">
        <div class="col-12 title">
          {{ data.title }}
        </div>
      </div>

      <div class="card-details">
        <div
          v-for="(label, key) in data1"
          :key="key"
          class="grid-noGutter">
          <div class="col-6">
            {{ label }}
          </div>
          <div class="col-6">
            {{ data[key] }}
          </div>
        </div>
      </div>

      <div class="card-details">
        <div
          v-for="(label, key) in data2"
          :key="key"
          class="grid-noGutter">
          <div class="col-6">
            {{ label }}
          </div>
          <div
            v-if="key === 'locations'"
            class="col-6">
            <span
              v-for="(item, index) in data[key]"
              :key="index">
              {{ $getFlagIcon(item.country_code) }}
            </span>
          </div>
          <div
            v-if="key === 'filetypes'"
            class="col-6">
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

// data key should match keys from here
const data1 = {
  cid: 'CIDs',
  replication: 'Replication Factor',
  size: 'Dataset Size',
  total: 'Total Data on Network',
  storage: 'Storage Providers'
}

const data2 = {
  filetypes: 'File Types',
  locations: 'Locations'
}

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
    }
  },

  data () {
    return {
      data1,
      data2
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
}
</style>
