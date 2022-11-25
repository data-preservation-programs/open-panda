module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'plugin:vue/essential'
  ],
  rules: {
    'no-console': process.env.NODE_ENV !== 'development' ? 'error' : 'off',
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never'
    }],
    'vue/multiline-html-element-content-newline': 'off',
    'vue/singleline-html-element-content-newline': ['error', {
      ignoreWhenNoAttributes: true,
      ignores: ['th', 'td', 'span', 'label']
    }],
    'no-trailing-spaces': ['error', {
      skipBlankLines: true
    }],
    'vue/html-self-closing': 'off',
    'vue/no-v-html': 'off',
    'no-lonely-if': 'off',
    'no-new': 'off',
    'no-prototype-builtins': 'off',
    'promise/param-names': 'off',
    'multiline-ternary': 'off',
    'vue/multi-word-component-names': 'off'
  }
}
