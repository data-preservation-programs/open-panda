<template>
  <TabbedSlider
    :slider-id="sliderId"
    @slide-changed="handleSlideChange">

    <template #before-tabs>
      <div class="before-tabs">
        Select a storage provider to view retrieval commands
      </div>

      <div
        class="tab-row headings-row"
        :style="{ '--tabs-panel-height': `${(storageProviders.length + 1) * 50}px`}">
        <div class="cell sp-id">
          <span>Storage Provider</span>
        </div>
        <div class="cell deal-id">
          Deal ID
        </div>
        <div class="cell deal-expiry">
          Available Until
        </div>
        <div class="cell retrieval">
          Retrieval Rate
        </div>
      </div>
    </template>

    <template
      v-for="(tab, i) in storageProviders"
      #[`slider-tab-${i}`]>
      <div
        :key="`slider-tab-${i}`"
        class="tab-row">
        <div class="cell sp-id">
          <span>{{ tab.id }}</span>
          <span class="flag-emoji">{{ $getFlagIcon(tab.location) }}</span>
        </div>
        <div class="cell deal-id">
          {{ tab.dealId }}
        </div>
        <div class="cell deal-expiry">
          {{ tab.expiry_date }}
        </div>
        <div class="cell retrieval">
          {{ tab.retrieval_rate }}
        </div>
      </div>
    </template>

    <template #before-slides>
      <div class="before-slides">
        Retrieval Commands
      </div>
    </template>

    <template
      v-for="(slide, i) in storageProviders"
      #[`slider-panel-${i}`]>
      <div
        :key="`slider-panel-${i}`"
        class="command-wrapper">
        <div
          v-for="(command, j) in slide.retrieval_commands"
          :key="`command-${j}`"
          class="command">
          <code>
            {{ command }}
          </code>
          <button
            class="copy-button"
            @click="$addTextToClipboard(command)">
            <CopyIcon class="copy-icon" />
          </button>
        </div>
      </div>
    </template>

  </TabbedSlider>
</template>

<script>
// ====================================================================== Import
import TabbedSlider from '@/modules/slider/components/tabbed-slider'
import CopyIcon from '@/components/icons/copy'

// ====================================================================== Export
export default {
  name: 'CIDSlider',

  components: {
    TabbedSlider,
    CopyIcon
  },

  props: {
    storageProviders: {
      type: Array,
      required: true,
      default: () => []
    },
    sliderId: {
      type: String,
      required: true,
      default: ''
    }
  },

  methods: {
    handleSlideChange (height) {
      this.$emit('slide-changed', height)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.tabbed-slider) {
  position: relative;
}

.before-tabs,
.before-slides {
  @include fontSize_14;
  @include fontWeight_Regular;
  line-height: leading(24, 14);
}

.before-tabs {
  margin-bottom: 0.8125rem;
}

// ///////////////////////////////////////////////////////////////// SLIDER TABS
.cell {
  @include fontSize_14;
  @include fontWeight_Regular;
  line-height: leading(24, 14);
  text-align: left;
}

.headings-row {
  --tabs-panel-height: 50px;
  position: relative;
  .cell {
    @include fontWeight_Medium;
    @include large {
      font-size: 0.8125rem;
    }
  }
}

:deep(.tab) {
  position: relative;
  z-index: 10;
  width: calc(100% + 1px);
  &.selected {
    background-color: $grayNurse;
    border-top: solid 1px $tasman;
    border-bottom: solid 1px $tasman;
  }
}

.tab-row {
  display: flex;
  justify-content: flex-start;
  padding: 0.6875rem 1.5625rem;
  @include large {
    padding: 0.6875rem 1.25rem;
  }
}

.sp-id {
  @include fontWeight_Medium;
}

.sp-id,
.deal-expiry {
  width: 26%;
  @include large {
    width: 28%;
  }
}

.deal-id {
  width: 16%;
  @include large {
    width: 19%;
  }
}

.retrieval {
  flex-grow: 1;
}

.flag-emoji {
  display: inline-block;
  margin-left: 0.25rem;
  transform: scale(1.4);
}

// /////////////////////////////////////////////////////////////// SLIDER SLIDES
:deep(.slide-wrapper) {
  position: relative;
  z-index: 1;
  background-color: $grayNurse;
  border: solid 1px $tasman;
  border-radius: 0.625rem;
  margin-top: toRem(10);
}

.command-wrapper {
  padding: 1rem;
}

.command {
  position: relative;
  padding: 0.9375rem 2.875rem 0.9375rem 1.125rem;
  border-radius: 0.5rem;
  background-color: black;
  &:not(:last-child) {
    margin-bottom: 0.8125rem;
  }
  code {
    display: block;
    width: 100%;
    word-break: break-word;
    color: $grayNurse;
    font-family: $font_Code;
    font-size: 0.8125rem;
    line-height: leading(24, 13);
  }
}

.copy-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.copy-icon {
  display: block;
  fill: $grayNurse;
}

:deep(.tab-list) {
  height: 100% !important;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: -3rem;
    left: 0;
    width: calc(100% - 3.125rem);
    height: calc(100% - 2rem);
    border: solid 1px $grayNurse;
    border-radius: 0.625rem;
    @include large {
      width: calc(100% - 1.5rem);
    }
  }
}
</style>
