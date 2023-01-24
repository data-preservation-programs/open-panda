<template>
  <CardCutout>
    <div class="cid-card">

      <div :class="['panel-top', { open }]">
        <div class="top-content">

          <div class="cid-title">
            <div class="title">
              {{ title }}
            </div>
            <div class="hash">
              {{ hash }}
              <button
                class="copy-button"
                @click="copyToClipboard">
                <CopyIcon />
              </button>
            </div>
          </div>

          <div class="file-types">
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
            <span class="replica-number">
              {{ `x${storageProviders.length} Replicas` }}
            </span>
          </div>

          <div class="expiry-date">
            <span class="date">{{ expiryDate }}</span>
            <span class="more">Avail. Until</span>
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

      <div
        :class="['panel-bottom', { open }]"
        :style="{ '--panel-bottom-height': `${bottomPanelHeight}px`}">
        <div class="bottom-content">
          <CIDSlider
            v-if="storageProviders.length"
            :storage-providers="storageProviders"
            @slide-changed="changeBottomPanelHeight" />
        </div>
      </div>

    </div>
  </CardCutout>
</template>

<script>
// ====================================================================== Import
import CardCutout from '@/components/card-cutout'
import ButtonToggle from '@/components/buttons/button-toggle'
import CopyIcon from '@/components/icons/copy'
import CIDSlider from '@/components/cid-slider'

// ====================================================================== Export
export default {
  name: 'CIDCard',

  components: {
    CardCutout,
    ButtonToggle,
    CopyIcon,
    CIDSlider
  },

  props: {
    cidData: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  data () {
    return {
      open: false,
      bottomPanelHeight: 0
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
    },
    storageProviders () {
      return this.cidData.storage_providers
    }
  },

  methods: {
    toggleBottomPanel () {
      this.open = !this.open
    },
    copyToClipboard () {
      console.log(this.hash)
    },
    changeBottomPanelHeight (height) {
      this.bottomPanelHeight = height + 80
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.panel-top {
  transition: border 200ms ease;
  border-bottom: solid 1px rgba(#DDDFE3, 0);
  &.open {
    border-bottom: solid 1px rgba(#DDDFE3, 1);
  }
}

.panel-bottom {
  --panel-bottom-height: 0px;
  height: 0px;
  transition: height 200ms ease;
  overflow: hidden;
  &.open {
    height: var(--panel-bottom-height);
  }
}

.top-content,
.bottom-content {
  padding: 2.5rem 1.875rem;
}

.top-content {
  display: flex;
  justify-content: space-between;
  // align-items: center;
}

// //////////////////////////////////////////////////////////////////// CID INFO
.cid-title {
  .title {
    font-family: $font_Primary;
    font-size: 1.125rem;
    @include fontWeight_Medium;
    line-height: leading(29, 18);
    margin-bottom: 0.3125rem;
  }
  .hash {
    display: flex;
    align-items: center;
    @include fontSize_14;
    @include fontWeight_Regular;
  }
  .copy-button {
    display: flex;
    margin-left: 0.75rem;
    :deep(svg) {
      path {
        transition: opacity 200ms ease;
        opacity: 0.25;
        fill: #1B1F12;
      }
    }
    &:hover {
      :deep(svg) {
        path {
          opacity: 1;
        }
      }
    }
  }
}

.filetypes,
.replica-list {
  display: flex;
}

.file-types {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: auto;
  .file-extension {
    line-height: leading(21, 14);
    padding: 0.3125rem 0.625rem;
    border-radius: 1.25rem;
    background-color: #E0E7E0;
    margin-bottom: 0.5625rem;
    &:not(:last-child) {
      margin-right: 0.375rem;
    }
  }
}

.size {
  @include fontSize_16;
  @include fontWeight_Medium;
  margin-top: 0.4375rem;
}

.replica-list {
  margin: 0.875rem 0;
}
.replica {
  width: 0.8125rem;
  height: 0.8125rem;
  border-radius: 50%;
  border: solid 1px rgba(#1B1F12, 0.5);
  &:not(:last-child) {
    margin-right: 0.5625rem;
  }
  &.exists {
    background-color: black;
    border-color: black;
  }
}

.replica-number {
  @include fontSize_14;
}

.expiry-date {
  display: flex;
  flex-direction: column;
  margin-top: 0.4375rem;
  .date {
    @include fontSize_16;
    @include fontWeight_Medium;
    margin-bottom: 0.375rem;
  }
  .more {
    @include fontSize_14;
    @include fontWeight_Regular;
  }
}

.status {
  display: flex;
  margin-top: 0.4375rem;
  margin-bottom: auto;
  &.active {
    &:before {
      content: '';
      position: relative;
      display: block;
      width: 1rem;
      height: 1rem;
      top: 0.25rem;
      background-color: #74C3B5;
      border-radius: 50%;
      margin-right: 0.875rem;
    }
  }
}
</style>
