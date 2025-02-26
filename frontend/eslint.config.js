import { defineConfig } from 'eslint-define-config';
import globals from 'globals';
import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
});

export default defineConfig([
  {
    ignores: ['dist/', 'eslint.config.js', 'node_modules/'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'prettier/prettier': 'error',

      // Импорт
      'import/extensions': ['error', 'ignorePackages', { js: 'never', jsx: 'never' }],

      // React
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      'react/display-name': 'error',
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-boolean-value': ['error', 'never'],
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-one-expression-per-line': ['error', { allow: 'none' }],

      // Стиль кода
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
      'linebreak-style': ['error', 'unix'],
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-body-style': 'off',
      'arrow-parens': ['error', 'always'],
      'no-tabs': 'error',
      'no-trailing-spaces': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'max-len': ['error', { code: 100, ignoreUrls: true }],
      indent: ['error', 2, { SwitchCase: 1 }],
      'operator-linebreak': ['error', 'after'],
      'function-paren-newline': 'off',
      'implicit-arrow-linebreak': 'off',
      'no-confusing-arrow': ['error', { allowParens: true }],
      'prettier/prettier': 'off',
    },
  },
  ...compat.extends('airbnb-base', 'plugin:prettier/recommended'),
  eslintConfigPrettier,
]);
