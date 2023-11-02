const eslint = require('ge-eslint')

module.exports = eslint({
  rules: {
    'ts/consistent-type-imports': 0,
  },
  sortKeysOptions: false,
  typescript: true,
  vue: false,
})
