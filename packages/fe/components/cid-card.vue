<template>
  <CardCutout>
    <div class="cid-card">

      <div class="panel-top">
        <div class="top-content">

          <div class="cid-title">
            <div class="title">
              {{ title }}
            </div>
            <div class="hash">
              {{ hash }}
            </div>
          </div>

          <div class="filetypes">
            <div
              v-for="filetype in filetypes"
              :key="filetype"
              class="file-extension">
              {{ filetype }}
            </div>
          </div>

          <div class="size">
            {{ size }}
          </div>

          <div class="replicas">
            <div class="replica-list">
              <div
                v-for="n in 5"
                :key="`replica-${n}`"
                :class="['replica', { exists: storageProviders[n - 1] }]">
              </div>
            </div>
            <span>
              {{ `x${storageProviders.length} Replicas` }}
            </span>
          </div>

          <div class="expiry-date">
            <span>{{ expiryDate }}</span>
            <span>Avail. Until</span>
          </div>

          <div
            :class="['status', status]">
            {{ status.charAt(0).toUpperCase() + status.slice(1) }}
          </div>

          <div class="accordion-toggle">
            <ButtonToggle
              theme="light"
              :class="[{ active: open }]"
              @click="toggleBottomPanel">
              {{ open ? 'Less' : 'More' }}
            </ButtonToggle>
          </div>

        </div>
      </div>

      <div :class="['panel-bottom', { open }]">
        <div class="bottom-content">
          <TabbedSlider
            slider-id="cid-card-slider">

            <template #before-tabs>
              Select a storage provider to view retrieval commands
            </template>

            <template
              v-for="(tab, i) in storageProviders"
              #[`slider-tab-${i}`]>
              <div
                :key="`slider-tab-${i}`"
                class="tab-row">
                <div>
                  {{ tab.id }}
                </div>
                <div>
                  {{ tab.dealId }}
                </div>
                <div>
                  {{ tab.expiry_date }}
                </div>
                <div>
                  {{ tab.retrieval_rate }}
                </div>
              </div>
            </template>

            <template #before-slides>
              Retrieval Commands
            </template>

            <template
              v-for="(slide, i) in storageProviders"
              #[`slider-panel-${i}`]>
              <div
                :key="`slider-panel-${i}`"
                class="command-wrapper">
                <div
                  v-for="(command, j) in slide.retrieval_commands"
                  :key="`command-${j}`">
                  {{ command }}
                </div>
              </div>
            </template>

          </TabbedSlider>
        </div>
      </div>

    </div>
  </CardCutout>
</template>

<script>
// ====================================================================== Import
import CardCutout from '@/components/card-cutout'
import ButtonToggle from '@/components/buttons/button-toggle'
import TabbedSlider from '@/modules/slider/components/tabbed-slider'

// ====================================================================== Export
export default {
  name: 'CIDCard',

  components: {
    CardCutout,
    ButtonToggle,
    TabbedSlider
  },

  props: {
    cidData: {
      type: Object,
      required: true,
      default: () => ({})
    },
    storageProviders: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  data () {
    return {
      open: false
    }
  },

  computed: {
    title () {
      return this.cidData.title
    },
    hash () {
      return this.cidData.hash
    },
    filetypes () {
      return this.cidData.filetypes.split(',').map(ext => ext.replaceAll(' ', ''))
    },
    size () {
      return this.$formatBytes(this.cidData.size)
    },
    expiryDate () {
      return this.cidData.expires
    },
    status () {
      return this.cidData.status
    }
  },

  methods: {
    toggleBottomPanel () {
      this.open = !this.open
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.panel-top {
  border-bottom: solid 1px black;
}

.panel-bottom {
  height: 0;
  overflow: hidden;
  &.open {
    height: auto;
  }
}

.top-content,
.bottom-content {
  padding: 2.5rem 1.875rem;
}

.top-content {
  display: flex;
}

// //////////////////////////////////////////////////////////////////// CID INFO

.filetypes,
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

.expiry-date {
  display: flex;
  flex-direction: column;
}

.status {
  display: flex;
  &.active {
    &:before {
      content: '';
      position: relative;
      display: block;
      width: 1rem;
      height: 1rem;
      background-color: #74C3B5;
      border-radius: 50%;
    }
  }
}

// ///////////////////////////////////////////////////////////////// SLIDER TABS
.tab-row {
  display: flex;
}

// /////////////////////////////////////////////////////////////// SLIDER SLIDES

</style>
