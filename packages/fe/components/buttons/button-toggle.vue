<template>
  <div
    v-bind="$props"
    :class="['button-toggle', `theme__${theme}`]"
    tabindex="0"
    v-on="$listeners">

    <div :class="['icon-before', `theme__${theme}`]"></div>

    <div class="button-content">
      <slot />
    </div>

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'ButtonX',

  props: {
    theme: {
      /**
       * theme
       * possible values: 'light', 'dark' & 'grey'
       */
      type: String,
      required: false,
      default: 'light'
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    selected: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.button-toggle {
  position: relative;
  white-space: nowrap;
  padding: 0.25rem 1rem;
  border-radius: 1.5rem;
  cursor: pointer;
  &:not([disabled]) {
    &:focus-visible {
      @include focusBoxShadow;
    }
  }
  &[disabled] {
    box-shadow: none;
    cursor: no-drop;
  }
  &.theme__light {
    background-color: #E7E9ED;
  }
  &.theme__dark {
    background-color: #000000;
    color: $grayNurse;
  }
  &.theme__grey {
    background-color: #51504B;
    color: $grayNurse;
  }
  &.active {
    .icon-before {
      transform: rotate(90deg);
      &:after {
        opacity: 0;
      }
    }
  }
}

.icon-before {
  position: absolute;
  transition: 200ms ease;
  transform: rotate(0deg);
  top: calc(50% - 5px);
  left: 1rem;
  width: 0.75rem;
  height: 0.75rem;
  &:before,
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 11px;
    height: 11px;
    transform-origin: center;
    opacity: 1;
    background-repeat: no-repeat;
    background-size: 100%;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='11' height='3' viewBox='0 0 11 3' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 1.48145C0 1.21623 0.115893 0.961875 0.322183 0.774339C0.528473 0.586802 0.808262 0.481445 1.1 0.481445H9.9C10.1917 0.481445 10.4715 0.586802 10.6778 0.774339C10.8841 0.961875 11 1.21623 11 1.48145C11 1.74666 10.8841 2.00102 10.6778 2.18855C10.4715 2.37609 10.1917 2.48145 9.9 2.48145H1.1C0.808262 2.48145 0.528473 2.37609 0.322183 2.18855C0.115893 2.00102 0 1.74666 0 1.48145Z' fill='%231B1F12'/%3e%3c/svg%3e ");
  }
  &:before {
    top: calc(50% - 5.5px);
    left: -4px;
    transform: rotate(90deg);
  }
  &:after {
    top: calc(50% - 1.5px);
  }
  &.theme__dark,
  &.theme__grey {
    &:before,
    &:after {
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='11' height='3' viewBox='0 0 11 3' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 1.48145C0 1.21623 0.115893 0.961875 0.322183 0.774339C0.528473 0.586802 0.808262 0.481445 1.1 0.481445H9.9C10.1917 0.481445 10.4715 0.586802 10.6778 0.774339C10.8841 0.961875 11 1.21623 11 1.48145C11 1.74666 10.8841 2.00102 10.6778 2.18855C10.4715 2.37609 10.1917 2.48145 9.9 2.48145H1.1C0.808262 2.48145 0.528473 2.37609 0.322183 2.18855C0.115893 2.00102 0 1.74666 0 1.48145Z' fill='%23F1F3EF'/%3e%3c/svg%3e ");
    }
  }
}

.button-content {
  width: fit-content;
  margin-left: 1.625rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: 500;
}

</style>
