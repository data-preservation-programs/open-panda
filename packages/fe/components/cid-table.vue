<template>
  <div class="cid-table">

    <div class="toolbar">
    </div>

    <div class="table">
      <CIDCard
        v-for="(cid, i) in cids"
        :key="`cid-${i}`"
        :cid-data="cid"
        :storage-providers="cid.storage_providers" />
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
          filetypes: 'xml, txt, csv',
          size: 32000000000,
          expires: 'Feb 27 2023',
          storage_providers: [
            {
              id: 'F0123431',
              dealId: '1472881',
              expiry_date: 'Feb 27 2023',
              retrieval_rate: '100%',
              retrieval_commands: [
                'lotus client retrieve --miner f022352 baga6ea4seaqih7gfqvkpvez3qlbajjolszk7vfqaatt5m2rdef52p3fq4jfpigi publicdomainmovies.tar.01',
                'pow ffs get baga6ea4seaqih7gfqvkpvez3qlbajjolszk7vfqaatt5m2rdef52p3fq4jfpigi retrieval.png'
              ]
            }
          ],
          status: 'active'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
</style>
