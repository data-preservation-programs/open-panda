<template>
  <button
    :class="['copy-button', { 'is-copied': isCopied }]"
    @click="copy($event)">

    <IconFile class="icon file" />

    <IconFile class="icon file-plus" />

    <IconFileCheckmark class="icon file-checkmark" />

  </button>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import IconFile from '@/components/icons/copy'
import IconFileCheckmark from '@/components/icons/copy-checkmark'

// ====================================================================== Export
export default {
  name: 'CopyButton',

  components: {
    IconFile,
    IconFileCheckmark
  },

  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },

  computed: {
    ...mapGetters({
      clipboard: 'general/clipboard'
    }),
    isCopied () {
      return this.clipboard === this.value
    }
  },

  methods: {
    ...mapActions({
      setClipboard: 'general/setClipboard'
    }),
    copy (e) {
      e.stopPropagation()
      const value = this.value
      this.setClipboard(value)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.copy-button {
  display: flex;
  position: relative;
  &:hover {
    .icon {
      &.file {
        opacity: 0;
      }
      &.file-plus {
        opacity: 1;
      }
    }
  }
  &.is-copied {
    .icon {
      &.file,
      &.file-plus {
        opacity: 0;
      }
      &.file-checkmark {
        opacity: 1;
      }
    }
  }
}

.file {
  fill: rgba($rangoonGreen, 0.25);
}

.file-plus {
  fill: rgba($rangoonGreen, 1);
}

.file-checkmark {
  fill: $neptune;
  :deep(.checkmark) {
    fill: transparent;
  }
}

.icon {
  display: block;
  width: 0.875rem;
  transition: 100ms ease-in-out;
  &.file-plus,
  &.file-checkmark {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    opacity: 0;
  }
}

::v-deep path {
  transition: 250ms ease-in-out;
}
</style>
