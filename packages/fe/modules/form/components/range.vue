<template>
  <div :class="['range-container', state, { focused }]">

    <div class="range-track">
      <div
        ref="thumb"
        class="thumb-container"
        :style="thumbPosition">
        <slot name="thumb" />
      </div>

      <div
        :style="progressBarWidth"
        class="progress-bar-container">
        <slot name="progress-bar" :tick="tick" />
      </div>

      <input
        :id="fieldKey"
        ref="input"
        :position="position"
        :name="fieldKey"
        :value="position"
        :min="min"
        :max="steps"
        :style="rangeStyling"
        :class="['range', state]"
        :disabled="disabled"
        type="range"
        @focus="focused = true"
        @blur="focused = false"
        @input="updateValue($event.target.value)" />
    </div>

    <slot
      name="tick-list"
      :get-position="getPosition"
      :get-tick="getTick" />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'FieldRange',

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
    const self = this
    return {
      position: self.field.min,
      focused: false,
      thumbDimensions: {
        x: 0,
        y: 0
      },
      format: false,
      steps: self.field.max,
      transform: false,
      positionList: []
    }
  },

  computed: {
    scaffold () {
      return this.field.scaffold
    },
    disabled () {
      return this.scaffold.disabled
    },
    pre () {
      return this.scaffold.pre
    },
    value () {
      return this.field.value
    },
    min () {
      return this.logarithmic ? 1 : this.scaffold.min
    },
    max () {
      return this.scaffold.max
    },
    intervals () {
      return this.scaffold.intervals
    },
    logarithmic () {
      return this.scaffold.hasOwnProperty('intervals')
    },
    state () {
      return this.field.state
    },
    tick () {
      return this.getTick(this.position)
    },
    thumbPosition () {
      const tick = this.tick
      const thumbHeight = this.thumbDimensions.h
      return `left: calc(${tick}% - ${thumbHeight * (tick / 100)}px)`
    },
    progressBarWidth () {
      const tick = this.tick
      const thumbHeight = this.thumbDimensions.h
      return `width: calc(${tick}% - ${thumbHeight * (tick / 100)}px + ${thumbHeight}px)`
    },
    rangeStyling () {
      const thumbDimensions = this.thumbDimensions
      const width = this.format === 'line' ? thumbDimensions.h : thumbDimensions.w
      return `--thumb-dimension-x: ${width}px; --thumb-dimension-y: ${thumbDimensions.h}px;`
    }
  },

  watch: {
    value (value) {
      this.position = this.getPosition(value)
    }
  },

  created () {
    if (this.logarithmic) {
      const [steps, transform] = this.getScaleTransform()
      this.steps = steps
      this.transform = transform
      this.positionList = this.getPositionList()
    }
    this.position = this.getPosition(this.value)
  },

  mounted () {
    this.$nextTick(() => {
      const thumb = this.$refs.thumb
      this.thumbDimensions = {
        w: thumb.offsetWidth,
        h: thumb.offsetHeight
      }
      this.format = this.thumbDimensions.w === this.thumbDimensions.h ? 'square' : 'line'
    })
  },

  methods: {
    getScaleTransform () {
      const min = this.min
      const max = this.max
      const intervals = this.intervals
      const numIntervals = intervals.length
      const descreteSteps = Math.ceil(
        (max - min) / intervals.reduce((total, step) => total + step / numIntervals, 0)
      )
      return [
        descreteSteps,
        (input) => {
          const stepTransforms = intervals.map((s, i) => {
            const setCount = Math.min(Math.ceil(input - (descreteSteps * i / numIntervals)), Math.round(descreteSteps / numIntervals))
            return setCount > 0 ? setCount * s : 0
          })
          let lastStep = 0
          const out = Math.round(stepTransforms.reduce((total, num, i) => {
            if (num) { lastStep = i }
            return total + num
          })) + min
          const currentUnit = intervals[lastStep]
          return Math.min(
            Math.round((out / currentUnit)) * currentUnit,
            max
          )
        }
      ]
    },
    updateValue (value) {
      this.$emit('updateValue', this.logarithmic ? this.transform(value) : value)
    },
    getPosition (value) {
      if (!this.logarithmic) { return value }
      const positionList = this.positionList
      const len = positionList.length
      let last
      for (let i = 0; i < len; i++) {
        const item = positionList[i]
        if (value >= item.value) { last = i + 1 }
      }
      return last || this.min
    },
    getPositionList () {
      const steps = this.steps
      const compiled = []
      for (let i = 0; i < steps; i++) {
        const step = i + 1
        compiled.push({
          tick: this.getTick(step),
          value: this.transform(step)
        })
      }
      return compiled
    },
    getTick (position) {
      const min = this.min
      if (this.logarithmic) {
        return ((position - min) / (this.steps - min)) * 100
      }
      return Math.min((position / this.max) * 100, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.range-track {
  position: relative;
  width: 100%;
  box-sizing: content-box;
}

.thumb-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 10;
}

.progress-bar-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

@mixin thumb {
  appearance: none;
  position: relative;
  top: 50%;
  left: 0;
  width: var(--thumb-dimension-x);
  height: var(--thumb-dimension-y);
  opacity: 0;
  transform: translateY(-50%);
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
}

@mixin track {
  appearance: none;
  width: 100%;
  height: 100%;
  border-color: transparent;
  color: transparent;
  opacity: 0;
  cursor: pointer;
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
  &::-webkit-slider-thumb {
    @include thumb;
  }
  &::-moz-range-thumb {
    @include thumb;
  }
  &::-ms-thumb {
    @include thumb;
  }
  &::-webkit-slider-runnable-track {
    @include track;
  }
  &::-moz-range-track {
    @include track;
  }
  &::-ms-track {
    @include track;
  }
}
</style>
