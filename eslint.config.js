const globals = require('globals');
const pluginJs = require('@eslint/js');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  prettierConfig,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  pluginJs.configs.recommended,
];
