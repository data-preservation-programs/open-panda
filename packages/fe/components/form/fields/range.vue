<template>
  <div :class="['field field-range', state, { focused, empty }]">

    <label v-if="label" :for="name" class="label floating">
      <span class="text">{{ label }}</span>
      <sup v-if="required" class="required">*</sup>
    </label>

    <div class="track">
      <div
        ref="thumb"
        :style="thumbPosition"
        class="thumb" />
      <div
        v-if="showProgressBar"
        :style="progressBarWidth"
        :class="['progress-bar', `progress-${value}`]" />
      <div v-if="showTicks" class="ticks">
        <span
          v-for="tick in 101"
          :key="tick"
          :style="{ transform: `translateX(${getTickPosition(tick)}px)` }"
          :class="['tick', { current: tick === value + 1 }]" />
      </div>
      <input
        :id="name"
        ref="input"
        :name="name"
        :value="value"
        :style="`--thumb-dimension-x: ${thumbDimensions.w}px; --thumb-dimension-y: ${thumbDimensions.h}px;`"
        :class="['range', state]"
        type="range"
        @focus="focused = true"
        @blur="focused = false"
        @input="$emit('updateValue', $event.target.value)" />
    </div>

    <input
      :value="value"
      :autocomplete="autocomplete"
      :class="['input', state]"
      :minlength="chars.min"
      :maxlength="chars.max"
      type="number"
      placeholder="0"
      @input="$emit('updateValue', $event.target.value)" />

  </div>
</template>

<script>
// =================================================================== Functions
const preValidate = (instance, val, pre) => {
  if (typeof pre !== 'string') { return }
  const regex = new RegExp(pre)
  let value = parseInt(val.replace(regex, ''))
  if (isNaN(value)) {
    value = 0
  } else if (value <= 0) {
    value = 0
  } else if (value > 100) {
    value = 100
  }
  instance.$emit('updateValue', value)
}

// ====================================================================== Export
export default {
  name: 'FieldInput',

  props: {
    field: {
      type: Object,
      required: true
    },
    showTicks: {
      type: Boolean,
      required: false,
      default: false
    },
    showProgressBar: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data () {
    return {
      focused: false,
      trackWidth: 0,
      thumbDimensions: {
        x: 0,
        y: 0
      }
    }
  },

  computed: {
    inputType () {
      return this.field.input_type || 'text'
    },
    name () {
      return this.field.name
    },
    label () {
      return this.field.label
    },
    placeholder () {
      return this.field.placeholder || 'Enter a value...'
    },
    autocomplete () {
      return this.field.autocomplete
    },
    required () {
      return this.field.required
    },
    disabled () {
      return this.field.disabled
    },
    pre () {
      return this.field.pre
    },
    chars () {
      return this.field.chars
    },
    validationMessage () {
      return this.field.validation_message
    },
    value () {
      return this.field.value
    },
    originalValue () {
      return this.field.originalValue
    },
    state () {
      return this.field.state
    },
    empty () {
      return this.value === ''
    },
    thumbPosition () {
      const tick = this.value
      return `left: calc(${tick}% - ${this.thumbDimensions.w * (tick / 100)}px)`
    },
    progressBarWidth () {
      const tick = this.value
      const thumbWidth = this.thumbDimensions.w
      return `width: calc(${tick}% - ${thumbWidth * (tick / 100) - (thumbWidth / 2)}px)`
    }
  },

  watch: {
    value (value) {
      preValidate(this, value + '', this.pre)
    }
  },

  mounted () {
    const thumb = this.$refs.thumb
    this.thumbDimensions = {
      w: thumb.offsetWidth,
      h: thumb.offsetHeight
    }
    this.trackWidth = this.$refs.input.offsetWidth
  },

  methods: {
    getTickPosition (tick) {
      return (this.trackWidth / 100 * tick) - (this.thumbDimensions.w * tick / 100) - 1
    }
  }
}
</script>

<style lang="scss" scoped>
$thumbWidth: 1.5rem;
$borderWidth: 2px;

// ///////////////////////////////////////////////////////////////////// General
.field-range {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 2.5rem;
}

.track {
  position: relative;
  width: 100%;
  height: 0.75rem;
  margin-right: 1rem;
  border: 2px solid tomato;
  border-radius: 0.5rem;
  &:hover {
    .thumb {
      &:before {
        width: 100%;
        transform: translateX(0);
      }
    }
  }
}

.thumb {
  position: absolute;
  top: 50%;
  width: $thumbWidth;
  height: 350%;
  border: $borderWidth solid transparent;
  border-radius: 0.25rem;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 10;
  &:before {
    content: '';
    position: absolute;
    top: -$borderWidth;
    left: -$borderWidth;
    width: 0px;
    height: 100%;
    border-width: inherit;
    border-style: solid;
    border-color: tomato;
    border-radius: inherit;
    pointer-events: inherit;
    background-color: tomato;
    transform: translateX(calc(#{math.div($thumbWidth, 2)} - #{$borderWidth}));
    transition: 150ms linear;
  }
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 0.5rem;
  background-color: tomato;
  &.progress-100 {
    width: 100% !important;
  }
}

.ticks {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
}

.tick {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  background-color: darkorange;
  border-radius: 1px;
  transition: 150ms linear;
  &.current {
    ~ .tick {
      background-color: tomato;
      opacity: 0.5;
    }
  }
}

.range {
  position: relative;
  display: block;
  appearance: none;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 15;
  &:focus {
    outline: none;
  }
  @include inputRange ('thumb') {
    appearance: none;
    position: relative;
    top: 50%;
    left: 0;
    width: var(--thumb-dimension-x);
    height: var(--thumb-dimension-y);
    transform: translateY(-50%);
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  }
  @include inputRange ('track') {
    appearance: none;
    width: 100%;
    height: 100%;
    border-color: transparent;
    color: transparent;
    cursor: pointer;
  }
}

.input {
  appearance: none;
  width: 2.875rem;
  padding: 0.5rem;
  border: 2px solid tomato;
  border-radius: 0.5rem;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }
}
</style>
