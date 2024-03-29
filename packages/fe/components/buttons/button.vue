<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :target="target"
    :class="['button', `type__${button.type || ''}`, button.selected ? 'selected' : '', button.icon ? 'has-icon' : '']"
    :disabled="button.disabled"
    @click="$emit('clicked')">
    <span v-if="button.text" class="text">{{ button.text }}</span>
    <slot />
    <div v-if="button.tooltip" class="tooltip">
      {{ button.tooltip }}</div>
    <ArrowRightIcon v-if="button.icon === 'arrow'" class="arrow-icon icon" />
  </component>
</template>

<script>
import ArrowRightIcon from '@/components/icons/arrow-right'

/**
 * use this button component for simple buttons
 * ie. buttons that leads to another page or nav
 */
export default {
  name: 'Button',

  components: {
    ArrowRightIcon
  },

  props: {
    button: {
      /**
       * text
       * type: solid, solid-tear, default, outline, light
       * disabled: Bool
       */
      type: Object,
      required: true
    }
  },

  computed: {
    tag () {
      return this.button && this.button.url ? this.$GetTagBasedOnUrl(this.button.url) : 'button'
    },
    target () {
      return this.button && this.button.target ? this.button.target : this.$GetTargetBasedOnUrl(this.button.url)
    },
    to () {
      return this.button && this.button.url ? this.$GetTagBasedOnUrl(this.button.url) === 'nuxt-link' ? this.button.url : false : false
    },
    href () {
      return this.button && this.button.url ? this.$GetTagBasedOnUrl(this.button.url) === 'a' ? this.button.url : false : false
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  display: inline-flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  justify-content: center;
  @include fontSize_16;
  cursor: pointer;
  .icon {
    transition: transform 100ms ease-out;
    margin-left: toRem(15);
    &.arrow-icon {
      transform: rotate(-40deg);
    }
  }
  .tooltip {
    top: calc(100% + 5px);
  }
  &:hover {
    .icon {
      transition: transform 100ms ease-in;
      &.arrow-icon {
        transform: rotate(0);
      }
    }
    .tooltip {
      display: block;
    }
  }
}

.type__default {
  &:hover {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;
  }
  &[disabled] .text {
    opacity: 0.7;
  }
}

.type__footerNav {
  font-family: $font_Secondary;
  @include fontWeight_Bold;
  @include fontSize_18;
  @include medium {
    @include fontSize_14;
    line-height: leading(21, 14);
  }
  &:hover {
    transform: scale(1.03);
  }
}

.type__solid {
  background-color: $rangoonGreen;
  padding: toRem(7) toRem(20);
  border-radius: $borderRadius;
  font-family: $font_Primary;
  @include fontWeight_Medium;
  @include fontSize_16;
  line-height: leading(24, 16);
  color: $grayNurse;
  &:not([disabled]) {
    &:not(.has-icon):hover {
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 4px;
    }
  }
  &[disabled] {
    opacity: 0.5;
    cursor: no-drop;
  }
}

.type__solid-tear {
  @extend .type__solid;
  border-radius: toRem(2) toRem(30) toRem(30) toRem(30);
  &:hover {
    text-decoration: none !important;
    border-radius: toRem(30) toRem(30) toRem(2) toRem(30);
  }
}

.type__outline {
  border: 1px solid $rangoonGreen;
  padding: toRem(7) toRem(15);
  border-radius: toRem(20);
  @include medium {
    padding: toRem(4) toRem(10);
  }
  &:hover {
    background-color: $rangoonGreen;
    color: white;
  }
}

.type__light {
  background-color: white;
  padding: toRem(7) toRem(20);
  border-radius: $borderRadius;
  font-family: $font_Primary;
  @include fontWeight_Medium;
  @include fontSize_16;
  line-height: leading(24, 16);
  color: $rangoonGreen;
  &:not([disabled]) {
    &:not(.has-icon):hover {
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 4px;
    }
  }
  &[disabled] {
    opacity: 0.5;
    cursor: no-drop;
  }
  :deep(.arrow-icon) {
    path {
      transition: 100ms ease;
      fill: $rangoonGreen;
    }
  }
  &:hover {
    background-color: $rangoonGreen;
    color: white;
    :deep(.arrow-icon) {
      path {
        fill: white;
      }
    }
  }
}
</style>
