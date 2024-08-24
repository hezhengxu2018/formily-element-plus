import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  { files: ['src/**/*.{ts}'] },
  { languageOptions: { globals: globals.browser } },
  eslintPluginUnicorn.configs['flat/recommended'],
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]
