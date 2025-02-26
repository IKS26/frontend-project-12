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
      'import/no-unresolved': 0,

      // React
      'react/prop-types': 0,
      'react/react-in-jsx-scope': 0,
      'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      'react/display-name': 'off',
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-boolean-value': 'off',
      'react-hooks/exhaustive-deps': 'warn',

      // Стиль кода
      'object-curly-newline': ['error', { multiline: true, consistent: true, minProperties: 3 }],
      'linebreak-style': ['error', 'unix'],
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-body-style': 'off',
      'arrow-parens': ['error', 'always'],
      'no-tabs': 'error',
      'no-trailing-spaces': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'max-len': ['error', { code: 100, ignoreUrls: true }],
      indent: ['error', 2, { SwitchCase: 1 }],

      // Исправление ошибок
      'react/jsx-one-expression-per-line': 'off',
      'operator-linebreak': ['error', 'before'],
      'function-paren-newline': 'off',
      'implicit-arrow-linebreak': 'off',
      'no-confusing-arrow': 'off',
    },
  },
  ...compat.extends('airbnb-base', 'plugin:prettier/recommended'),
  eslintConfigPrettier,
]);
