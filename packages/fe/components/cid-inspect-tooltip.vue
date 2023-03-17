<template>
  <Tooltip class="cid-inspect-tooltip" :align="align">
    <template #tooltip-btn>
      <TerminalIcon class="icon" />
      <a :href="link" target="_blank">
        {{ btnText }}</a>
    </template>
    <template #tooltip-box>
      <div v-html="tooltipText"></div>
    </template>
  </Tooltip>
</template>

<script>
// ===================================================================== Imports
import Tooltip from '@/modules/tooltip/components/tooltip'
import TerminalIcon from '@/components/icons/terminal.vue'

// ====================================================================== Export
export default {
  name: 'CidInspectTooltip',

  components: {
    Tooltip,
    TerminalIcon
  },

  props: {
    align: {
      type: String,
      required: false,
      default: 'center'
    },
    link: {
      type: String,
      required: true
    },
    tooltipText: {
      type: String,
      required: true
    },
    btnText: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.cid-inspect-tooltip {
  margin-top: toRem(10);
  &:hover {
    :deep(.tooltip-btn-wrapper) {
      color: $rangoonGreen;
    }
  }
}

:deep(.tooltip-btn-wrapper) {
  cursor: pointer;
  align-items: center;
  display: flex;
  color: $blue;
  @include fontSize_14;
  @include fontWeight_Medium;
  .icon {
    margin-right: toRem(7);
  }
  &:hover {
    color: $rangoonGreen;
  }
}

:deep(.tooltip-box-wrapper) {
  width: toRem(275);
  background-color: $rangoonGreen;
  padding: toRem(15);
  color: white;
  border-radius: toRem(10);
  a {
    color: $neptune;
    @include fontWeight_Semibold;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
