module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  rules: {
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'max-len': [2, { code: 120 }],
    // https://stackoverflow.com/a/65768375/2780052
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    // https://github.com/typescript-eslint/typescript-eslint/issues/2621
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
