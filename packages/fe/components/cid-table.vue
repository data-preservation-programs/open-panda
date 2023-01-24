<template>
  <div class="cid-table">

    <div class="toolbar">
    </div>

    <div class="table">
      <CIDCard
        v-for="(cid, i) in mockCids"
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
import CloneDeep from 'lodash/cloneDeep'

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
      resize: false,
      cids: [
        {
          title: 'Genome in a Bottle 001',
          hash: 'bafy3hde...b39ndo00',
          filetypes: 'xml, txt, csv',
          size: 32000000000,
          expires: 'Feb 27 2023',
          storage_providers: [
            {
              id: 'F0123431',
              dealId: '1472881',
              location: 'GB',
              expiry_date: 'Feb 27 2023',
              retrieval_rate: '100%',
              retrieval_commands: [
                'lotus client retrieve --miner f022352 baga6ea4seaqih7gfqvkpvez3qlbajjolszk7vfqaatt5m2rdef52p3fq4jfpigi publicdomainmovies.tar.01',
                'pow ffs get baga6ea4seaqih7gfqvkpvez3qlbajjolszk7vfqaatt5m2rdef52p3fq4jfpigi retrieval.png'
              ]
            },
            {
              id: 'F0123123',
              dealId: '1438903',
              location: 'GB',
              expiry_date: 'Feb 28 2023',
              retrieval_rate: '100%',
              retrieval_commands: [
                'lotus client retrieve --miner f022352 b356c864441e1ca71dd4fe1fc455862350f6798c1f966a90ea3fcf60713b3548 publicdomainmovies.tar.01',
                'pow ffs get b356c864441e1ca71dd4fe1fc455862350f6798c1f966a90ea3fcf60713b3548 retrieval.png',
                'pow ffs get b356c864441e1ca71dd4fe1fc455862350f6798c1f966a90ea3fcf60713b3548 retrieval.png',
                'pow ffs get b356c864441e1ca71dd4fe1fc455862350f6798c1f966a90ea3fcf60713b3548 retrieval.png'
              ]
            },
            {
              id: 'F012H890',
              dealId: '1472892',
              location: 'GB',
              expiry_date: 'Mar 28 2023',
              retrieval_rate: '100%',
              retrieval_commands: [
                'lotus client retrieve --miner f022352 88a601f0915f70051a32ac1c1e4b931c348467e70a0c2f7f72086967eeb79e29 publicdomainmovies.tar.01',
                'pow ffs get 88a601f0915f70051a32ac1c1e4b931c348467e70a0c2f7f72086967eeb79e29 retrieval.png'
              ]
            },
            {
              id: 'F0126789',
              dealId: '1472890',
              location: 'GB',
              expiry_date: 'Apr 1 2023',
              retrieval_rate: '100%',
              retrieval_commands: [
                'lotus client retrieve --miner f022352 444d11afee588638e0479240c55abc5dc8c21ef829f519b8a96db9134b6b41f0 publicdomainmovies.tar.01',
                'pow ffs get 444d11afee588638e0479240c55abc5dc8c21ef829f519b8a96db9134b6b41f0 retrieval.png'
              ]
            }
          ],
          status: 'active'
        }
      ]
    }
  },

  computed: {
    mockCids () {
      const mockCids = []
      for (let i = 0; i < 6; i++) {
        const cid = CloneDeep(this.cids[0])
        cid.title = `Genome in a Bottle 00${i}`
        mockCids.push(cid)
      }
      return mockCids
    }
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