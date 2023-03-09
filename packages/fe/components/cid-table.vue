<template>
  <div class="cid-table">

    <div
      v-if="cidList && cidList.length"
      class="toolbar">
    </div>

    <div :class="['table', { 'null-state': !cidList || !cidList.length }]">
      <template v-if="cidList && cidList.length">
        <CIDCard
          v-for="(cid, i) in cidList"
          :key="`cid-${i}`"
          :cid-data="cid"
          :mobile="mobileTable"
          :copy="copy.cidCard"
          :style="{ zIndex: cidList.length - i}" />
      </template>
      <template v-else>
        <h3 class="heading">
          {{ copy.notOnboarded }}
        </h3>
      </template>
    </div>

    <div
      v-if="cidList && cidList.length"
      class="pagination">
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

  props: {
    copy: {
      type: Object,
      required: true,
      default: () => ({})
    }
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

.table {
  &.null-state {
    padding: 1.8125rem 25%;
    @include small {
      padding: 1.8125rem 17%;
    }
    @include mini {
      padding: 1.8125rem 1rem;
    }
    @include tiny {
      padding: 1.8125rem 0;
    }
  }
  .heading {
    text-align: center;
    margin-bottom: 1.5rem;
  }
}
</style>
