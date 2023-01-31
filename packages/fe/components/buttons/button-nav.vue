<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :target="target"
    :class="[`button ${button.selected ? 'selected' : ''}`]"
    :disabled="button.disabled">

    <span class="top-notch"></span>
    <span v-if="button.text" class="text">{{ button.text }}</span>
    <div v-if="button.tooltip" class="tooltip">
      {{ button.tooltip }}</div>

  </component>
</template>

<script>
export default {
  name: 'ButtonNav',

  props: {
    button: {
      /**
       * text
       * type: solid, nav, solid-tear, default, outline
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
  font-family: $font_Secondary;
  @include fontWeight_Bold;
  line-height: leading(30, 16);
  padding: toRem(2) 0.8vw toRem(5) 0.8vw;
  border: 2px solid transparent;
  border-top-right-radius: toRem(5);
  border-bottom-left-radius: toRem(5);
  border-bottom-right-radius: toRem(5);
  position: relative;
  cursor: pointer;
  &:hover {
    .tooltip {
      display: block;
    }
    .top-notch {
      transition: 250ms;
    }
  }
  &[disabled] .text {
    opacity: 0.7;
  }
  .tooltip {
    background-color: $rangoonGreen;
    padding: toRem(5) toRem(8) toRem(7) toRem(8);
    border-radius: toRem(10);
    color: white;
    top: calc(100% - 7px);
    font-size: toRem(10);
    display: none;
    @include fontWeight_Medium;
    position: absolute;
    line-height: 1;
    width: max-content;
    &:before {
      width: 0;
      height: 0;
      border-top: toRem(5) solid transparent;
      border-bottom: toRem(5) solid transparent;
      border-right: toRem(5) solid $rangoonGreen;
      content: '';
      position: absolute;
      top: toRem(-7);
      left: calc(50% - 2.5px);
      transform: rotate(90deg);
    }
  }
  .top-notch {
    transition: 250ms;
    position: absolute;
    top: -0.6rem;
    left: -2px;
    overflow: hidden;
    height: toRem(10);
    width: 2.60rem;
    border-top-left-radius: toRem(5);
    border-left: 2px solid white;
    background-color: $gin;
    opacity: 0;
    &:before {
      transition: 250ms;
      content: '';
      border-top: 2px solid white;
      border-right: 4px solid white;
      left: toRem(-5);
      height: 100%;
      width: toRem(40);
      border-radius: 0 2px 0 0;
      transform: skew(60deg, 0deg);
      display: block;
      position: relative;
    }
  }
  &:not([disabled]) {
    &:hover {
      border-color: white;
      .top-notch {
        opacity: 1;
      }
    }
  }
  &.selected {
    background-color: white;
    @include shadow1;
    .top-notch {
      opacity: 1;
      &:before {
        transition: 250ms;
        background-color: white;
      }
    }
  }
}

</style>
