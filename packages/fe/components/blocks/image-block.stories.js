import ImageBlock from './image-block.vue'

export default {
  title: 'Blocks/ImageBlock',
  component: ImageBlock
}

const defaultTemplate = {
  components: {
    ImageBlock
  },
  template: '<div style="max-width: 400px"><ImageBlock :block="block"></div>',
  props: {
    block: {}
  }
}

export const Default = args => (defaultTemplate)
Default.args = {
  block: {
    src: 'https://dummyimage.com/550x740',
    caption: 'Caption'
  }
}
