const tsPlugin = require('@typescript-eslint/eslint-plugin')
const stylisticPlugin = require('@stylistic/eslint-plugin-ts')
const nestPlugin = require('eslint-plugin-nestjs')
const parser = require('@typescript-eslint/parser')
const recommendedTsRules = require('@typescript-eslint/eslint-plugin').configs.recommended.rules
const recommendedNestRules = require('eslint-plugin-nestjs').configs.recommended.rules

module.exports = {
    name: 'mlm-config',
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['**/*.js', '**/*.jsx'],
    languageOptions: {
        parser,
    },
    plugins: {
        stylisticPlugin,
        '@typescript-eslint': tsPlugin,
        'nestjs': nestPlugin
    },

    rules: {
        ...recommendedTsRules,
        ...recommendedNestRules,
        'nestjs/use-validation-pipe': 'off',
        'semi': ['error', 'never'],
        'quotes': ['error', 'single'],
        'curly': 'error',
        'no-multiple-empty-lines': 'error',
        'object-curly-spacing': ['error', 'always'],
        'eol-last': ['error', 'always'],
        'padding-line-between-statements': 'off',
        'no-empty-function': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'error',
        'stylisticPlugin/interface-name-prefix': 'off',
        'stylisticPlugin/no-explicit-any': 'off',
        'stylisticPlugin/ban-ts-ignore': 'off',
        'stylisticPlugin/padding-line-between-statements': [
            'error',
            {blankLine: 'always', prev: 'type', next: 'type'},
            {blankLine: 'always', prev: 'class', next: 'export'},
            {blankLine: 'always', prev: 'class', next: 'class'},
        ],
        'comma-dangle': ['error', {
            'arrays': 'always-multiline',
            'objects': 'always-multiline',
            'imports': 'always-multiline',
            'exports': 'always-multiline',
            'functions': 'always-multiline',
        }],
        'indent': ['error', 4],
    },
}
