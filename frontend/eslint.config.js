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
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
        },
      ],
      'import/no-unresolved': 0,
      'react/prop-types': 0,
      'no-console': 0,
      'react/react-in-jsx-scope': 0,
      'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],
      'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      'testing-library/no-debug': 0,
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
      'linebreak-style': ['error', 'unix'],
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'react/jsx-props-no-spreading': 'off',
      'operator-linebreak': ['error', 'before'],
      'react/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-boolean-value': ['error', 'never'],
      'arrow-body-style': 'off',
      'arrow-parens': ['error', 'always'],
      'no-tabs': 'error',
      'max-len': ['error', { code: 100, ignoreUrls: true }],
      indent: ['error', 2, { SwitchCase: 1 }],
      'react-hooks/rules-of-hooks': 'error',
      'function-paren-newline': ['error', 'consistent'],
      'implicit-arrow-linebreak': 'off',
      'react/display-name': 'error',
    },
  },
  ...compat.extends('airbnb-base', 'plugin:prettier/recommended'),
  eslintConfigPrettier,
]);
