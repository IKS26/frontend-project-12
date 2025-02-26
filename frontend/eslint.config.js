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
      'react/react-in-jsx-scope': 0,
      'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],
      'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-boolean-value': 'off', // Разрешить писать `hideProgressBar={true}`
      'react/display-name': 'off', // Отключаем ошибку отсутствия displayName в компонентах
      'react/jsx-one-expression-per-line': 'off', // Отключаем требование переноса выражений в JSX
      'react/jsx-props-no-spreading': 'off', // Разрешить {...props}
      'react-hooks/rules-of-hooks': 'error', // Следит за правильным порядком хуков
      'arrow-parens': ['error', 'always'], // Всегда требовать скобки в стрелочных функциях
      'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: false }], // Разрешить фигурные скобки в стрелочных функциях
      'object-curly-newline': 'off', // Отключаем переносы внутри объектов
      'comma-dangle': ['error', 'always-multiline'],
      'operator-linebreak': 'off', // Отключить ошибки переноса операторов (&&, =)
      'implicit-arrow-linebreak': 'off', // Отключаем ошибку разрыва строки перед `=>`
      'function-paren-newline': 'off', // Отключаем ошибку переноса скобок в функциях
      'max-len': ['error', { code: 120, ignoreStrings: true, ignoreTemplateLiterals: true }], // Увеличить лимит длины строки
      'linebreak-style': ['error', 'unix'],
      'no-tabs': 'error',
      indent: ['error', 2, { SwitchCase: 1 }],
    },
  },
  ...compat.extends('airbnb-base', 'plugin:prettier/recommended'),
  eslintConfigPrettier,
]);
