module.exports = {
    root: true,
    extends: ['airbnb', 'prettier', 'plugin:node/recommended'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
        'no-unused-vars': 'warn',
        'no-console': 'off',
        'func-names': 'off',
        'no-process-exit': 'off',
        'object-shorthand': 'off',
        'class-methods-use-this': 'off',
        'node/no-unpublished-require': 'off',
    },
    globals: {
        IS_DEVELOPMENT: 'readonly',
    },
    parserOptions: {
        ecmasVersion: 2023,
    },
}
