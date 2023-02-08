module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', "jest-extended"],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', '**/*.spec.ts', '**/*.d.ts', '**/*.test.ts', '**/*.js'],
  rules: {
    'no-console': 'error',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: '*', next: 'block' },
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: 'block', next: '*' },
      { blankLine: 'always', prev: '*', next: 'if' },
      { blankLine: 'always', prev: 'if', next: '*' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: ['if', 'block', 'function', 'iife', 'expression'] },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
    ],
    curly: ['error', 'all'],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'index'],
      },
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': ['error'],
    '@typescript-eslint/array-type': ['error'],
  },
};
