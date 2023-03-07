<template>
  <div class="tooltip-c">
    <div class="tooltip-btn">
      <TerminalIcon class="icon" />
      <span>{{btn}}</span>
    </div>
    <div class="tooltip-box" v-html="text"></div>
  </div>
</template>

<script>
// ===================================================================== Imports
import TerminalIcon from '@/components/icons/terminal'

// ====================================================================== Export
export default {
  name: 'Tooltip',

  components: {
    TerminalIcon
  },

  props: {
    text: {
      type: String,
      required: true
    },
    btn: {
      type: String,
      required: true
    }
  },

  computed: {

  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.tooltip-c {
  position: relative;
  z-index: 1000;
  margin-top: toRem(10);
  &:hover {
    .tooltip-btn {
      color: $rangoonGreen;
    }
    .tooltip-box {
      @include fadeIn;
    }
  }
}
.tooltip-btn {
  cursor: pointer;
  align-items: center;
  display: flex;
  color: $blue;
  @include fontSize_14;
  @include fontWeight_Medium;
  .icon {
    margin-right: toRem(7);
  }
}
.tooltip-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 100%;
  @include fadeOut;
  width: toRem(275);
  background-color: $rangoonGreen;
  padding: toRem(15);
  color: white;
  border-radius: toRem(10);
  :deep(a) {
    color: $neptune;
    @include fontWeight_Semibold;
  }
}
</style>
