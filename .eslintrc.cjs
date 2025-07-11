/* eslint-env node */

module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Enforce consistent file extensions
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.jsx', '.tsx'] }
    ],
    // Require PropTypes for components
    'react/prop-types': 'error',
    // Prevent console.log in production
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    // Enforce consistent naming
    'camelcase': ['error', { properties: 'never' }],
    // Prevent unused variables
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    // TODO: Add accessibility rules when eslint-plugin-jsx-a11y is installed
  },
}
