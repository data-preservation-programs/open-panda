<template>
  <div class="cid-table">

    <div class="toolbar">
    </div>

    <div class="table">
      <CIDCard
        v-for="(cid, i) in cids"
        :key="`cid-${i}`"
        :data="cid" />
    </div>

    <div class="pagination">
    </div>

  </div>
</template>

<script>
// ====================================================================== Import
import CIDCard from '@/components/cid-card'

// ====================================================================== Export
export default {
  name: 'CIDTable',

  components: {
    CIDCard
  },

  data () {
    return {
      cids: [
        {
          title: 'Genome in a Bottle 001',
          hash: 'bafy3hde...b39ndo00',
          size: 32000000000,
          expires: 'Feb 27 2023',
          storage_providers: [
            {},
            {},
            {},
            {}
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
</style>
