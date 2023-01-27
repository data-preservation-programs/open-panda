<template>
  <div class="cid-table">

    <div class="toolbar">
    </div>

    <div
      v-if="cidList"
      class="table">
      <CIDCard
        v-for="(cid, i) in cidList"
        :key="`cid-${i}`"
        :cid-data="cid"
        :mobile="mobileTable" />
    </div>

    <div class="pagination">
    </div>

  </div>
</template>

<script>
// ====================================================================== Import
import { mapGetters } from 'vuex'

import CIDCard from '@/components/cid-card'

// =================================================================== Functions
const handleTableResize = (instance) => {
  if (window.matchMedia('(max-width: 64rem)').matches) {
    if (!instance.mobileTable) {
      instance.mobileTable = true
    }
  } else {
    if (instance.mobileTable) {
      instance.mobileTable = false
    }
  }
}

// ====================================================================== Export
export default {
  name: 'CIDTable',

  components: {
    CIDCard
  },

  data () {
    return {
      mobileTable: false,
      resize: false
    }
  },

  computed: {
    ...mapGetters({
      cidList: 'dataset/cidList'
    })
  },

  mounted () {
    handleTableResize(this)
    this.resize = () => { handleTableResize(this) }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.card-cutout-wrapper) {
  margin-bottom: 1.875rem;
}
</style>
