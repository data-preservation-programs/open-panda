<template>
  <CardCutout>
    <div class="cid-card">

      <div class="panel-top">

        <div class="cid-title">
          <div class="title">
            {{ title }}
          </div>
          <div class="hash">
            {{ hash }}
          </div>
        </div>

        <div class="filetypes">
        </div>

        <div class="size">
          {{ size }}
        </div>

        <div class="replicas">
          <div class="replica-list">
            <div
              v-for="n in 5"
              :key="`replica-${n}`"
              :class="['replica', { exists: replicas[n - 1] }]">
            </div>
          </div>
          <span>
            {{ `x${replicas.length} Replicas`}}
          </span>
        </div>

        <div class="expiry-date">
          {{ expiryDate }}
        </div>

        <div class="status">
        </div>

        <div class="accordion-toggle">
        </div>

      </div>

      <div class="panel-bottom">
      </div>

    </div>
  </CardCutout>
</template>

<script>
// ====================================================================== Import
import CardCutout from '@/components/card-cutout'

// ====================================================================== Export
export default {
  name: 'CIDCard',

  components: {
    CardCutout
  },

  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  computed: {
    title () {
      return this.data.title
    },
    hash () {
      return this.data.hash
    },
    size () {
      return this.$formatBytes(this.data.size)
    },
    expiryDate () {
      return this.data.expires
    },
    replicas () {
      if (this.data.storage_providers) {
        return this.data.storage_providers
      }
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.panel-top {
  display: flex;
}

.replica-list {
  display: flex;
}

.replica {
  width: 0.8125rem;
  height: 0.8125rem;
  border-radius: 50%;
  border: solid 1px rgba(#1B1F12, 0.5);
  &.exists {
    background-color: black;
    border-color: black;
  }
}
</style>
