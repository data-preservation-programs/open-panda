<template>
  <CardCutout>
    <div class="cid-card">

      <div :class="['panel-top', { open }, { mobile }]">
        <div class="top-content">

          <div
            v-if="mobile"
            class="title-mobile">
            {{ title }}
          </div>

          <div class="cid-title mobile-row">
            <div v-if="mobile" class="label">
              {{ content.cidLabel }}
            </div>
            <div v-if="!mobile" class="title">
              {{ title }}
            </div>
            <div class="hash">
              {{ shortenString(hash, 16) }}
              <button
                class="copy-button"
                @click="$addTextToClipboard(hash)">
                <CopyIcon />
              </button>
            </div>
          </div>

          <div v-if="mobile" class="mobile-row">
            <div class="label">
              {{ content.sizeLabel }}
            </div>
            <div class="size">
              {{ size }}
            </div>
          </div>

          <div class="mobile-row">
            <div v-if="mobile" class="label">
              {{ content.typeLabel }}
            </div>
            <div class="file-types">
              <div
                v-for="fileExtension in fileExtensions"
                :key="fileExtension"
                class="file-extension">
                {{ fileExtension }}
              </div>
            </div>
          </div>

          <div v-if="!mobile" class="size">
            {{ size }}
          </div>

          <div class="replicas mobile-row">
            <div v-if="mobile" class="label">
              {{ content.replicasLabel }}
            </div>
            <div class="replica-list">
              <div
                v-for="n in 5"
                :key="`replica-${n}`"
                :class="['replica', { exists: storageProviders[n - 1] }]">
              </div>
            </div>
            <span v-if="!mobile" class="replica-number">
              {{ `x${storageProviders.length} Replicas` }}
            </span>
          </div>

          <div class="expiry-date mobile-row">
            <span class="date label">{{ expiryDate }}</span>
            <span class="more">{{ mobile ? 'Available Until' : 'Avail. Until' }}</span>
          </div>

          <div class="mobile-row">
            <div v-if="mobile" class="label">
              {{ content.statusLabel }}
            </div>
            <div
              v-if="status"
              :class="['status', status]">
              {{ status }}
            </div>
          </div>

          <div v-if="!mobile" class="accordion-toggle">
            <ButtonToggle
              :theme="!storageProviders.length ? 'grey' : 'light'"
              :disabled="!storageProviders.length"
              :class="[{ active: open }, { 'toggle-disabled': !storageProviders.length }]"
              @click="storageProviders.length ? toggleBottomPanel : null">
              {{ open ? 'Less' : 'More' }}
            </ButtonToggle>
            <!-- desktop -->
            <Tooltip>
              <template #tooltip-btn>
                <TerminalIcon class="icon" />
                <a :href="zstLink" target="_blank">
                  {{ content.tooltipBtnText }}</a>
              </template>
              <template #tooltip-box>
                <div v-html="content.tooltipText"></div>
              </template>
            </Tooltip>
          </div>

          <div v-if="mobile" class="mobile-sp-section-heading">
            <div class="heading">
              {{ content.storageProvidersLabel }}
            </div>
            <div class="subheading">
              {{ content.storageProvidersSubLabel }}
            </div>
          </div>

        </div>
      </div>

      <div
        :class="['panel-bottom', { open }, { mobile }]"
        :style="{ '--panel-bottom-height': `${bottomPanelHeight}px`}">
        <div class="bottom-content">

          <CIDSlider
            v-if="storageProviders.length && !mobile"
            :slider-id="hash"
            :storage-providers="storageProviders"
            @slide-changed="changeBottomPanelHeight" />

          <Accordion
            v-if="storageProviders.length && mobile"
            v-slot="{ active }">
            <AccordionSection
              v-for="(sp, i) in storageProviders"
              :key="`sp-${i}`"
              :active="active">

              <AccordionHeader>
                <div class="sp-heading">
                  <span>{{ sp.id }}</span>
                  <span class="flag-emoji">{{ $getFlagIcon(sp.location) }}</span>
                </div>
              </AccordionHeader>

              <AccordionContent>
                <div class="sp-content">
                  <div class="info">
                    <div class="info-row">
                      <div class="label">
                        {{ content.dealIDLabel }}
                      </div>
                      <div class="cell deal-id">
                        {{ sp.dealId }}
                      </div>
                    </div>
                    <div class="info-row">
                      <div class="label">
                        {{ content.availUntilLabel }}
                      </div>
                      <div class="cell deal-expiry">
                        {{ sp.expiry_date }}
                      </div>
                    </div>
                    <div class="info-row">
                      <div class="label">
                        {{ content.retrievalRateLabel }}
                      </div>
                      <div class="cell retrieval">
                        {{ sp.retrieval_rate }}
                      </div>
                    </div>
                  </div>
                  <div class="retrieval-title">
                    {{ content.retrievalCommandsLabel }}
                  </div>
                  <div class="retrieval-commands">
                    <div
                      v-for="(command, j) in sp.retrieval_commands"
                      :key="`command-${j}-mobile`"
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
                </div>
              </AccordionContent>

            </AccordionSection>
          </Accordion>

        </div>
      </div>

      <!-- mobile -->
      <div v-if="mobile" class="inspect-file-mobile">
        <Tooltip align="right">
          <template #tooltip-btn>
            <TerminalIcon class="icon" />
            <span>{{ content.tooltipBtnText }}</span>
          </template>
          <template #tooltip-box>
            <div v-html="content.tooltipText"></div>
          </template>
        </Tooltip>
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
import Accordion from '@/components/accordion/accordion'
import AccordionSection from '@/components/accordion/accordion-section'
import AccordionHeader from '@/components/accordion/accordion-header'
import AccordionContent from '@/components/accordion/accordion-content'
import Tooltip from '@/components/tooltip'
import TerminalIcon from '@/components/icons/terminal'

// ====================================================================== Export
export default {
  name: 'CIDCard',

  components: {
    CardCutout,
    ButtonToggle,
    CopyIcon,
    CIDSlider,
    Tooltip,
    Accordion,
    AccordionSection,
    AccordionHeader,
    AccordionContent,
    TerminalIcon
  },

  props: {
    cidData: {
      type: Object,
      required: true,
      default: () => ({})
    },
    content: {
      type: Object,
      required: true,
      default: () => ({})
    },
    mobile: {
      type: Boolean,
      required: false,
      default: false
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
      return this.cidData.filename
    },
    hash () {
      return this.cidData.payload_cid
    },
    zstLink () {
      return `https://${this.hash}.ipfs.w3s.link/${this.title}`
    },
    fileExtensions () {
      return [] // this.cidData.fileExtensions.split(',').map(ext => ext.replaceAll(' ', ''))
    },
    size () {
      return this.$formatBytes(this.cidData.raw_car_file_size)
    },
    expiryDate () {
      return this.cidData.expiry_date || ''
    },
    status () {
      return typeof this.cidData.status === 'string' ? status.charAt(0).toUpperCase() + status.slice(1) : false
    },
    storageProviders () {
      return [] // this.cidData.storage_providers
    }
  },

  methods: {
    toggleBottomPanel () {
      this.open = !this.open
    },
    changeBottomPanelHeight (height) {
      this.bottomPanelHeight = height + 100
    },
    shortenString (string, limit) {
      const len = string.length
      if (len > limit) {
        const chars = Math.floor(limit / 2)
        return `${string.substring(0, chars)}...${string.substring(len - chars, len)}`
      }
      return string
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.panel-top {
  transition: border 200ms ease;
  border-bottom: solid 1px rgba($iron, 0);
  &.open,
  &.mobile {
    border-bottom: solid 1px rgba($iron, 1);
  }
  &:not(.mobile) {
    .mobile-row,
    .size {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
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
  &.mobile {
    height: unset !important;
  }
}

.top-content,
.bottom-content {
  padding: 2.5rem 1.875rem;
}

.top-content {
  display: flex;
  justify-content: space-between;
  @include medium {
    flex-direction: column;
  }
  @include medium {
    padding: 1.125rem 1.875rem;
  }
}

.bottom-content {
  @include medium {
    padding: 0;
  }
}

.mobile-row {
  @include medium {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    align-items: center;
    &:not(:last-child) {
      margin-bottom: 1.125rem;
    }
  }
}

.label {
  @include medium {
    width: 40%;
    min-width: toRem(120);
    flex-shrink: 0;
  }
}

:deep(.tooltip-c .tooltip-box-wrapper) {
  transform: translateX(-60%);
}

.inspect-file-mobile {
  padding-bottom: toRem(10);
  :deep(.tooltip-c) {
    display: flex;
    justify-content: right;
    padding-right: 1.875rem;
  }
}

// //////////////////////////////////////////////////////////////////// CID INFO
.title-mobile {
  font-size: 1.375rem;
  line-height: leading(29, 22);
  @include fontWeight_Medium;
  margin-bottom: 1.25rem;
  overflow-wrap: break-word;
}

.cid-title {
  max-width: 50%;
  .title {
    font-family: $font_Primary;
    font-size: 1.125rem;
    @include fontWeight_Medium;
    line-height: leading(29, 18);
    margin-bottom: 0.3125rem;
    overflow-wrap: break-word;
  }
  .hash {
    display: flex;
    align-items: center;
    @include fontSize_14;
    @include fontWeight_Regular;
    @include medium {
      flex-direction: row-reverse;
    }
  }
  .copy-button {
    display: flex;
    margin-left: 0.75rem;
    @include medium {
      margin-left: 0;
      margin-right: 0.5rem;
    }
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

.fileExtensions,
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
    @include medium {
      @include fontSize_14;
      @include fontWeight_Bold;
    }
  }
}

.size {
  @include fontSize_16;
  @include fontWeight_Medium;
  margin-top: 0.4375rem;
  @include medium {
    margin-top: 0;
    @include fontWeight_Bold;
  }
}

.replica-list {
  margin: 0.875rem 0;
  @include medium {
    margin: 0;
  }
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
  @include medium {
    flex-direction: row;
  }
  .date {
    @include fontSize_16;
    @include fontWeight_Medium;
    margin-bottom: toRem(11);
    @include medium {
      margin-bottom: 0;
      order: 2;
      @include fontWeight_Bold;
    }
  }
  .more {
    @include fontSize_14;
    @include fontWeight_Regular;
    @include medium {
      margin-bottom: 0;
      order: 1;
      width: 40%;
      min-width: toRem(120);
      flex-shrink: 0;
    }
  }
}

.status {
  display: flex;
  margin-top: 0.4375rem;
  margin-bottom: auto;
  @include medium {
    margin-top: 0;
    @include fontSize_14;
    @include fontWeight_Bold;
  }
  &.active {
    &:before {
      content: '';
      position: relative;
      display: block;
      width: 1rem;
      height: 1rem;
      top: 0.25rem;
      background-color: $neptune;
      border-radius: 50%;
      margin-right: 0.875rem;
      @include medium {
        margin-right: 0.5rem;
      }
    }
  }
}

.accordion-toggle {
  :deep(.button-toggle) {
    &.toggle-disabled {
      background-color: #51504B;
      .button-content {
        color: #F1F3EF;
      }
    }
  }
}

// ///////////////////////////////////////////////////// STORAGE PROVIDERS PANEL
.mobile-sp-section-heading {
  .heading {
    @include fontSize_24;
    @include fontWeight_Medium;
    line-height: leading(24, 20);
    margin: 0.625rem 0;
  }
  .subheading {
    @include fontSize_14;
    line-height: leading(24, 14);
  }
}

.sp-heading {
  @include fontSize_16;
  @include fontWeight_Medium;
  line-height: leading(24, 16);
  padding: 0.9375rem 0;
}

.flag-emoji {
  display: inline-block;
  margin-left: 0.25rem;
  transform: scale(1.4);
}

:deep(.accordion-section) {
  .accordion-header {
    position: relative;
    cursor: pointer;
    &:after {
      content: '';
      display: inline-block;
      position: absolute;
      margin-left: 0.8125rem;
      width: 11px;
      height: 7px;
      top: calc(50% - 3.5px);
      right: 0;
      transform: rotate(180deg);
      transition: transform 250ms ease;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M11 6.5L6 1.5L1 6.5' stroke='%231B1F12' stroke-width='2' stroke-linecap='round'/%3e%3c/svg%3e ");
    }
  }
  @include medium {
    border-bottom: 1px solid $iron;
    padding-left: 1.875rem;
    padding-right: 1.875rem;
    &:last-child {
      border-bottom: 0;
    }
  }
  &.open {
    .accordion-header {
      &:after {
        transform: rotate(0deg);
      }
    }
  }
}

.info-row {
  display: flex;
  margin-bottom: 0.875rem;
}

.label,
.cell {
  @include medium {
    width: 40%;
    @include fontSize_14;
    line-height: leading(21, 14);
  }
}

.cell {
  @include fontWeight_Medium;
  @include medium {
    @include fontWeight_Bold;
  }
}

.retrieval-title,
.retrieval-commands {
  padding-bottom: 1.25rem;
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
  .copy-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}

.copy-icon {
  display: block;
  fill: $grayNurse;
}
</style>
