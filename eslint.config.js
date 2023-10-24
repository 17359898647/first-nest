const eslint = require('ge-eslint')

module.exports = eslint({
  rules: {
    'ts/consistent-type-imports': 0,
  },
  sortKeysOptions: true,
  typescript: true,
  vue: false,
})
