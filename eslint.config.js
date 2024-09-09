// module.exports = {
//   parser: '@typescript-eslint/parser',
//   extends: [
//     'plugin:nestjs/recommended',
//     'plugin:@typescript-eslint/recommended'
//   ],
//   ignorePatterns: ['**/*.js', '**/*.jsx'],
//   plugins: ['@typescript-eslint', 'nestjs'],
//   rules: {
//     '@typescript-eslint/explicit-function-return-type': 'error',
//     '@typescript-eslint/interface-name-prefix': 'off',
//     '@typescript-eslint/no-explicit-any': 'off',
//     '@typescript-eslint/ban-ts-ignore': 'off',
//     'nestjs/use-validation-pipe': 'off',
//     'semi': ['error', 'never'],
//     'quotes': ['error', 'single'],
//     'curly': 'error',
//     'no-multiple-empty-lines': 'error',
//     'object-curly-spacing': ['error', 'always'],
//     'eol-last': ['error', 'always'],
//     'padding-line-between-statements': 'off',
//     'no-empty-function': 'warn',
//     '@typescript-eslint/padding-line-between-statements': [
//       'error',
//       { blankLine: 'always', prev: 'type', next: 'type' },
//       { blankLine: 'always', prev: 'class', next: 'export' },
//       { blankLine: 'always', prev: 'class', next: 'class' }
//     ],
//     'comma-dangle': ['error', {
//       'arrays': 'always-multiline',
//       'objects': 'always-multiline',
//       'imports': 'always-multiline',
//       'exports': 'always-multiline',
//       'functions': 'always-multiline',
//     }],
//   },
//   overrides: [
//     {
//       files: ['unit-test/**/*'],
//       rules: {
//         '@typescript-eslint/ban-ts-comment': 'off',
//         '@typescript-eslint/no-empty-function': 'off',
//       }
//     }
//   ]
// }

// import { FlatCompat } from '@eslint/eslintrc'
// import tsParser from '@typescript-eslint/parser'
// import tsPlugin from '@typescript-eslint/eslint-plugin'
// import nestjsPlugin from 'eslint-plugin-nestjs'
//
// const compat = new FlatCompat()
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const stylisticPlugin = require('@stylistic/eslint-plugin-ts')
const nestPlugin = require('eslint-plugin-nestjs')
const parser = require('@typescript-eslint/parser')
// export default [
module.exports = {
    name: 'mlm-config',
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parser
    },
    plugins: {
      // '@typescript-eslint': tsPlugin,
      tsPlugin,
      nestPlugin,
      stylisticPlugin,
      // '@typescript-eslint': tsPlugin,
      // '@typescript-eslint': '@typescript-eslint/eslint-plugin',
      // 'nestjs': nestjsPlugin,
      // 'nestjs': 'eslint-plugin-nestjs',
    },
    rules: {
      'nestjs/use-validation-pipe': 'off',
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'curly': 'error',
      'no-multiple-empty-lines': 'error',
      'object-curly-spacing': ['error', 'always'],
      'eol-last': ['error', 'always'],
      'padding-line-between-statements': 'off',
      'no-empty-function': 'warn',
      'tsPlugin/explicit-function-return-type': 'error',
      'stylisticPlugin/interface-name-prefix': 'off',
      'stylisticPlugin/no-explicit-any': 'off',
      'stylisticPlugin/ban-ts-ignore': 'off',
      'stylisticPlugin/padding-line-between-statements': [
      // '@typescript-eslint/padding-line-between-statements': [
      // 'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'type', next: 'type' },
        { blankLine: 'always', prev: 'class', next: 'export' },
        { blankLine: 'always', prev: 'class', next: 'class' }
      ],
      'comma-dangle': ['error', {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'always-multiline',
      }],
    },
  }
  // {
  //   files: ['unit-test/**/*'],
  //   rules: {
  //     '@typescript-eslint/ban-ts-comment': 'off',
  //     '@typescript-eslint/no-empty-function': 'off',
  //   },
  // }

//   ...compat.extends('plugin:nestjs/recommended'),
//   ...compat.extends('plugin:@typescript-eslint/recommended'),
// ]
