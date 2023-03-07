// eslint-disable-next-line import/no-webpack-loader-syntax
import md from '!raw-loader!../../README.md'

export default {
  title: 'Readme/Repo Readme',
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

export const RepoReadme = args => ({})
