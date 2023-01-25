<template>
  <div :class="['field field-range', state, { focused }]">

    <label v-if="label" :for="name" class="label floating">
      <span class="text">{{ label }}</span>
      <sup v-if="required" class="required">*</sup>
    </label>

    <Range
      ref="range"
      :field="field"
      :field-key="fieldKey"
      v-on="$listeners">

      <template #thumb>
        <div class="thumb" />
      </template>

      <template #progress-bar>
        <div ref="progressBar" class="progress-bar">
          <div class="tick-list">
            <div
              v-for="line in numTicks"
              :key="line"
              class="line" />
          </div>
        </div>
      </template>

      <template #tick-list="{ getPosition, getTick }">
        <div class="positions">
          <div class="position start" :style="{ left: `${getTick(getPosition(34359738368)) }%` }">
            32 GiB
          </div>
          <div class="position middle" :style="{ left: `${getTick(getPosition(109951162777600)) }%` }">
            100 TiB
          </div>
          <div class="position end" :style="{ left: `${getTick(getPosition(5629499534213120)) }%` }">
            5 PiB
          </div>
        </div>
      </template>

    </Range>

  </div>
</template>

<script>
// ===================================================================== Imports
import Range from '@/modules/form/components/range'

// ====================================================================== Export
export default {
  name: 'FieldRange',

  components: {
    Range
  },

  props: {
    field: {
      type: Object,
      required: true
    },
    fieldKey: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      focused: false,
      numTicks: 0
    }
  },

  computed: {
    scaffold () {
      return this.field.scaffold
    },
    name () {
      return this.scaffold.name
    },
    label () {
      return this.scaffold.label
    },
    placeholder () {
      return this.scaffold.placeholder || 'Enter a value...'
    },
    required () {
      return this.scaffold.required
    },
    disabled () {
      return this.scaffold.disabled
    },
    pre () {
      return this.scaffold.pre
    },
    validationMessage () {
      return this.scaffold.validationMessage
    },
    value () {
      return this.field.value
    },
    originalValue () {
      return this.field.originalValue
    },
    state () {
      return this.field.state
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.numTicks = Math.ceil(this.$refs.range.$el.clientWidth / 3)
    })
  }
}
</script>

<style lang="scss" scoped>
$trackHeight: 1.875rem;
$thumbWidth: 4px;
$borderWidth: 2px;

// ///////////////////////////////////////////////////////////////////// General
.field-range {
  &.caution,
  &.error {
    :deep(.range-track) {
      &:before {
        transition: 150ms ease-in;
      }
    }
  }
  &.caution {
    :deep(.range-track) {
      &:before {
        background-color: darkorange;
      }
    }
  }
  &.error {
    :deep(.range-track) {
      &:before {
        background-color: red;
      }
    }
  }
}

// /////////////////////////////////////////////////////////////////////// Track
::v-deep .range-track {
  position: relative;
  left: calc(#{math.div(-$trackHeight, 2)} + #{math.div($thumbWidth, 2)});
  height: $trackHeight;
  width: calc(100% + #{$trackHeight} - #{math.div($thumbWidth, 1)});
  margin-bottom: $borderWidth;
  &:before {
    content: '';
    position: absolute;
    top: 100%;
    left: calc(#{math.div($trackHeight, 2)} - #{math.div($thumbWidth, 2)});
    width: calc(100% - #{$trackHeight} + #{math.div($thumbWidth, 1)});
    height: $borderWidth;
    background-color: white;
    transition: 150ms ease-out;
  }
  &:hover {
    .thumb {
      &:before,
      &:after {
        height: 0.75rem;
      }
    }
  }
  &.disabled {
    cursor: no-drop;
    border-bottom-color: rgba(246, 245, 255, 0.25);
  }
}

// /////////////////////////////////////////////////////////////////////// Thumb
.thumb {
  position: relative;
  left: calc(#{math.div($trackHeight, 2)} - #{math.div($thumbWidth, 2)});
  top: 0;
  width: $thumbWidth;
  height: $trackHeight;
  background-color: white;
  &:before,
  &:after {
    content: '';
    position: absolute;
    bottom: 100%;
    height: 0.5rem;
    width: 50%;
    pointer-events: inherit;
    background-color: inherit;
    transition: all 150ms linear;
  }
  &:before {
    content: '';
    right: 50%;
  }
  &:after {
    content: '';
    left: 50%;
  }
}

// //////////////////////////////////////////////////////////////// Progress Bar
.progress-bar {
  position: relative;
  left: calc(#{math.div($trackHeight, 2)} - #{math.div($thumbWidth, 2)});
  width: calc(100% - #{$trackHeight} + #{math.div($thumbWidth, 1)});
  height: 100%;
  overflow: hidden;
}

.tick-list {
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.line {
  background-color: white;
  width: 1px;
  height: 100%;
  &:not(:last-child) {
    margin-right: 2px;
  }
}

// /////////////////////////////////////////////////////////////////// Positions
.positions {
  position: relative;
  margin-top: 0.5rem;
}

.position {
  position: absolute;
  top: 0;
  font-size: toRem(14);
  white-space: nowrap;
  &.middle {
    transform: translateX(-50%);
  }
  &.end {
    transform: translateX(-100%);
  }
}
</style>
