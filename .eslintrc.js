module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: ['airbnb-base', 'prettier', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    plugins: ['prettier', 'jest'],
    rules: {
        'promise/catch-or-return': 'error',
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                semi: false,
            },
        ],
    },
}
