import BlockBuilder from './block-builder.vue'
import TextBlock from './text-block.vue'
import ImageBlock from './image-block.vue'

export default {
  title: 'Blocks/BlockBuilder',
  component: BlockBuilder,
  parameters: {
    docs: {
      description: {
        component: 'Grid: https://gridlex.devlint.fr/.'
      }
    }
  }
}

const defaultTemplate = {
  components: {
    TextBlock,
    ImageBlock,
    BlockBuilder
  },
  template: '<BlockBuilder :sections="sections" />',
  props: {
    sections: {}
  }
}

export const Default = args => defaultTemplate
Default.args = {
  sections: {
    left_image: {
      grid: ['middle', 'center', 'noGutter'],
      col_1: {
        src: 'https://dummyimage.com/440x580',
        type: 'image_block',
        cols: {
          num: 'col-4_lg-5_md-12',
          push_left: '',
          push_right: 'off-1_md-0'
        }
      },
      col_2: {
        heading: 'Studio',
        description: 'We work with people who’ve inherited work, that doesn’t work. It usually starts with an itch and turns into a scratch—a product offering that needs to be recalibrated, fixing a Frankenstein website, elevating your UI, bridging conversion needs with user experience, reclaiming a software build that isn’t going the way you wanted, or creating a visual identity that people want to engage with.',
        type: 'text_block',
        cols: {
          num: 'col-5_lg-6_md-12',
          push_left: '',
          push_right: ''
        }
      }
    }
  }
}
