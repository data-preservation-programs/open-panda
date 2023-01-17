<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :target="target"
    :class="[`button type__${button.type || 'default'} ${button.selected ? 'selected' : ''}`]"
    :disabled="button.disabled">
    <span v-if="button.text" class="text">{{ button.text }}</span>
    <slot />
  </component>
</template>

<script>
export default {
  name: 'Button',

  props: {
    button: {
      /**
       * text
       * type: solid, underline, pill
       * disabled: Bool
       */
      type: Object,
      required: true
    }
  },

  computed: {
    tag () {
      return this.button.url ? this.$GetTagBasedOnUrl(this.button.url) : 'div'
    },
    target () {
      return this.button.target ? this.button.target : this.$GetTargetBasedOnUrl(this.button.url)
    },
    to () {
      return this.button.url ? this.$GetTagBasedOnUrl(this.button.url) === 'nuxt-link' ? this.button.url : false : false
    },
    href () {
      return this.button.url ? this.$GetTagBasedOnUrl(this.button.url) === 'a' ? this.button.url : false : false
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
  cursor: pointer;
}

.type__nav {
  font-family: $font_Secondary;
  @include fontWeight_Bold;
  @include fontSize_16;
  line-height: leading(30, 16);
  padding: toRem(5) toRem(20) toRem(10) toRem(20);
  border: 2px solid transparent;
  border-top-right-radius: toRem(8);
  border-bottom-left-radius: toRem(8);
  border-bottom-right-radius: toRem(8);
  position: relative;
  &:before {
    content: '';
    background-color: white;
    height: toRem(10);
    position: absolute;
    top: toRem(-10);
    left: -2px;
    width: toRem(40);
    border-top-right-radius: toRem(8);
    border-top-left-radius: toRem(8);
    display: none;
  }
  @include large {
    padding: toRem(5) toRem(10);
  }
  &:hover {
    border-color: white;
  }
  &.selected {
    background-color: white;
    @include shadow1;
    &:before {
      display: block;
    }
  }
  &[disabled] {
    opacity: 0.7;
  }
}

.type__default {
  font-family: $font_Secondary;
  @include fontWeight_Bold;
  @include fontSize_24;
  line-height: leading(30, 24);
  @include medium {
    @include fontSize_14;
    line-height: leading(21, 14);
  }
  &:hover {
    transform: scale(1.03);
  }
}

.type__solid {
  transition: background-color $duration ease;
  background-color: $rangoonGreen;
  padding: 0 toRem(15);
  color: white;
  border-radius: $borderRadius_Medium;
  &:hover {
    transition: background-color $duration ease;
  }
  &[disabled] {
    background-color: gray;
  }
}

.type__outline {
  border: 1px solid $rangoonGreen;
}
</style>
