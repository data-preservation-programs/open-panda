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
        </div>
        <div
          class="handle upper"
          :style="{ transform: `translateX(${upperBoundIndex * stepWidth}px)`}"
          @mousedown="mousedown('upper')">
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
  if (instance.$refs.segmentRow && instance.steps.length) {
    const chartWidth = instance.$refs.segmentRow.getBoundingClientRect().width
    instance.stepWidth = chartWidth / instance.steps.length
  }
}

// ====================================================================== Export
export default {
  name: 'DatasetHistogram',

  data () {
    return {
      lowerBoundIndex: 0,
      upperBoundIndex: 0,
      stepWidth: 0,
      resize: false,
      dragging: false
    }
  },

  computed: {
    ...mapGetters({
      datasetList: 'datasets/datasetList'
    }),
    steps () {
      const steps = []
      const datasetSizes = this.datasetList.map(dataset => dataset.data_size)
      const twentyTiB = 1099511627776 * 20
      const maxDatasetSize = Math.max(...datasetSizes)
      const stepNumber = maxDatasetSize / twentyTiB
      for (let i = 0; i < stepNumber; i++) {
        steps.push({
          min: twentyTiB * i,
          max: twentyTiB * (i + 1)
        })
      }
      return steps
    },
    segments () {
      const segments = []
      this.steps.forEach((step) => {
        const datasetsInStepRange = this.datasetList.filter(dataset => dataset.data_size >= step.min && dataset.data_size < step.max)
        segments.push(datasetsInStepRange)
      })
      return segments
    },
    normalizedSegments () {
      const lengths = this.segments.map(segment => segment.length)
      const maxLength = Math.max(...lengths)
      return lengths.map(l => Math.round((l / maxLength) * 100 * 100) / 100)
    }
  },

  mounted () {
    this.upperBoundIndex = this.segments.length
    calculateChartStepWidth(this)
    this.resize = () => { calculateChartStepWidth(this) }
    window.addEventListener('resize', this.resize)
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
      this.upperBoundIndex = Math.min(Math.max(index, this.lowerBoundIndex + 1), this.steps.length)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.dataset-histogram {
  width: 100%;
  padding: 1.5rem 3.125rem;
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
    top: -1.75rem;
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
}

</style>
