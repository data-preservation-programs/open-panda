import SliderBlock from './slider-block'

export default {
  title: 'SliderBlock',
  component: 'SliderBlock'
}

const defaultTemplate = {
  components: {
    SliderBlock
  },
  template: '<SliderBlock :block="block" />',
  props: {
    block: {}
  }
}

export const CircularSlider = args => (defaultTemplate)
CircularSlider.args = {
  block: {
    slider_type: 'circular',
    collection: ['a', 'b', 'c', 'd', 'e', 'f'],
    sliderGrid: {
      before: {
        num: 'col-12'
      },
      after: {
        num: 'col-10',
        push_left: 'off-1',
        push_right: 'off-1'
      }
    }
  }
}

export const TabbedSlider = args => (defaultTemplate)
TabbedSlider.args = {
  block: {
    slider_type: 'tabbed',
    collection: ['a', 'b', 'c', 'd', 'e', 'f'],
    sliderGrid: {
      tabs: {
        num: 'col-6'
      },
      slide: {
        num: 'col-6'
      }
    }
  }
}
