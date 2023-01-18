// eslint-disable-next-line import/no-webpack-loader-syntax
import md from '!raw-loader!./init.md'

export default {
  title: 'Test',
  parameters: {
    previewTabs: {
      canvas: {
        hidden: true
      }
    },
    viewMode: 'docs',
    docs: {
      description: { component: md }
    }
  }
}

export const INIT = args => ({})
