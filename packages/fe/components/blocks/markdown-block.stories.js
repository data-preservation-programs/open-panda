import MarkdownBlock from './markdown-block.vue'

export default {
  title: 'Blocks/MarkdownBlock',
  components: MarkdownBlock
}

const defaultTemplate = {
  components: {
    MarkdownBlock
  },
  template: '<MarkdownBlock :block="block">',
  props: {
    block: {}
  }
}

export const Default = args => (defaultTemplate)
Default.args = {
  block: {
    content: '| Company | Contact | Country | Test | Test 2 |\n|----------------------------|--------------|---------|------|--------|\n| Alfreds Futterkiste | Maria Anders | Germany | x | x |\n| Centro comercial Moctezuma | Maria Anders | Mexico | x | x |\n| Ernst Handel | Maria Anders | Norway | x | x |'
  }
}
