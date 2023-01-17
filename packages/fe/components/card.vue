<template>
  <div class="card col">
    <img src="" />

    <div class="card-heading">
      <h4>{{ title }}</h4>
    </div>

    <div class="card-details">
      {{ cid }}
      {{ replication }}
      {{ size }}
      {{ total_data }}
      {{ storage_provider }}
    </div>

    <div class="card-details">
      {{ fileTypes }}
      {{ locations }}
    </div>

    <Button
      :button="{
        type: 'solid',
        href: `/dataset/${id}`,
        text: 'View dataset'
      }" />
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
    title: {
      type: String,
      required: false,
      default: '⋯'
    },
    id: {
      type: String,
      required: true
    },
    cid: {
      type: Number,
      required: true
    },
    replication: {
      type: Number,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    totalData: {
      type: Number,
      required: true
    },
    storage: {
      type: Number,
      required: true
    },
    fileTypes: {
      type: Object,
      required: true
    },
    locations: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
