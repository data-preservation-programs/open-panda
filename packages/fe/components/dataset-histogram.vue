<template>
  <div :class="['dataset-histogram', { dragging }]">
    <div class="chart">

      <div
        ref="segmentRow"
        class="segment-row">
        <div
          v-for="(percentage, i) in normalizedSegments"
          :key="`segment-${i}`"
          ref="segments"
          :class="['segment', { selected: i >= lowerBoundIndex && i < upperBoundIndex }]"
          :style="{ height: `calc(${percentage}% + 4px)` }">
        </div>
      </div>

      <div
        class="controls">
        <div
          class="handle lower"
          :style="{ transform: `translateX(${lowerBoundIndex * stepWidth}px)`}"
          @mousedown="mousedown('lower')">
          <div class="text">
            {{ lowerBoundText }}
          </div>
        </div>
        <div
          class="handle upper"
          :style="{ transform: `translateX(${upperBoundIndex * stepWidth}px)`}"
          @mousedown="mousedown('upper')">
          <div class="text">
            {{ upperBoundText }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// ====================================================================== Import
import { mapGetters } from 'vuex'

// =================================================================== Functions
const calculateChartStepWidth = (instance) => {
  if (instance.$refs.segmentRow && instance.segments && instance.segments.length) {
    const chartWidth = instance.$refs.segmentRow.getBoundingClientRect().width
    instance.stepWidth = chartWidth / instance.segments.length
  }
}

// ====================================================================== Export
export default {
  name: 'DatasetHistogram',

  data () {
    return {
      bars: 40,
      lowerBoundIndex: 0,
      upperBoundIndex: 0,
      stepWidth: 0,
      resize: false,
      dragging: false
    }
  },

  computed: {
    ...mapGetters({
      datasetList: 'datasets/datasetList',
      histogramData: 'datasets/histogramData'
    }),
    segments () {
      return this.histogramData ? this.histogramData.segments : false
    },
    normalizedSegments () {
      const counts = this.segments.map(segment => segment.count)
      const maxLength = Math.max(...counts)
      return counts.map(x => Math.round((x / maxLength) * 100 * 100) / 100)
    },
    lowerBoundText () {
      if (this.segments && this.segments.length) {
        const formatted = this.$formatBytes(this.segments[this.lowerBoundIndex].min, false)
        return `${Math.round(parseFloat(formatted.value))} ${formatted.unit}`
      }
      return '-'
    },
    upperBoundText () {
      if (this.segments && this.segments.length) {
        const index = Math.max(0, this.upperBoundIndex - 1)
        const formatted = this.$formatBytes(this.segments[index].max, false)
        return `${Math.round(parseFloat(formatted.value))} ${formatted.unit}`
      }
      return '-'
    }
  },

  watch: {
    segments () {
      this.$nextTick(() => {
        this.upperBoundIndex = this.segments.length
        calculateChartStepWidth(this)
      })
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.upperBoundIndex = this.segments.length
      calculateChartStepWidth(this)
      this.resize = () => { calculateChartStepWidth(this) }
      window.addEventListener('resize', this.resize)
    })
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    mousedown (handle) {
      document.onmousemove = this.$throttle((e) => { this.drag(e, handle) })
      document.onmouseup = this.mouseup
      this.dragging = true
    },
    drag (e, handle) {
      if (this.$refs.segmentRow) {
        const chart = this.$refs.segmentRow.getBoundingClientRect()
        const x = e.clientX - chart.left + (this.stepWidth / 2)
        const y = e.clientY - chart.top
        // -50 & 50 is horizontal padding around chart, and -24 & 24 is vertical padding
        if (x >= -50 && x <= chart.width + 50 && y >= -24 && y <= chart.height + 24) {
          if (handle === 'lower') {
            this.setLowerBound(Math.floor(x / this.stepWidth))
          }
          if (handle === 'upper') {
            this.setUpperBound(Math.floor(x / this.stepWidth))
          }
        } else {
          this.mouseup()
        }
      } else {
        this.mouseup()
      }
    },
    mouseup () {
      document.onmousemove = null
      document.onmouseup = null
      this.dragging = false
    },
    setLowerBound (index) {
      this.lowerBoundIndex = Math.max(Math.min(index, this.upperBoundIndex - 1), 0)
    },
    setUpperBound (index) {
      if (this.segments && this.segments.length) {
        this.upperBoundIndex = Math.min(Math.max(index, this.lowerBoundIndex + 1), this.segments.length)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.dataset-histogram {
  width: 100%;
  padding: 1.5rem 3.125rem;
  margin-bottom: 1.5rem;
  &.dragging {
    cursor: grabbing;
    .handle {
      cursor: grabbing !important;
    }
  }
}

.segment-row {
  position: relative;
  width: 100%;
  height: toRem(90);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
}

.segment {
  position: relative;
  flex-grow: 1;
  background-color: $athensGray;
  &:not(:last-child) {
    margin-right: 3px;
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      right: -3px;
      width: 3px;
      height: 4px;
      background-color: inherit;
    }
  }
  &.selected {
    background-color: black;
  }
}

.controls {
  position: relative;
  width: 100%;
  .handle {
    position: absolute;
    left: -1.75rem;
    top: -1.875rem;
    width: 3.5rem;
    height: 3.5rem;
    padding: 1rem;
    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 1rem;
      left: 1rem;
      width: calc(100% - 2.125rem);
      height: calc(100% - 2.125rem);
      border: solid 1px black;
      border-radius: 50%;
      background-color: white;
    }
    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='6' height='13' viewBox='0 0 6 13' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0.5 1V12' stroke='%231B1F12' stroke-linecap='round'/%3e%3cpath d='M5 1V12' stroke='%231B1F12' stroke-linecap='round'/%3e%3c/svg%3e ");
      background-repeat: no-repeat;
      background-position: center;
    }
    &:hover {
      cursor: pointer;
    }
  }
  .text {
    position: absolute;
    top: calc(100% - 0.625rem);
    left: 50%;
    transform: translateX(-50%);
    @include fontSize_16;
    @include fontWeight_Medium;
    white-space: nowrap;
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
       -khtml-user-select: none; /* Konqueror HTML */
         -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
  }
}

</style>
