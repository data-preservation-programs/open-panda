module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: 'standard',
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-lonely-if': 'off',
    'no-new': 'off',
    'no-prototype-builtins': 'off',
    'multiline-ternary': 'off',
    'prefer-regex-literals': 'off'
  }
}
