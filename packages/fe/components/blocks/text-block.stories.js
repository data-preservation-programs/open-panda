import TextBlock from './text-block.vue'

export default {
  title: 'Blocks/TextBlock',
  component: TextBlock
}

const defaultTemplate = {
  components: {
    TextBlock
  },
  template: '<TextBlock :block="block">',
  props: {
    block: {}
  }
}

export const Left = args => (defaultTemplate)
Left.args = {
  block: {
    align: 'left',
    heading: 'Heading',
    description: 'Lörem ipsum treligen dinat åsk i kifed den äjotiktigt. Pseudosade sesis supralåsk. Ambikemi terrakrati än nivis falingar. Intralingar homol. Sakösade. Bionde tirade. Plaras erat semition, kontraren mira. Våsa nessade hyposk isade änin.'
  }
}

export const Center = args => (defaultTemplate)
Center.args = {
  block: {
    align: 'center',
    heading: 'Heading',
    description: 'Lörem ipsum treligen dinat åsk i kifed den äjotiktigt. Pseudosade sesis supralåsk. Ambikemi terrakrati än nivis falingar. Intralingar homol. Sakösade. Bionde tirade. Plaras erat semition, kontraren mira. Våsa nessade hyposk isade änin.',
    ctas: [
      {
        text: 'Button 1',
        type: 'underline'
      },
      {
        text: 'Button 2',
        type: 'solid'
      }
    ]
  }
}

export const Right = args => (defaultTemplate)
Right.args = {
  block: {
    align: 'right',
    heading: 'Heading',
    description: 'Lörem ipsum treligen dinat åsk i kifed den äjotiktigt. Pseudosade sesis supralåsk. Ambikemi terrakrati än nivis falingar. Intralingar homol. Sakösade. Bionde tirade. Plaras erat semition, kontraren mira. Våsa nessade hyposk isade änin.',
    ctas: [
      {
        text: 'Button 1',
        type: 'solid'
      },
      {
        text: 'Button 2',
        type: 'underline'
      }
    ]
  }
}
